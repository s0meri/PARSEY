"""Routers Package"""
from .ocr import router as ocr_router
from .analysis import router as analysis_router
from .generate import router as generate_router

__all__ = ["ocr_router", "analysis_router", "generate_router"]
