from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.db.session import get_db
from app.core.security import get_current_user
import uuid
import os
import shutil
from app.models.user import User
from app.models.chat import ChatRoom, DmRoom, Message

router = APIRouter(prefix="/chat", tags=["Chat"])

def pair(a: int, b: int):
    return (a, b) if a < b else (b, a)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    me: User = Depends(get_current_user),
):
    try:
        # Generate a unique filename
        ext = os.path.splitext(file.filename)[1] if file.filename else ""
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join("uploads", filename)
        
        # Save the file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "url": f"http://127.0.0.1:8000/uploads/{filename}",
            "filename": file.filename,
            "type": file.content_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/dm/{friend_id}")
def get_or_create_dm_room(
    friend_id: int,
    db: Session = Depends(get_db),
    me: User = Depends(get_current_user),
):
    if friend_id == me.id:
        raise HTTPException(status_code=400, detail="Cannot DM yourself")

    friend = db.query(User).filter(User.id == friend_id).first()
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")

    # ✅ OPTIONAL (recommended): check they are actually friends here
    # if not is_friend(db, me.id, friend_id):
    #     raise HTTPException(status_code=403, detail="Not friends")

    a, b = pair(me.id, friend_id)  # type: ignore

    dm = db.query(DmRoom).filter(and_(DmRoom.user_a_id == a, DmRoom.user_b_id == b)).first()
    if dm:
        return {"room_id": dm.room_id}

    room = ChatRoom(name=None, is_group=0)
    db.add(room)
    db.commit()
    db.refresh(room)

    dm = DmRoom(user_a_id=a, user_b_id=b, room_id=room.id)
    db.add(dm)
    db.commit()
    return {"room_id": room.id}

@router.get("/history/{room_id}")
def get_chat_history(
    room_id: int,
    limit: int = 50,
    cursor: Optional[int] = None,
    db: Session = Depends(get_db),
    me: User = Depends(get_current_user),
):
    # Optional: check access rights here
    query = db.query(Message).filter(Message.room_id == room_id)
    if cursor is not None:
        query = query.filter(Message.id < cursor)
        
    messages = query.order_by(Message.created_at.desc()).limit(limit).all()
    
    messages.reverse()
    
    res = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        
        reply_to_text = None
        reply_to_sender = None
        if m.reply_to_id:
            reply_msg = db.query(Message).filter(Message.id == m.reply_to_id).first()
            if reply_msg:
                reply_to_text = reply_msg.content
                reply_sender_user = db.query(User).filter(User.id == reply_msg.sender_id).first()
                if reply_sender_user:
                    reply_to_sender = reply_sender_user.username

        res.append({
            "type": "message",
            "id": m.id,
            "room_id": m.room_id,
            "sender_id": m.sender_id,
            "sender": sender.username if sender else "Unknown",
            "text": m.content,
            "status": m.status,
            "reply_to_id": m.reply_to_id,
            "reply_to_text": reply_to_text,
            "reply_to_sender": reply_to_sender,
            "created_at": m.created_at.isoformat() if m.created_at is not None else None  # type: ignore
        })
    return res
