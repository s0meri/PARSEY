import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    Sparkles,
    Brain,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';
import * as S from './style';

// Types
interface POSTag {
    word: string;
    pos: string;
    description: string;
}

interface GrammarElement {
    type: string;
    value: string;
    explanation: string;
}

interface Analysis {
    original_text: string;
    pos_tags?: POSTag[];
    grammar_elements?: GrammarElement[];
    sentence_structure?: string;
    toeic_part?: number;
    toeic_part_reason?: string;
    summary?: string;
}

interface Choice {
    label: string;
    text: string;
    is_correct: boolean;
}

interface Problem {
    part: number;
    question_type: string;
    passage?: string;
    question: string;
    choices: Choice[];
    answer: string;
    explanation: string;
    difficulty: string;
}

const API_BASE = 'http://localhost:8000';

const Generator: React.FC = () => {
    // State
    const [inputText, setInputText] = useState('');
    const [selectedPart, setSelectedPart] = useState<number | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [problems, setProblems] = useState<Problem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
    const [isDragging, setIsDragging] = useState(false);

    // File Upload Handler
    const handleFileUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE}/api/ocr/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setInputText(data.text);
            } else {
                setError('Failed to extract text from image');
            }
        } catch (err) {
            setError('Failed to connect to server. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Drag and Drop Handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    // Analyze Text
    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const response = await fetch(`${API_BASE}/api/analysis/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText }),
            });

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError('Failed to analyze text');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate Problems
    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text first');
            return;
        }

        setIsLoading(true);
        setError(null);
        setProblems([]);
        setSelectedAnswers({});
        setShowAnswers({});

        try {
            const response = await fetch(`${API_BASE}/api/generate/problem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: inputText,
                    part: selectedPart,
                    difficulty: selectedDifficulty,
                    count: 1,
                    use_rag: true,
                }),
            });

            const data = await response.json();

            if (data.success && data.problems) {
                setProblems(data.problems);
                // Also set analysis if we got toeic_part
                if (data.detected_part) {
                    setAnalysis(prev => prev ? { ...prev, toeic_part: data.detected_part } : null);
                }
            } else {
                setError('Failed to generate problems');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Answer Selection
    const handleSelectAnswer = (problemIndex: number, label: string) => {
        setSelectedAnswers(prev => ({ ...prev, [problemIndex]: label }));
    };

    // Show Answer
    const handleShowAnswer = (problemIndex: number) => {
        setShowAnswers(prev => ({ ...prev, [problemIndex]: true }));
    };

    // Reset
    const handleReset = () => {
        setInputText('');
        setAnalysis(null);
        setProblems([]);
        setError(null);
        setSelectedAnswers({});
        setShowAnswers({});
    };

    return (
        <S.GeneratorContainer>
            {/* Header */}
            <S.Header>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <S.Title>
                        <Sparkles size={32} /> TOEIC Problem Generator
                    </S.Title>
                    <S.Subtitle>
                        Upload an image or enter text to generate TOEIC-style questions
                    </S.Subtitle>
                </motion.div>
            </S.Header>

            {/* Main Content */}
            <S.MainGrid>
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <S.InputSection>
                        <S.SectionTitle>
                            <FileText size={20} /> Input
                        </S.SectionTitle>

                        {/* File Upload */}
                        <S.UploadArea
                            isDragging={isDragging}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-input')?.click()}
                        >
                            <S.UploadIcon>
                                <Upload size={48} />
                            </S.UploadIcon>
                            <S.UploadText>
                                Drag & drop an image or click to upload
                            </S.UploadText>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                        </S.UploadArea>

                        {/* Text Input */}
                        <S.TextArea
                            placeholder="Or enter text directly..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />

                        {/* Options */}
                        <S.SectionTitle>TOEIC Part</S.SectionTitle>
                        <S.OptionsGrid>
                            {[
                                { part: null, label: 'Auto', desc: 'Auto detect' },
                                { part: 5, label: 'Part 5', desc: 'Grammar' },
                                { part: 6, label: 'Part 6', desc: 'Text completion' },
                                { part: 7, label: 'Part 7', desc: 'Reading' },
                            ].map((opt) => (
                                <S.OptionCard
                                    key={opt.label}
                                    selected={selectedPart === opt.part}
                                    onClick={() => setSelectedPart(opt.part)}
                                >
                                    <S.OptionLabel>{opt.label}</S.OptionLabel>
                                    <S.OptionDescription>{opt.desc}</S.OptionDescription>
                                </S.OptionCard>
                            ))}
                        </S.OptionsGrid>

                        <S.SectionTitle>Difficulty</S.SectionTitle>
                        <S.OptionsGrid>
                            {['easy', 'medium', 'hard'].map((diff) => (
                                <S.OptionCard
                                    key={diff}
                                    selected={selectedDifficulty === diff}
                                    onClick={() => setSelectedDifficulty(
                                        selectedDifficulty === diff ? null : diff
                                    )}
                                >
                                    <S.OptionLabel>
                                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </S.OptionLabel>
                                </S.OptionCard>
                            ))}
                        </S.OptionsGrid>

                        {/* Action Buttons */}
                        <S.ButtonGroup>
                            <S.Button onClick={handleAnalyze} disabled={isLoading || !inputText.trim()}>
                                <Brain size={18} /> Analyze
                            </S.Button>
                            <S.Button onClick={handleGenerate} disabled={isLoading || !inputText.trim()}>
                                <Sparkles size={18} /> Generate Problem
                            </S.Button>
                            <S.Button variant="secondary" onClick={handleReset}>
                                <RefreshCw size={18} /> Reset
                            </S.Button>
                        </S.ButtonGroup>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{
                                        padding: '1rem',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#ef4444'
                                    }}
                                >
                                    <AlertCircle size={18} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </S.InputSection>
                </motion.div>

                {/* Results Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <S.ResultsSection>
                        <S.SectionTitle>
                            <CheckCircle2 size={20} /> Results
                        </S.SectionTitle>

                        {/* Loading State */}
                        {isLoading && (
                            <S.LoadingContainer>
                                <S.Spinner />
                                <S.LoadingText>Processing...</S.LoadingText>
                            </S.LoadingContainer>
                        )}

                        {/* Empty State */}
                        {!isLoading && !analysis && problems.length === 0 && (
                            <S.EmptyState>
                                <S.EmptyIcon>📝</S.EmptyIcon>
                                <p>Enter text and click Analyze or Generate to see results</p>
                            </S.EmptyState>
                        )}

                        {/* Analysis Result */}
                        <AnimatePresence>
                            {analysis && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <S.AnalysisCard>
                                        <S.AnalysisTitle>
                                            <Brain size={16} /> Analysis Result
                                        </S.AnalysisTitle>

                                        {analysis.toeic_part && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <S.PartBadge part={analysis.toeic_part}>
                                                    Detected: Part {analysis.toeic_part}
                                                </S.PartBadge>
                                            </div>
                                        )}

                                        {analysis.summary && (
                                            <p style={{ color: '#9ca3af', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                                                {analysis.summary}
                                            </p>
                                        )}

                                        {analysis.grammar_elements && analysis.grammar_elements.length > 0 && (
                                            <>
                                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                                    Grammar Elements:
                                                </div>
                                                <S.TagsContainer>
                                                    {analysis.grammar_elements.map((elem, i) => (
                                                        <S.Tag key={i} color="rgba(168, 85, 247, 0.3)">
                                                            {elem.value}
                                                        </S.Tag>
                                                    ))}
                                                </S.TagsContainer>
                                            </>
                                        )}
                                    </S.AnalysisCard>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Generated Problems */}
                        <AnimatePresence>
                            {problems.map((problem, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <S.ProblemCard>
                                        <S.ProblemHeader>
                                            <S.PartBadge part={problem.part}>
                                                Part {problem.part}
                                            </S.PartBadge>
                                            <S.DifficultyBadge difficulty={problem.difficulty}>
                                                {problem.difficulty}
                                            </S.DifficultyBadge>
                                        </S.ProblemHeader>

                                        {problem.passage && (
                                            <S.Passage>{problem.passage}</S.Passage>
                                        )}

                                        <S.Question>{problem.question}</S.Question>

                                        <S.ChoicesList>
                                            {problem.choices.map((choice) => (
                                                <S.ChoiceItem
                                                    key={choice.label}
                                                    selected={selectedAnswers[index] === choice.label}
                                                    correct={choice.is_correct}
                                                    showAnswer={showAnswers[index]}
                                                    onClick={() => handleSelectAnswer(index, choice.label)}
                                                    disabled={showAnswers[index]}
                                                >
                                                    <S.ChoiceLabel>{choice.label}</S.ChoiceLabel>
                                                    {choice.text}
                                                </S.ChoiceItem>
                                            ))}
                                        </S.ChoicesList>

                                        {!showAnswers[index] && selectedAnswers[index] && (
                                            <S.Button
                                                variant="secondary"
                                                onClick={() => handleShowAnswer(index)}
                                                style={{ marginTop: '1rem', width: '100%' }}
                                            >
                                                Check Answer
                                            </S.Button>
                                        )}

                                        {showAnswers[index] && (
                                            <S.Explanation>
                                                <strong>Answer: {problem.answer}</strong>
                                                <br /><br />
                                                {problem.explanation}
                                            </S.Explanation>
                                        )}
                                    </S.ProblemCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </S.ResultsSection>
                </motion.div>
            </S.MainGrid>

            {/* Back to Home Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem'
                }}
            >
                <S.Button variant="secondary" onClick={() => window.location.href = '/'}>
                    <ArrowLeft size={18} /> Back to Home
                </S.Button>
            </motion.div>
        </S.GeneratorContainer>
    );
};

export default Generator;
