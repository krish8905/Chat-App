from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import Dict, List

from app.db.session import SessionLocal
from app.models.user import User
from app.models.chat import Message, ChatRoom
from app.core.security import decode_access_token
from sqlalchemy import and_, or_
from app.models.chat import DmRoom

router = APIRouter(tags=["WS"])


class RoomManager:
    def __init__(self):
        # room_id -> { WebSocket -> user_id }
        self.rooms: Dict[int, Dict[WebSocket, int]] = {}

    async def connect(self, room_id: int, ws: WebSocket, user_id: int):
        if room_id not in self.rooms:
            self.rooms[room_id] = {}
        self.rooms[room_id][ws] = user_id

    def disconnect(self, room_id: int, ws: WebSocket):
        if room_id in self.rooms and ws in self.rooms[room_id]:
            del self.rooms[room_id][ws]

        # optional cleanup
        if room_id in self.rooms and len(self.rooms[room_id]) == 0:
            del self.rooms[room_id]

    async def broadcast(self, room_id: int, message: dict):
        # send to a copy, so we can remove dead sockets safely
        ws_dict = self.rooms.get(room_id, {})
        sockets = list(ws_dict.keys())
        for sock in sockets:
            try:
                await sock.send_json(message)
            except Exception:
                # if send fails, remove socket
                self.disconnect(room_id, sock)

    def get_users_in_room(self, room_id: int) -> List[int]:
        if room_id not in self.rooms:
            return []
        return list(set(self.rooms[room_id].values()))

    def get_all_online_users(self) -> List[int]:
        users = set()
        for ws_dict in self.rooms.values():
            for uid in ws_dict.values():
                users.add(uid)
        return list(users)

    async def broadcast_global(self, message: dict):
        for room_id, ws_dict in list(self.rooms.items()):
            sockets = list(ws_dict.keys())
            for sock in sockets:
                try:
                    await sock.send_json(message)
                except Exception:
                    self.disconnect(room_id, sock)


manager = RoomManager()


def get_user_from_token(db: Session, token: str):
    payload = decode_access_token(token)
    if not payload:
        return None

    email = payload.get("sub")
    if not email:
        return None

    return db.query(User).filter(User.email == email).first()


