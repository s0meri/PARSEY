"""Problem Generator Service - TOEIC Problem Generation with LLM + RAG"""
from typing import Optional, List
import json
from ..config import get_settings
from ..schemas import Problem, Choice, ProblemGenerateRequest
from .llm_service import llm_service
from .rag_service import rag_service

settings = get_settings()


class ProblemGenerator:
    """TOEIC 문제 생성기"""
    
    async def generate(self, request: ProblemGenerateRequest) -> dict:
        """
        TOEIC 문제 생성
        
        Args:
            request: 문제 생성 요청
            
        Returns:
            생성된 문제들과 메타데이터
        """
        # 1. 텍스트 분석 (파트 자동 판별)
        analysis = await llm_service.analyze_text(request.text)
        detected_part = request.part or analysis.get("toeic_part", 5)
        
        # 2. RAG 패턴 검색 (선택적)
        rag_patterns = []
        if request.use_rag and settings.use_rag:
            await rag_service.initialize()
            rag_patterns = await rag_service.search_patterns(
                query=request.text,
                part=detected_part
            )
        
        # 3. 문제 생성
        problems = []
        for i in range(request.count):
            problem = await self._generate_single_problem(
                text=request.text,
                part=detected_part,
                analysis=analysis,
                rag_patterns=rag_patterns,
                difficulty=request.difficulty,
                index=i
            )
            problems.append(problem)
        
        return {
            "success": True,
            "problems": problems,
            "source_text": request.text,
            "detected_part": detected_part
        }
    
    async def _generate_single_problem(
        self,
        text: str,
        part: int,
        analysis: dict,
        rag_patterns: List[dict],
        difficulty: Optional[str],
        index: int
    ) -> Problem:
        """단일 문제 생성"""
        
        # API 키 없으면 시뮬레이션
        if not settings.openai_api_key:
            return await self._simulate_problem(text, part, difficulty)
        
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            
            prompt = self._build_generation_prompt(
                text=text,
                part=part,
                analysis=analysis,
                rag_patterns=rag_patterns,
                difficulty=difficulty
            )
            
            response = await client.chat.completions.create(
                model=settings.llm_model,
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert TOEIC test writer. Create authentic TOEIC questions following ETS guidelines."
                    },
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )
            
            result = json.loads(response.choices[0].message.content)
            return self._parse_problem(result, part)
            
        except Exception as e:
            print(f"Problem generation error: {e}")
            return await self._simulate_problem(text, part, difficulty)
    
    def _build_generation_prompt(
        self,
        text: str,
        part: int,
        analysis: dict,
        rag_patterns: List[dict],
        difficulty: Optional[str]
    ) -> str:
        """문제 생성 프롬프트 구성"""
        
        # RAG 패턴 포함
        pattern_context = ""
        if rag_patterns:
            pattern_context = "\n\nETS Style Guidelines:\n"
            for p in rag_patterns:
                pattern_context += f"- {p.get('content', '')}\n"
        
        # 분석 결과 포함
        analysis_context = ""
        if analysis:
            grammar = analysis.get("grammar_elements", [])
            if grammar:
                grammar_str = ", ".join([g.value if hasattr(g, 'value') else str(g) for g in grammar[:3]])
                analysis_context = f"\nGrammar elements identified: {grammar_str}"
        
        difficulty_str = difficulty or "medium"
        
        if part == 5:
            return self._part5_prompt(text, analysis_context, pattern_context, difficulty_str)
        elif part == 6:
            return self._part6_prompt(text, analysis_context, pattern_context, difficulty_str)
        else:
            return self._part7_prompt(text, analysis_context, pattern_context, difficulty_str)
    
    def _part5_prompt(self, text: str, analysis: str, patterns: str, difficulty: str) -> str:
        return f"""Create a TOEIC Part 5 (Incomplete Sentences) question based on this text.
{patterns}
Source text: "{text}"
{analysis}
Difficulty: {difficulty}

Create a fill-in-the-blank question that tests grammar or vocabulary.

Respond in JSON:
{{
    "question": "sentence with _______ for the blank",
    "choices": [
        {{"label": "A", "text": "option1", "is_correct": false}},
        {{"label": "B", "text": "option2", "is_correct": true}},
        {{"label": "C", "text": "option3", "is_correct": false}},
        {{"label": "D", "text": "option4", "is_correct": false}}
    ],
    "answer": "B",
    "question_type": "grammar" or "vocabulary",
    "explanation": "detailed explanation of why B is correct and others are wrong"
}}"""
    
    def _part6_prompt(self, text: str, analysis: str, patterns: str, difficulty: str) -> str:
        return f"""Create a TOEIC Part 6 (Text Completion) question based on this text.
{patterns}
Source text: "{text}"
{analysis}
Difficulty: {difficulty}

Create a passage with a blank that tests context understanding.

Respond in JSON:
{{
    "passage": "paragraph with _______ indicating the blank",
    "question": "Question number and context",
    "choices": [
        {{"label": "A", "text": "option1", "is_correct": false}},
        {{"label": "B", "text": "option2", "is_correct": true}},
        {{"label": "C", "text": "option3", "is_correct": false}},
        {{"label": "D", "text": "option4", "is_correct": false}}
    ],
    "answer": "B",
    "question_type": "context",
    "explanation": "explanation of the correct answer"
}}"""
    
    def _part7_prompt(self, text: str, analysis: str, patterns: str, difficulty: str) -> str:
        return f"""Create a TOEIC Part 7 (Reading Comprehension) question based on this text.
{patterns}
Source text: "{text}"
{analysis}
Difficulty: {difficulty}

Create a reading comprehension question about the passage.

Respond in JSON:
{{
    "passage": "the reading passage (can expand on source text)",
    "question": "What is indicated about...",
    "choices": [
        {{"label": "A", "text": "option1", "is_correct": false}},
        {{"label": "B", "text": "option2", "is_correct": true}},
        {{"label": "C", "text": "option3", "is_correct": false}},
        {{"label": "D", "text": "option4", "is_correct": false}}
    ],
    "answer": "B",
    "question_type": "reading comprehension",
    "explanation": "explanation referencing the passage"
}}"""
    
    def _parse_problem(self, result: dict, part: int) -> Problem:
        """LLM 결과를 Problem 객체로 변환"""
        choices = [
            Choice(**c) for c in result.get("choices", [])
        ]
        
        return Problem(
            part=part,
            question_type=result.get("question_type", "grammar"),
            passage=result.get("passage"),
            question=result.get("question", ""),
            choices=choices,
            answer=result.get("answer", "A"),
            explanation=result.get("explanation", ""),
            difficulty=result.get("difficulty", "medium")
        )
    
    async def _simulate_problem(
        self, 
        text: str, 
        part: int, 
        difficulty: Optional[str]
    ) -> Problem:
        """API 없을 때 시뮬레이션 문제 생성"""
        
        difficulty = difficulty or "medium"
        
        # 텍스트에서 키워드 추출
        words = text.split()
        key_word = words[2] if len(words) > 2 else "meeting"
        
        if part == 5:
            return Problem(
                part=5,
                question_type="grammar",
                passage=None,
                question=f"The project deadline _______ extended due to unforeseen circumstances.",
                choices=[
                    Choice(label="A", text="was", is_correct=True),
                    Choice(label="B", text="were", is_correct=False),
                    Choice(label="C", text="is", is_correct=False),
                    Choice(label="D", text="be", is_correct=False),
                ],
                answer="A",
                explanation="'Deadline' is singular, so the correct verb form is 'was' (past tense, singular). 'Were' is for plural subjects, 'is' is present tense, and 'be' requires an auxiliary.",
                difficulty=difficulty
            )
        elif part == 6:
            return Problem(
                part=6,
                question_type="context",
                passage=f"Dear Team,\n\nWe would like to inform you that the quarterly {key_word} has been rescheduled. _______ We apologize for any inconvenience this may cause.\n\nBest regards,\nManagement",
                question="Which sentence best fits in the blank?",
                choices=[
                    Choice(label="A", text="The new date will be announced shortly.", is_correct=True),
                    Choice(label="B", text="Please submit your reports.", is_correct=False),
                    Choice(label="C", text="The office will be closed.", is_correct=False),
                    Choice(label="D", text="Thank you for your cooperation.", is_correct=False),
                ],
                answer="A",
                explanation="Option A logically follows the announcement of rescheduling by promising information about the new date. It maintains coherence with the topic of schedule changes.",
                difficulty=difficulty
            )
        else:  # Part 7
            return Problem(
                part=7,
                question_type="reading comprehension",
                passage=f"MEMO\n\nTo: All Staff\nFrom: HR Department\nSubject: Policy Update\n\nEffective next month, all employees will be required to complete the new compliance training. The training can be accessed through our online portal and must be completed within two weeks of the start date. {text}",
                question="What is indicated about the training?",
                choices=[
                    Choice(label="A", text="It must be completed online.", is_correct=True),
                    Choice(label="B", text="It is optional for senior staff.", is_correct=False),
                    Choice(label="C", text="It starts immediately.", is_correct=False),
                    Choice(label="D", text="It takes two months to complete.", is_correct=False),
                ],
                answer="A",
                explanation="The memo states that 'The training can be accessed through our online portal,' indicating it must be completed online. The other options contradict the information given.",
                difficulty=difficulty
            )


# 싱글톤 인스턴스
problem_generator = ProblemGenerator()
