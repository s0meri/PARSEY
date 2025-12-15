"""OCR Router - Image Upload and Text Extraction"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from ..schemas import OCRResponse
from ..services import extract_text_from_image

router = APIRouter(prefix="/api/ocr", tags=["OCR"])


@router.post("/upload", response_model=OCRResponse)
async def upload_image(file: UploadFile = File(...)):
    """
    이미지 업로드 및 텍스트 추출
    
    - **file**: 이미지 파일 (PNG, JPG, JPEG, GIF, BMP, WEBP)
    
    Returns:
        추출된 텍스트와 메타데이터
    """
    # 파일 타입 검증
    allowed_types = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/bmp", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
        )
    
    # 파일 크기 제한 (10MB)
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    # OCR 수행
    result = await extract_text_from_image(contents)
    
    return OCRResponse(
        success=result.get("success", False),
        text=result.get("text", ""),
        confidence=result.get("confidence"),
        language=result.get("language")
    )
