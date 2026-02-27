from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user
from app.models import User, Reward, Redemption
from app.schemas import RewardOut, RedeemRequest, RedeemResponse, RedemptionOut, RedemptionHistoryItem
from app.email_utils import send_redemption_email, send_harsha_redemption_notification

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/history", response_model=list[RedemptionHistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(Redemption, Reward)
        .join(Reward, Redemption.reward_id == Reward.id)
        .filter(Redemption.user_id == current_user.id)
        .order_by(Redemption.redeemed_at.desc())
        .all()
    )
    return [
        RedemptionHistoryItem(
            id=r.id,
            reward_label=rw.label,
            reward_emoji=rw.emoji,
            quantity=r.quantity,
            total_cost=r.total_cost,
            redeemed_at=r.redeemed_at,
        )
        for r, rw in rows
    ]


@router.get("", response_model=list[RewardOut])
def list_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Reward).order_by(Reward.sort_order)
    if not current_user.is_amulya:
        query = query.filter(Reward.amulya_only == False)
    return query.all()


@router.post("/{reward_id}/redeem", response_model=RedeemResponse)
def redeem_reward(
    reward_id: int,
    body: RedeemRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if reward is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reward not found")

    if reward.amulya_only and not current_user.is_amulya:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This reward is not available to you")

    total_cost = reward.cost * body.quantity
    if current_user.points < total_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient points: need {total_cost}, have {current_user.points}",
        )

    current_user.points -= total_cost
    redemption = Redemption(
        user_id=current_user.id,
        reward_id=reward.id,
        quantity=body.quantity,
        total_cost=total_cost,
    )
    db.add(redemption)
    db.commit()
    db.refresh(redemption)
    db.refresh(current_user)

    if current_user.email:
        background_tasks.add_task(send_redemption_email, current_user.email, current_user.username)

    harsha = db.query(User).filter(User.username == "harsha").first()
    if harsha and harsha.email:
        background_tasks.add_task(
            send_harsha_redemption_notification,
            harsha.email,
            current_user.username,
            reward.title,
            body.quantity,
            total_cost,
            current_user.points,
        )

    return RedeemResponse(
        redemption=RedemptionOut(
            id=redemption.id,
            reward_id=redemption.reward_id,
            quantity=redemption.quantity,
            total_cost=redemption.total_cost,
            redeemed_at=redemption.redeemed_at,
        ),
        new_points=current_user.points,
    )