@router.websocket("/ws/chat/{room_id}")
async def ws_chat(ws: WebSocket, room_id: int):
    # ✅ IMPORTANT: accept first (prevents 403 rejection)
    await ws.accept()

    token = ws.query_params.get("token")
    if not token:
        await ws.close(code=1008)
        return

    db: Session = SessionLocal()
    try:
        # ✅ Auth
        user = get_user_from_token(db, token)
        if not user:
            await ws.close(code=1008)
            return

        # ✅ Ensure room exists (prevents FK error)
        room = db.query(ChatRoom).filter(ChatRoom.id == room_id).first()
        if not room:
            # NOTE: if your ChatRoom fields differ, change here
            room = ChatRoom(id=room_id, name="Global Room", is_group=True)
            db.add(room)
            db.commit()

        # ✅ Track socket in memory
        await manager.connect(room_id, ws, user.id)

        # ✅ Send globally online users to the newly joined user
        exist_users = manager.get_all_online_users()
        for uid in exist_users:
            if uid != user.id:
                await ws.send_json({"type": "status", "user_id": uid, "status": "online"})

        # ✅ Joined message
        await manager.broadcast(
            room_id,
            {"type": "system", "text": f"🟢 {user.username} joined room {room_id}"},
        )
        await manager.broadcast_global(
            {"type": "status", "user_id": user.id, "status": "online"},
        )

        # ✅ Loop
        while True:
            data = await ws.receive_json()
            
            msg_type = data.get("type", "message")
            
            if msg_type in ("typing", "stop_typing"):
                await manager.broadcast(
                    room_id,
                    {
                        "type": msg_type,
                        "user_id": user.id,
                        "room_id": room_id
                    }
                )
                continue
            
            if msg_type == "mark_seen":
                msg_ids = data.get("msg_ids", [])
                if msg_ids:
                    db.query(Message).filter(Message.id.in_(msg_ids)).update({"status": "seen"}, synchronize_session=False)
                    db.commit()
                    await manager.broadcast(
                        room_id,
                        {
                            "type": "message_status",
                            "status": "seen",
                            "msg_ids": msg_ids
                        }
                    )
                continue

            # ✅ WebRTC Signaling
            if msg_type in ("call_user", "offer", "answer", "ice", "end_call"):
                # Simply relay these WebRTC signals to everyone else in the room
                # In a 1-to-1 WebRTC call, the other person receives the offer, answer, or ice candidates
                await manager.broadcast(
                    room_id,
                    {
                        "type": msg_type,
                        "sender_id": user.id,
                        # Pass through whichever payload is relevant (sdp, candidate, etc)
                        **{k: v for k, v in data.items() if k not in ("type", "sender_id")}
                    }
                )
                continue

            if msg_type == "delete_message_for_everyone":
                msg_id = data.get("msg_id")
                if msg_id:
                    msg = db.query(Message).filter(Message.id == msg_id, Message.sender_id == user.id).first()
                    if msg:
                        db.delete(msg)
                        db.commit()
                        await manager.broadcast(
                            room_id,
                            {
                                "type": "delete_message_for_everyone",
                                "msg_id": msg_id
                            }
                        )
                continue

            if msg_type == "delete_messages_for_everyone":
                msg_ids = data.get("msg_ids", [])
                if msg_ids:
                    msgs = db.query(Message).filter(Message.id.in_(msg_ids), Message.sender_id == user.id).all()
                    if msgs:
                        deleted_ids = [m.id for m in msgs]
                        db.query(Message).filter(Message.id.in_(deleted_ids)).delete(synchronize_session=False)
                        db.commit()
                        await manager.broadcast(
                            room_id,
                            {
                                "type": "delete_messages_for_everyone",
                                "msg_ids": deleted_ids
                            }
                        )
                continue

            text = (data.get("text") or "").strip()
            if not text:
                continue

            reply_to_id = data.get("reply_to_id")
            reply_to_text = None
            reply_to_sender = None

            if reply_to_id:
                reply_msg = db.query(Message).filter(Message.id == reply_to_id).first()
                if reply_msg:
                    reply_to_text = reply_msg.content
                    reply_sender_user = db.query(User).filter(User.id == reply_msg.sender_id).first()
                    if reply_sender_user:
                        reply_to_sender = reply_sender_user.username

            users_in_room = manager.get_users_in_room(room_id)
            is_delivered = len(users_in_room) > 1
            initial_status = "delivered" if is_delivered else "sent"

            # ✅ Save message
            msg = Message(room_id=room_id, sender_id=user.id, content=text, status=initial_status, reply_to_id=reply_to_id)
            db.add(msg)
            db.commit()
            db.refresh(msg)

            # ✅ Broadcast
            await manager.broadcast(
                room_id,
                {
                    "type": "message",
                    "id": msg.id,
                    "room_id": msg.room_id,
                    "sender_id": msg.sender_id,
                    "sender": user.username,
                    "text": msg.content,
                    "status": msg.status,
                    "reply_to_id": msg.reply_to_id,
                    "reply_to_text": reply_to_text,
                    "reply_to_sender": reply_to_sender,
                    "created_at": msg.created_at.isoformat() if msg.created_at else None,
                },
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, ws)
        if user:
            # If user is no longer in any room, broadcast offline globally
            if user.id not in manager.get_all_online_users():
                await manager.broadcast_global({"type": "status", "user_id": user.id, "status": "offline"})
            # optional system message:
            # await manager.broadcast(room_id, {"type": "system", "text": f"🔴 {user.username} left"})
    finally:
        db.close()

def user_can_access_room(db: Session, user_id: int, room_id: int) -> bool:
    # User must be part of the DM pair mapped to this room
    dm = db.query(DmRoom).filter(
        and_(
            DmRoom.room_id == room_id,
            or_(DmRoom.user_a_id == user_id, DmRoom.user_b_id == user_id)
        )
    ).first()
    return dm is not None
