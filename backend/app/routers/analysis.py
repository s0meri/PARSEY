"""Analysis Router - Text Analysis Endpoints"""
from fastapi import APIRouter, HTTPException
from ..schemas import AnalysisRequest, AnalysisResponse
from ..services import llm_service

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    """
    텍스트 분석 수행
    
    - **text**: 분석할 영어 텍스트
    - **include_pos**: 품사 태깅 포함 여부
    - **include_grammar**: 문법 요소 분석 포함 여부
    - **include_structure**: 문장 구조 분석 포함 여부
    
    Returns:
        분석 결과 (품사, 문법, 구조, TOEIC 파트)
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 5000:
        raise HTTPException(status_code=400, detail="Text exceeds maximum length of 5000 characters")
    
    result = await llm_service.analyze_text(request.text)
    
    return AnalysisResponse(
        original_text=result.get("original_text", request.text),
        pos_tags=result.get("pos_tags") if request.include_pos else None,
        grammar_elements=result.get("grammar_elements") if request.include_grammar else None,
        sentence_structure=result.get("sentence_structure") if request.include_structure else None,
        toeic_part=result.get("toeic_part"),
        toeic_part_reason=result.get("toeic_part_reason"),
        summary=result.get("summary")
    )
