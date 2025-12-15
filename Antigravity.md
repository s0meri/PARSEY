🟦 프로젝트 개요 (Parsey)

이 프로젝트는 사용자로부터 입력된 영어 문장이나 문제지 이미지를 OCR로 텍스트로 변환한 후,
이를 기반으로 TOEIC(토익) 문제 유형에 맞춰 분석하고 문제를 자동 생성하는 서비스입니다.

🟦 전체 파이프라인

OCR 단계

입력된 이미지에서 텍스트 추출

Google Vision API 사용 가능

문장 분석 단계 (LLM)

품사 분류(Pos tagging)

절/구 분석

문법 요소(시제, 수동태, 관계사 등) 식별

의미 요약

TOEIC 파트 판별 (Part 5/6/7)

RAG 단계(선택적)

ETS TOEIC 문제 출제 패턴

Distractor 패턴(오답 선택지 유형)

지문 구조(광고, 공지문, 이메일 등)

난이도별 문항 규칙

Part 6 문장 삽입 규칙

Part 7 문제 패러프레이징 규칙
→ 모아서 벡터DB(ChromaDB)에 저장

문제 생성 (LLM + 선택적 RAG)

Part 5 문법 문제 생성

Part 6 문맥 연결 문제 생성

Part 7 독해 문제 생성

RAG 결과를 참고해 ETS 스타일로 조정

유사 예문/학습 문제 생성

선택적으로 RAG 기반 패턴으로 스타일 유지

🟦 RAG 사용 목적

RAG는 "정답을 위해" 사용되는 것이 아니라
토익 공식 스타일을 재현하는 규칙을 반영하기 위해 사용됩니다.

문제 오답 선택지 패턴

지문 문체

파트별 문제 구조

난이도 규칙

지문 템플릿

LLM이 문제를 생성할 때
RAG에서 가져온 ETS 규칙을 반영하여 더 토익스러운 문제를 생성하도록 합니다.

🟦 RAG가 필요 없는 단계

문법 분석

품사 분석

기본 문제 생성
→ LLM 자체 능력으로 충분

🟦 시스템 아키텍처 (2025-12-08 업데이트)

Frontend
- React (Vite) + TypeScript
- Emotion (CSS-in-JS)
- Framer Motion (Animations)
- Lucide React (Icons)
- "Dreamy" Design System (Deep Purple/Blue gradients, Glassmorphism)

Backend
- FastAPI (Python)
- REST API 구조
- OCR: Google Vision API 연동
- LLM: OpenAI/Gemini API 연동
- RAG: ChromaDB (Vector DB)

Directory Structure
- /backend: FastAPI 서버
  - /app/routers: API 엔드포인트 (ocr, analysis, generate)
  - /app/services: 비즈니스 로직 (ocr_service, llm_service, rag_service, problem_generator)
  - /app/schemas: Pydantic 모델
  - /app/config.py: 환경 변수 관리
- /frontend: React 클라이언트
  - /src/pages/Landing: 랜딩 페이지
  - /src/pages/Generator: 문제 생성 페이지

🟦 실행 방법

Backend:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # API 키 설정
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

🟦 API 엔드포인트

- POST /api/ocr/upload: 이미지 업로드 → 텍스트 추출
- POST /api/analysis/analyze: 텍스트 분석 (품사, 문법, 파트 판별)
- POST /api/generate/problem: TOEIC 문제 생성