from pydantic import BaseModel
from datetime import datetime

class MessageOut(BaseModel):
    id: int
    room_id: int
    sender_id: int
    content: str
    status: str
    reply_to_id: int | None = None
    reply_to_text: str | None = None
    reply_to_sender: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
