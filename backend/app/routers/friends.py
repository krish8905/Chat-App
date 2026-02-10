from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_

from app.db.session import get_db
from app.models.user import User
from app.models.friend import FriendRequest, Friendship
from app.schemas.friend import FriendRequestCreate, FriendRequestOut, FriendOut
from app.core.security import get_current_user

router = APIRouter(prefix="/friends", tags=["Friends"])


def are_friends(db: Session, user_id: int, other_id: int) -> bool:
    return (
        db.query(Friendship)
        .filter(Friendship.user_id == user_id, Friendship.friend_id == other_id)
        .first()
        is not None
    )


@router.post("/request", response_model=FriendRequestOut, status_code=status.HTTP_201_CREATED)
def send_friend_request(
    payload: FriendRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    to_user = db.query(User).filter(User.email == payload.email).first()
    if not to_user:
        raise HTTPException(status_code=404, detail="User not found with this email")

    if to_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot add yourself")

    if are_friends(db, current_user.id, to_user.id):
        raise HTTPException(status_code=400, detail="Already friends")

    # check if any pending request already exists (both directions)
    existing_req = (
        db.query(FriendRequest)
        .filter(
            or_(
                and_(FriendRequest.from_user_id == current_user.id, FriendRequest.to_user_id == to_user.id),
                and_(FriendRequest.from_user_id == to_user.id, FriendRequest.to_user_id == current_user.id),
            )
        )
        .order_by(FriendRequest.id.desc())
        .first()
    )

    if existing_req and existing_req.status == "pending":
        raise HTTPException(status_code=400, detail="Friend request already pending")

    fr = FriendRequest(from_user_id=current_user.id, to_user_id=to_user.id, status="pending")
    db.add(fr)
    db.commit()
    db.refresh(fr)
    return fr


@router.get("/requests/incoming", response_model=list[FriendRequestOut])
def incoming_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(FriendRequest)
        .filter(FriendRequest.to_user_id == current_user.id, FriendRequest.status == "pending")
        .order_by(FriendRequest.id.desc())
        .all()
    )


@router.get("/requests/outgoing", response_model=list[FriendRequestOut])
def outgoing_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(FriendRequest)
        .filter(FriendRequest.from_user_id == current_user.id, FriendRequest.status == "pending")
        .order_by(FriendRequest.id.desc())
        .all()
    )


@router.post("/requests/{request_id}/accept")
def accept_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = db.query(FriendRequest).filter(FriendRequest.id == request_id).first()
    if not req or req.to_user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != "pending":
        raise HTTPException(status_code=400, detail=f"Request already {req.status}")

    # create friendship both ways
    a = Friendship(user_id=req.from_user_id, friend_id=req.to_user_id)
    b = Friendship(user_id=req.to_user_id, friend_id=req.from_user_id)

    req.status = "accepted"
    db.add_all([a, b])
    db.commit()

    return {"message": "Friend request accepted"}


@router.post("/requests/{request_id}/reject")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    req = db.query(FriendRequest).filter(FriendRequest.id == request_id).first()
    if not req or req.to_user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.status != "pending":
        raise HTTPException(status_code=400, detail=f"Request already {req.status}")

    req.status = "rejected"
    db.commit()

    return {"message": "Friend request rejected"}


@router.get("", response_model=list[FriendOut])
def list_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # friendships table contains rows for current_user -> friend
    friends = (
        db.query(User)
        .join(Friendship, Friendship.friend_id == User.id)
        .filter(Friendship.user_id == current_user.id)
        .order_by(User.username.asc())
        .all()
    )
    return friends
