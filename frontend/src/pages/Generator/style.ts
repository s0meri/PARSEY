import styled from '@emotion/styled';

// Generator Page Container
export const GeneratorContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  position: relative;
`;

// Header Section
export const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #22d3ee, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
`;

// Main Grid Layout
export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// Glass Panel
export const GlassPanel = styled.div<{ hover?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  ${({ hover }) => hover && `
    &:hover {
      transform: translateY(-4px);
      border-color: rgba(168, 85, 247, 0.4);
      box-shadow: 0 8px 32px rgba(168, 85, 247, 0.15);
    }
  `}
`;

// Input Section
export const InputSection = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// File Upload Area
export const UploadArea = styled.div<{ isDragging?: boolean }>`
  border: 2px dashed ${({ isDragging }) => isDragging ? '#22d3ee' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ isDragging }) => isDragging ? 'rgba(34, 211, 238, 0.1)' : 'transparent'};
  
  &:hover {
    border-color: #22d3ee;
    background: rgba(34, 211, 238, 0.05);
  }
`;

export const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #22d3ee;
`;

export const UploadText = styled.p`
  color: #9ca3af;
  margin: 0;
`;

// Text Input Area
export const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  
  &::placeholder {
    color: #6b7280;
  }
  
  &:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
  }
`;

// Button
export const Button = styled.button<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  ${({ variant }) => variant === 'secondary' ? `
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    
    &:hover:not(:disabled) {
      border-color: #a855f7;
      background: rgba(168, 85, 247, 0.1);
    }
  ` : `
    background: linear-gradient(90deg, #a855f7, #22d3ee);
    border: none;
    color: #fff;
    
    &:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
    }
  `}
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

// Options Section
export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

export const OptionCard = styled.button<{ selected?: boolean }>`
  padding: 1rem;
  border-radius: 8px;
  background: ${({ selected }) => selected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${({ selected }) => selected ? '#a855f7' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    border-color: #a855f7;
  }
`;

export const OptionLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const OptionDescription = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

// Results Section
export const ResultsSection = styled(GlassPanel)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

// Analysis Result
export const AnalysisCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
`;

export const AnalysisTitle = styled.h3`
  font-size: 1rem;
  color: #22d3ee;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const Tag = styled.span<{ color?: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: ${({ color }) => color || 'rgba(168, 85, 247, 0.2)'};
  color: #fff;
`;

// Problem Card
export const ProblemCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ProblemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const PartBadge = styled.span<{ part: number }>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ part }) =>
        part === 5 ? 'rgba(34, 211, 238, 0.2)' :
            part === 6 ? 'rgba(168, 85, 247, 0.2)' :
                'rgba(244, 114, 182, 0.2)'
    };
  color: ${({ part }) =>
        part === 5 ? '#22d3ee' :
            part === 6 ? '#a855f7' :
                '#f472b6'
    };
`;

export const DifficultyBadge = styled.span<{ difficulty: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background: ${({ difficulty }) =>
        difficulty === 'easy' ? 'rgba(34, 197, 94, 0.2)' :
            difficulty === 'medium' ? 'rgba(250, 204, 21, 0.2)' :
                'rgba(239, 68, 68, 0.2)'
    };
  color: ${({ difficulty }) =>
        difficulty === 'easy' ? '#22c55e' :
            difficulty === 'medium' ? '#facc15' :
                '#ef4444'
    };
`;

export const Passage = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #d1d5db;
  white-space: pre-wrap;
`;

export const Question = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #fff;
`;

export const ChoicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ChoiceItem = styled.button<{ selected?: boolean; correct?: boolean; showAnswer?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  background: ${({ selected, correct, showAnswer }) =>
        showAnswer && correct ? 'rgba(34, 197, 94, 0.2)' :
            selected ? 'rgba(168, 85, 247, 0.2)' :
                'rgba(255, 255, 255, 0.05)'
    };
  
  border: 1px solid ${({ selected, correct, showAnswer }) =>
        showAnswer && correct ? '#22c55e' :
            selected ? '#a855f7' :
                'rgba(255, 255, 255, 0.1)'
    };
  
  color: #fff;
  
  &:hover:not(:disabled) {
    border-color: #a855f7;
  }
`;

export const ChoiceLabel = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const Explanation = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #d1d5db;
  line-height: 1.6;
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  color: #9ca3af;
`;

// Empty State
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #6b7280;
`;

export const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;
