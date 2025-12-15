"""OCR Request/Response Schemas"""
from pydantic import BaseModel
from typing import Optional


class OCRResponse(BaseModel):
    """OCR 결과 응답"""
    success: bool
    text: str
    confidence: Optional[float] = None
    language: Optional[str] = None


class OCRTextRequest(BaseModel):
    """텍스트 직접 입력 요청"""
    text: str
