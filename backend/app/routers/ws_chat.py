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
        self.rooms: Dict[int, List[WebSocket]] = {}

    async def connect(self, room_id: int, ws: WebSocket):
        self.rooms.setdefault(room_id, []).append(ws)

    def disconnect(self, room_id: int, ws: WebSocket):
        if room_id in self.rooms and ws in self.rooms[room_id]:
            self.rooms[room_id].remove(ws)

        # optional cleanup
        if room_id in self.rooms and len(self.rooms[room_id]) == 0:
            del self.rooms[room_id]

    async def broadcast(self, room_id: int, message: dict):
        # send to a copy, so we can remove dead sockets safely
        sockets = list(self.rooms.get(room_id, []))
        for sock in sockets:
            try:
                await sock.send_json(message)
            except Exception:
                # if send fails, remove socket
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
        await manager.connect(room_id, ws)

        # ✅ Joined message
        await manager.broadcast(
            room_id,
            {"type": "system", "text": f"🟢 {user.username} joined room {room_id}"},
        )

        # ✅ Loop
        while True:
            data = await ws.receive_json()
            text = (data.get("text") or "").strip()
            if not text:
                continue

            # ✅ Save message
            msg = Message(room_id=room_id, sender_id=user.id, content=text)
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
                    "created_at": msg.created_at.isoformat() if msg.created_at else None,
                },
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, ws)
        # optional:
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
