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
→ 모아서 벡터DB(Chroma / Pinecone / Vertex AI Vector DB)에 저장

문제 생성 (LLM + 선택적 RAG)

Part 5 문법 문제 생성

Part 6 문맥 연결 문제 생성

Part 7 독해 문제 생성

RAG 결과를 참고해 ETS 스타일로 조정

유사 예문/학습 문제 생성

선택적으로 RAG 기반 패턴으로 스타일 유지

🟦 RAG 사용 목적

RAG는 “정답을 위해” 사용되는 것이 아니라
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

🟦 시스템 아키텍처 (2025-12-01 추가)

Frontend
- React (Vite)
- TailwindCSS (via index.css variables & classes)
- Framer Motion (Animations)
- Lucide React (Icons)
- "Dreamy" Design System (Deep Purple/Blue gradients, Glassmorphism)

Backend
- FastAPI (Python)
- REST API 구조
- OCR 및 LLM 연동 예정

Directory Structure
- /backend: FastAPI 서버
- /frontend: React 클라이언트