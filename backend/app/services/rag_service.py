"""RAG Service - ChromaDB Vector Store for ETS Patterns"""
from typing import Optional, List, Dict
import json
import os
from ..config import get_settings

settings = get_settings()


class RAGService:
    """
    RAG 서비스 - ETS TOEIC 패턴 검색
    토익 스타일 문제 생성을 위한 패턴 참조
    """
    
    def __init__(self):
        self._collection = None
        self._initialized = False
    
    async def initialize(self):
        """ChromaDB 초기화 및 데이터 로드"""
        if self._initialized:
            return
        
        if not settings.use_rag:
            self._initialized = True
            return
        
        try:
            import chromadb
            from chromadb.config import Settings as ChromaSettings
            
            # ChromaDB 클라이언트 생성
            persist_dir = settings.chroma_persist_directory
            os.makedirs(persist_dir, exist_ok=True)
            
            client = chromadb.Client(ChromaSettings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=persist_dir,
                anonymized_telemetry=False
            ))
            
            # 컬렉션 가져오기 또는 생성
            self._collection = client.get_or_create_collection(
                name="ets_patterns",
                metadata={"description": "ETS TOEIC problem patterns"}
            )
            
            # 초기 데이터가 없으면 로드
            if self._collection.count() == 0:
                await self._load_initial_patterns()
            
            self._initialized = True
            
        except ImportError:
            print("ChromaDB not installed. RAG disabled.")
            self._initialized = True
        except Exception as e:
            print(f"RAG initialization error: {e}")
            self._initialized = True
    
    async def _load_initial_patterns(self):
        """초기 ETS 패턴 데이터 로드"""
        patterns = self._get_default_patterns()
        
        if self._collection:
            for i, pattern in enumerate(patterns):
                self._collection.add(
                    documents=[pattern["content"]],
                    metadatas=[{
                        "type": pattern["type"],
                        "part": str(pattern["part"]),
                        "category": pattern["category"]
                    }],
                    ids=[f"pattern_{i}"]
                )
    
    def _get_default_patterns(self) -> List[Dict]:
        """기본 ETS 패턴 데이터"""
        return [
            # Part 5 Distractor Patterns
            {
                "type": "distractor",
                "part": 5,
                "category": "grammar",
                "content": "Part 5 distractors often include: wrong verb forms (tense/voice mismatch), incorrect word forms (noun vs adjective), similar-sounding words, preposition errors."
            },
            {
                "type": "distractor", 
                "part": 5,
                "category": "vocabulary",
                "content": "Vocabulary distractors use: synonyms with subtle meaning differences, words with similar spelling, context-inappropriate choices, collocations errors."
            },
            # Part 6 Patterns
            {
                "type": "structure",
                "part": 6,
                "category": "text_completion",
                "content": "Part 6 passages are 100-150 words. Test coherence, transitions, vocabulary in context. 4 questions per passage. Include sentence insertion questions."
            },
            {
                "type": "sentence_insertion",
                "part": 6,
                "category": "cohesion",
                "content": "Sentence insertion tests understanding of: logical sequence, pronoun reference, transition words, topic continuity."
            },
            # Part 7 Patterns
            {
                "type": "passage",
                "part": 7,
                "category": "email",
                "content": "Email format: To/From/Subject header, greeting, body paragraphs, closing. Common topics: scheduling, requests, announcements, inquiries."
            },
            {
                "type": "passage",
                "part": 7,
                "category": "memo",
                "content": "Memo format: To/From/Subject/Date header. Internal communications about policies, events, changes. Formal but concise tone."
            },
            {
                "type": "passage",
                "part": 7,
                "category": "advertisement",
                "content": "Advertisement features: product/service benefits, promotional offers, contact information, call to action. Persuasive language."
            },
            {
                "type": "question",
                "part": 7,
                "category": "inference",
                "content": "Inference questions: 'What is implied...', 'What can be inferred...'. Require reading between the lines, understanding tone and purpose."
            },
            {
                "type": "question",
                "part": 7,
                "category": "detail",
                "content": "Detail questions: 'According to...', 'What is stated...'. Direct reference to passage information. Paraphrased in question."
            },
            # Difficulty Patterns
            {
                "type": "difficulty",
                "part": 5,
                "category": "easy",
                "content": "Easy Part 5: Common vocabulary, clear grammar rules, obvious context clues. Single grammar point tested."
            },
            {
                "type": "difficulty",
                "part": 5,
                "category": "hard",
                "content": "Hard Part 5: Advanced vocabulary, subtle grammar distinctions, multiple grammar points, idiomatic expressions."
            }
        ]
    
    async def search_patterns(
        self, 
        query: str, 
        part: Optional[int] = None,
        pattern_type: Optional[str] = None,
        n_results: int = 3
    ) -> List[Dict]:
        """
        ETS 패턴 검색
        
        Args:
            query: 검색 쿼리
            part: TOEIC 파트 (5, 6, 7)
            pattern_type: 패턴 타입 (distractor, structure, passage, question)
            n_results: 반환할 결과 수
            
        Returns:
            관련 패턴 목록
        """
        if not settings.use_rag or not self._collection:
            # RAG 비활성화시 기본 패턴 반환
            return self._get_fallback_patterns(part)
        
        try:
            # 필터 구성
            where_filter = {}
            if part:
                where_filter["part"] = str(part)
            if pattern_type:
                where_filter["type"] = pattern_type
            
            results = self._collection.query(
                query_texts=[query],
                n_results=n_results,
                where=where_filter if where_filter else None
            )
            
            patterns = []
            if results and results["documents"]:
                for i, doc in enumerate(results["documents"][0]):
                    patterns.append({
                        "content": doc,
                        "metadata": results["metadatas"][0][i] if results["metadatas"] else {}
                    })
            
            return patterns
            
        except Exception as e:
            print(f"RAG search error: {e}")
            return self._get_fallback_patterns(part)
    
    def _get_fallback_patterns(self, part: Optional[int] = None) -> List[Dict]:
        """RAG 없을 때 기본 패턴"""
        all_patterns = self._get_default_patterns()
        if part:
            return [p for p in all_patterns if p["part"] == part][:3]
        return all_patterns[:3]


# 싱글톤 인스턴스
rag_service = RAGService()
