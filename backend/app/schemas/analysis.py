"""Analysis Request/Response Schemas"""
from pydantic import BaseModel
from typing import Optional, List


class POSTag(BaseModel):
    """품사 태그"""
    word: str
    pos: str
    description: str


class GrammarElement(BaseModel):
    """문법 요소"""
    type: str  # tense, voice, clause, etc.
    value: str
    explanation: str


class AnalysisRequest(BaseModel):
    """분석 요청"""
    text: str
    include_pos: bool = True
    include_grammar: bool = True
    include_structure: bool = True


class AnalysisResponse(BaseModel):
    """분석 결과 응답"""
    original_text: str
    pos_tags: Optional[List[POSTag]] = None
    grammar_elements: Optional[List[GrammarElement]] = None
    sentence_structure: Optional[str] = None
    toeic_part: Optional[int] = None  # 5, 6, 7
    toeic_part_reason: Optional[str] = None
    summary: Optional[str] = None
