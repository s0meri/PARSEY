"""LLM Service - OpenAI/Gemini Integration for Text Analysis"""
from typing import Optional, List
import json
from ..config import get_settings
from ..schemas import POSTag, GrammarElement

settings = get_settings()


class LLMService:
    """LLM 서비스 - 문장 분석 및 TOEIC 파트 판별"""
    
    def __init__(self):
        self.provider = settings.llm_provider
        self.model = settings.llm_model
        self._client = None
    
    async def _get_client(self):
        """LLM 클라이언트 초기화"""
        if self._client is None:
            if self.provider == "openai":
                try:
                    from openai import AsyncOpenAI
                    self._client = AsyncOpenAI(api_key=settings.openai_api_key)
                except ImportError:
                    self._client = None
            elif self.provider == "gemini":
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=settings.google_api_key)
                    self._client = genai.GenerativeModel(self.model)
                except ImportError:
                    self._client = None
        return self._client
    
    async def analyze_text(self, text: str) -> dict:
        """
        텍스트 분석 수행
        - 품사 분류
        - 문법 요소 식별
        - 문장 구조 분석
        - TOEIC 파트 판별
        """
        client = await self._get_client()
        
        if client is None or not settings.openai_api_key:
            return await self._simulate_analysis(text)
        
        try:
            prompt = self._build_analysis_prompt(text)
            
            if self.provider == "openai":
                response = await client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are an expert English linguist and TOEIC instructor. Analyze the given text precisely."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2
                )
                result = json.loads(response.choices[0].message.content)
            else:
                # Gemini
                response = await client.generate_content_async(prompt)
                result = json.loads(response.text)
            
            return self._parse_analysis_result(text, result)
            
        except Exception as e:
            print(f"LLM Analysis Error: {e}")
            return await self._simulate_analysis(text)
    
    def _build_analysis_prompt(self, text: str) -> str:
        """분석 프롬프트 생성"""
        return f"""Analyze the following English text and provide a detailed linguistic analysis.

Text: "{text}"

Respond in JSON format with the following structure:
{{
    "pos_tags": [
        {{"word": "word", "pos": "NOUN/VERB/ADJ/etc", "description": "brief description"}}
    ],
    "grammar_elements": [
        {{"type": "tense/voice/clause/etc", "value": "identified element", "explanation": "brief explanation"}}
    ],
    "sentence_structure": "description of sentence structure (simple/compound/complex)",
    "toeic_part": 5 or 6 or 7,
    "toeic_part_reason": "explanation why this fits the TOEIC part",
    "summary": "brief semantic summary of the text"
}}

TOEIC Part Guidelines:
- Part 5: Single sentences testing grammar/vocabulary (blank-filling)
- Part 6: Short passages with multiple blanks (text completion)
- Part 7: Reading comprehension passages (emails, memos, articles, etc.)"""
    
    def _parse_analysis_result(self, original_text: str, result: dict) -> dict:
        """분석 결과 파싱"""
        pos_tags = [
            POSTag(**tag) for tag in result.get("pos_tags", [])
        ]
        grammar_elements = [
            GrammarElement(**elem) for elem in result.get("grammar_elements", [])
        ]
        
        return {
            "original_text": original_text,
            "pos_tags": pos_tags,
            "grammar_elements": grammar_elements,
            "sentence_structure": result.get("sentence_structure"),
            "toeic_part": result.get("toeic_part"),
            "toeic_part_reason": result.get("toeic_part_reason"),
            "summary": result.get("summary")
        }
    
    async def _simulate_analysis(self, text: str) -> dict:
        """시뮬레이션 분석 (API 없을 때)"""
        # 기본적인 분석 시뮬레이션
        words = text.split()
        
        # 간단한 규칙 기반 분석
        pos_tags = []
        for word in words[:10]:  # 처음 10단어만
            clean_word = word.strip(".,!?")
            if clean_word.lower() in ["the", "a", "an"]:
                pos_tags.append(POSTag(word=clean_word, pos="DET", description="Determiner"))
            elif clean_word.lower() in ["is", "are", "was", "were", "has", "have", "had", "been"]:
                pos_tags.append(POSTag(word=clean_word, pos="VERB", description="Auxiliary/Main Verb"))
            elif clean_word.endswith("ly"):
                pos_tags.append(POSTag(word=clean_word, pos="ADV", description="Adverb"))
            elif clean_word.endswith(("ed", "ing")):
                pos_tags.append(POSTag(word=clean_word, pos="VERB", description="Verb form"))
            else:
                pos_tags.append(POSTag(word=clean_word, pos="NOUN/ADJ", description="Noun or Adjective"))
        
        # 문법 요소 감지
        grammar_elements = []
        text_lower = text.lower()
        
        if "was" in text_lower or "were" in text_lower or "been" in text_lower:
            if "by" in text_lower or text_lower.count("ed ") > 0:
                grammar_elements.append(GrammarElement(
                    type="voice", 
                    value="Passive Voice", 
                    explanation="Sentence uses passive construction"
                ))
        
        if any(word in text_lower for word in ["will", "shall", "going to"]):
            grammar_elements.append(GrammarElement(
                type="tense", value="Future", explanation="Future tense indicator found"
            ))
        elif any(word in text_lower for word in ["was", "were", "had", "did"]):
            grammar_elements.append(GrammarElement(
                type="tense", value="Past", explanation="Past tense indicator found"
            ))
        else:
            grammar_elements.append(GrammarElement(
                type="tense", value="Present", explanation="Present tense (default)"
            ))
        
        # TOEIC 파트 판별
        sentence_count = text.count(".") + text.count("!") + text.count("?")
        word_count = len(words)
        
        if sentence_count <= 1 and word_count < 30:
            toeic_part = 5
            part_reason = "Short single sentence suitable for grammar/vocabulary testing"
        elif sentence_count <= 4 and word_count < 100:
            toeic_part = 6
            part_reason = "Short paragraph suitable for text completion"
        else:
            toeic_part = 7
            part_reason = "Longer passage suitable for reading comprehension"
        
        return {
            "original_text": text,
            "pos_tags": pos_tags,
            "grammar_elements": grammar_elements,
            "sentence_structure": "Simple" if sentence_count <= 1 else "Complex",
            "toeic_part": toeic_part,
            "toeic_part_reason": part_reason,
            "summary": f"Text containing {word_count} words in {max(1, sentence_count)} sentence(s).",
            "_note": "Simulated analysis (No API key configured)"
        }


# 싱글톤 인스턴스
llm_service = LLMService()
