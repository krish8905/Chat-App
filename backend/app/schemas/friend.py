from pydantic import BaseModel, EmailStr
from datetime import datetime


class FriendRequestCreate(BaseModel):
    email: EmailStr


class FriendRequestOut(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class FriendOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
