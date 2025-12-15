"""Schemas Package"""
from .ocr import OCRResponse, OCRTextRequest
from .analysis import AnalysisRequest, AnalysisResponse, POSTag, GrammarElement
from .problem import (
    Problem, 
    Choice, 
    ProblemGenerateRequest, 
    ProblemGenerateResponse,
    ToeicPart
)

__all__ = [
    "OCRResponse",
    "OCRTextRequest",
    "AnalysisRequest",
    "AnalysisResponse",
    "POSTag",
    "GrammarElement",
    "Problem",
    "Choice",
    "ProblemGenerateRequest",
    "ProblemGenerateResponse",
    "ToeicPart",
]
