from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Seed usernames that get special starting points and amulya flag
SEED_USERS = {
    "amulya":   {"points": 2500, "is_amulya": True,  "is_admin": False},
    "alekhya":  {"points": 500,  "is_amulya": False, "is_admin": False},
    "vineeth":  {"points": 500,  "is_amulya": False, "is_admin": False},
    "chutki":   {"points": 600,  "is_amulya": False, "is_admin": False},
    "harsha":   {"points": 0,    "is_amulya": False, "is_admin": True},
}


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username.ilike(body.username)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken",
        )

    seed = SEED_USERS.get(body.username.lower(), {})
    user = User(
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
        points=seed.get("points", 0),
        is_amulya=seed.get("is_amulya", False),
        is_admin=seed.get("is_admin", False),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username.ilike(body.username)).first()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token)
