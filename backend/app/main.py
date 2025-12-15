from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import get_settings
from .routers import ocr_router, analysis_router, generate_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup and shutdown"""
    # Startup
    print(f"🚀 Starting {settings.project_name}")
    print(f"📝 LLM Provider: {settings.llm_provider}")
    print(f"🔧 RAG Enabled: {settings.use_rag}")
    yield
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="Parsey API",
    description="TOEIC 문제 생성 서비스 - OCR, 문장 분석, RAG 기반 문제 생성",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ocr_router)
app.include_router(analysis_router)
app.include_router(generate_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Parsey API",
        "docs": "/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_provider": settings.llm_provider,
        "rag_enabled": settings.use_rag
    }

