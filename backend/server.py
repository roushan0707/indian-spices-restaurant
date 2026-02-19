from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Indian Spices Restaurant API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import routes
from routes import router as main_router
from payment_routes import router as payment_router

# Add routes to the API router
api_router.include_router(main_router)
api_router.include_router(payment_router)

@api_router.get("/")
async def root():
    return {"message": "Indian Spices Restaurant API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database with default data"""
    logger.info("Starting up Indian Spices Restaurant API")
    
    # Create default admin user if not exists
    from auth import get_password_hash
    admin_exists = await db.users.find_one({"username": "admin"})
    if not admin_exists:
        await db.users.insert_one({
            "username": "admin",
            "email": "admin@indianspices.com",
            "hashed_password": get_password_hash("admin123"),
            "is_admin": True
        })
        logger.info("Default admin user created: username=admin, password=admin123")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")