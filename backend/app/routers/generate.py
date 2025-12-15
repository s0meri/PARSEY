"""Generate Router - TOEIC Problem Generation Endpoints"""
from fastapi import APIRouter, HTTPException
from ..schemas import ProblemGenerateRequest, ProblemGenerateResponse
from ..services import problem_generator

router = APIRouter(prefix="/api/generate", tags=["Generation"])


@router.post("/problem", response_model=ProblemGenerateResponse)
async def generate_problem(request: ProblemGenerateRequest):
    """
    TOEIC 문제 생성
    
    - **text**: 소스 텍스트 (문제 생성 기반)
    - **part**: TOEIC 파트 (5, 6, 7). None이면 자동 판별
    - **count**: 생성할 문제 수 (기본 1, 최대 5)
    - **difficulty**: 난이도 (easy, medium, hard)
    - **use_rag**: RAG 패턴 사용 여부
    
    Returns:
        생성된 TOEIC 문제들
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(request.text) > 5000:
        raise HTTPException(status_code=400, detail="Text exceeds maximum length of 5000 characters")
    
    if request.count > 5:
        raise HTTPException(status_code=400, detail="Cannot generate more than 5 problems at once")
    
    if request.part and request.part not in [5, 6, 7]:
        raise HTTPException(status_code=400, detail="Part must be 5, 6, or 7")
    
    if request.difficulty and request.difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Difficulty must be easy, medium, or hard")
    
    result = await problem_generator.generate(request)
    
    return ProblemGenerateResponse(
        success=result.get("success", False),
        problems=result.get("problems", []),
        source_text=result.get("source_text", request.text),
        detected_part=result.get("detected_part")
    )
