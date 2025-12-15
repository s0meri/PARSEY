from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Project Info
    project_name: str = "Parsey API"
    debug: bool = True
    
    # Google Cloud Vision
    google_cloud_project_id: Optional[str] = None
    google_application_credentials: Optional[str] = None
    
    # OpenAI
    openai_api_key: Optional[str] = None
    
    # Google Gemini
    google_api_key: Optional[str] = None
    
    # LLM Configuration
    llm_provider: str = "openai"  # openai or gemini
    llm_model: str = "gpt-4o-mini"
    
    # RAG Configuration
    use_rag: bool = True
    chroma_persist_directory: str = "./data/chroma_db"
    
    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
