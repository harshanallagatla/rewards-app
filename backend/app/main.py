from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app import models
from app.routes import auth, users, rewards
from app.seed import seed

models.Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="Rewards API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(rewards.router)


@app.get("/health")
def health():
    return {"status": "ok"}
