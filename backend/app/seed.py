"""Run once to seed rewards data into the database."""
from app.database import SessionLocal, engine
from app import models

models.Base.metadata.create_all(bind=engine)

REWARDS = [
    dict(
        id=1, title="CHOCOLATE", label="Chocolate", cost=50, emoji="🍫",
        image="chocolate.png",
        gradient="linear-gradient(155deg,#241208 0%,#3e2010 55%,#291508 100%)",
        description="A sweet indulgence for the soul.",
        amulya_only=False, sort_order=1,
    ),
    dict(
        id=2, title="CHICK-FIL-A", label="Chick-fil-A", cost=100, emoji="🐔",
        image="chickfila.png",
        gradient="linear-gradient(155deg,#1a0808 0%,#330e0e 55%,#1e0a0a 100%)",
        description="Everyone's favorite chicken, on demand.",
        amulya_only=False, sort_order=2,
    ),
    dict(
        id=3, title="MOVIE", label="Movie", cost=250, emoji="🎬",
        image="movie.png",
        gradient="linear-gradient(155deg,#080d1a 0%,#101b33 55%,#0a1020 100%)",
        description="Escape into the big screen.",
        amulya_only=False, sort_order=3,
    ),
    dict(
        id=4, title="DINNER", label="Dinner", cost=500, emoji="🍽️",
        image="dinner.png",
        gradient="linear-gradient(155deg,#0a1508 0%,#142c10 55%,#0c1a0a 100%)",
        description="An elevated dining experience.",
        amulya_only=False, sort_order=4,
    ),
    dict(
        id=5, title="DATE NIGHT", label="Date Night", cost=1000, emoji="💑",
        image="date.png",
        gradient="linear-gradient(155deg,#160a12 0%,#2c1028 55%,#1a0c18 100%)",
        description="The ultimate reward — a night to remember.",
        amulya_only=True, sort_order=5,
    ),
    dict(
        id=6, title="SURPRISE", label="Surprise", cost=3000, emoji="🎁",
        image="surprise.png",
        gradient="linear-gradient(155deg,#0a0a0a 0%,#1a1400 55%,#0d0d0d 100%)",
        description="Something extraordinary awaits.",
        amulya_only=False, sort_order=6,
    ),
]


def seed():
    db = SessionLocal()
    try:
        for data in REWARDS:
            existing = db.query(models.Reward).filter(models.Reward.id == data["id"]).first()
            if not existing:
                db.add(models.Reward(**data))
        db.commit()
        print("Rewards seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
