from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


# Auth
class RegisterRequest(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Username must be at least 2 characters")
        if len(v) > 50:
            raise ValueError("Username must be at most 50 characters")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v: str) -> str:
        if len(v) < 4:
            raise ValueError("Password must be at least 4 characters")
        return v


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Users
class UserOut(BaseModel):
    id: int
    username: str
    points: int
    is_amulya: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Rewards
class RewardOut(BaseModel):
    id: int
    title: str
    label: str
    cost: int
    emoji: Optional[str]
    image: Optional[str]
    gradient: Optional[str]
    description: Optional[str]
    amulya_only: bool
    sort_order: int

    class Config:
        from_attributes = True


# Redemptions
class RedeemRequest(BaseModel):
    quantity: int = 1

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v: int) -> int:
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v


class RedemptionOut(BaseModel):
    id: int
    reward_id: int
    quantity: int
    total_cost: int
    redeemed_at: datetime

    class Config:
        from_attributes = True


class RedemptionHistoryItem(BaseModel):
    id: int
    reward_label: str
    reward_emoji: Optional[str]
    quantity: int
    total_cost: int
    redeemed_at: datetime

    class Config:
        from_attributes = True


class RedeemResponse(BaseModel):
    redemption: RedemptionOut
    new_points: int
