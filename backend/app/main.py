
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.database import engine, Base
from app import models
from app.routers import auth, events, attendance


# DATABASE LIFESPAN
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


# FASTAPI APPLICATION
app = FastAPI(
    title="CampusConnect API",
    description="College Event Management System Backend",
    version="1.0.0",
    lifespan=lifespan
)


# CORS CONFIGURATION
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5176",
    "https://campusconnect-frontend-8xv8.onrender.com",
]

# Read frontend URL from Render environment
frontend_url = os.getenv("FRONTEND_URL")

if frontend_url:
    frontend_url = frontend_url.rstrip("/")

    if frontend_url not in allowed_origins:
        allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API ROUTERS
app.include_router(auth.router)
app.include_router(events.router)
app.include_router(attendance.router)


# HOME ROUTE
@app.get("/")
def home():
    return {
        "message": "CampusConnect Backend is running"
    }


# DATABASE HEALTH CHECK
@app.get("/db-check")
def database_check():
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT current_database(), current_user")
            )

            database, user = result.fetchone()

        return {
            "status": "connected",
            "database": database,
            "user": user
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed"
        )
