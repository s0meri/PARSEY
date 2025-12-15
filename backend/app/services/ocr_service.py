"""OCR Service - Google Vision API Integration"""
from typing import Optional
import base64
import httpx
from ..config import get_settings

settings = get_settings()


async def extract_text_from_image(image_bytes: bytes) -> dict:
    """
    Google Vision API를 사용하여 이미지에서 텍스트 추출
    
    Args:
        image_bytes: 이미지 바이트 데이터
        
    Returns:
        dict: 추출된 텍스트와 메타데이터
    """
    # Google Vision API 키가 없으면 시뮬레이션 모드
    if not settings.google_api_key and not settings.google_application_credentials:
        return await _simulate_ocr(image_bytes)
    
    try:
        # Base64 인코딩
        image_content = base64.b64encode(image_bytes).decode("utf-8")
        
        # Google Vision API 호출
        url = f"https://vision.googleapis.com/v1/images:annotate?key={settings.google_api_key}"
        
        payload = {
            "requests": [
                {
                    "image": {"content": image_content},
                    "features": [{"type": "TEXT_DETECTION"}]
                }
            ]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=30.0)
            response.raise_for_status()
            
        result = response.json()
        
        if "responses" in result and result["responses"]:
            annotations = result["responses"][0].get("textAnnotations", [])
            if annotations:
                full_text = annotations[0].get("description", "")
                locale = annotations[0].get("locale", "en")
                return {
                    "success": True,
                    "text": full_text.strip(),
                    "confidence": 0.95,
                    "language": locale
                }
        
        return {
            "success": False,
            "text": "",
            "confidence": 0,
            "language": None
        }
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return {
            "success": False,
            "text": f"Error: {str(e)}",
            "confidence": 0,
            "language": None
        }


async def _simulate_ocr(image_bytes: bytes) -> dict:
    """
    API 키 없을 때 시뮬레이션 모드
    개발/테스트 용도
    """
    # 이미지 크기로 대략적인 컨텐츠 추정 (데모용)
    size_kb = len(image_bytes) / 1024
    
    return {
        "success": True,
        "text": "The quarterly sales report indicates a significant increase in revenue. "
                "All employees are required to attend the mandatory training session. "
                "The meeting has been postponed until further notice.",
        "confidence": 0.85,
        "language": "en",
        "_note": "Simulated OCR (No API key configured)"
    }
