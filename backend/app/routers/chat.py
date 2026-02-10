from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.db.session import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat import ChatRoom, DmRoom

router = APIRouter(prefix="/chat", tags=["Chat"])

def pair(a: int, b: int):
    return (a, b) if a < b else (b, a)

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

    a, b = pair(me.id, friend_id)

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
