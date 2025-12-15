"""Problem Generation Request/Response Schemas"""
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class ToeicPart(str, Enum):
    PART5 = "5"
    PART6 = "6"
    PART7 = "7"


class Choice(BaseModel):
    """문제 선택지"""
    label: str  # A, B, C, D
    text: str
    is_correct: bool = False


class Problem(BaseModel):
    """TOEIC 문제"""
    part: int
    question_type: str  # grammar, vocabulary, reading comprehension
    passage: Optional[str] = None  # Part 6, 7용 지문
    question: str
    choices: List[Choice]
    answer: str  # A, B, C, D
    explanation: str
    difficulty: str  # easy, medium, hard


class ProblemGenerateRequest(BaseModel):
    """문제 생성 요청"""
    text: str
    part: Optional[int] = None  # None이면 자동 판별
    count: int = 1  # 생성할 문제 수
    difficulty: Optional[str] = None  # easy, medium, hard
    use_rag: bool = True


class ProblemGenerateResponse(BaseModel):
    """문제 생성 응답"""
    success: bool
    problems: List[Problem]
    source_text: str
    detected_part: Optional[int] = None
