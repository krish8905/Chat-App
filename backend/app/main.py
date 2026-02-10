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
from app.routers.chat import router as chat_router


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
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
app.include_router(chat_router)