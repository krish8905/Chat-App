from fastapi import FastAPI
from app.db.session import Base, engine
from app.models.user import User  
from app.routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.ws_chat import router as ws_router
from app.models.user import User
from app.models.chat import ChatRoom, ChatMember, Message
from app.routers.chat import router as chat_router
from app.routers.friends import router as friends_router
from app.models import friend
from fastapi.staticfiles import StaticFiles

app = FastAPI()

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "API is running"}
app.include_router(ws_router)
app.include_router(chat_router)
app.include_router(friends_router)