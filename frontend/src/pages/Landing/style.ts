import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;



// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  color: var(--text-primary);
`;

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -10;
`;

interface OrbProps {
  delay?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
  color?: string;
}

export const Orb = styled.div<OrbProps>`
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(128px);
  opacity: 0.5;
  animation: ${float} 6s ease-in-out infinite;
  
  ${props => props.delay && `animation-delay: ${props.delay};`}
  ${props => props.top && `top: ${props.top};`}
  ${props => props.left && `left: ${props.left};`}
  ${props => props.right && `right: ${props.right};`}
  ${props => props.bottom && `bottom: ${props.bottom};`}
  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}
  background-color: ${props => props.color || 'var(--accent-primary)'};
`;

// Navigation
export const Nav = styled.nav`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 15rem; // Requested 15rem margin
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    margin: 1rem 5rem;
  }
  
  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #fff, var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
  
  &:hover {
    color: var(--text-primary);
  }
`;

interface ButtonProps {
  variant?: 'outline';
}

export const Button = styled.button<ButtonProps>`
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border: none;
  border-radius: 30px;
  padding: 12px 32px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.6);
  }

  ${props => props.variant === 'outline' && `
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: none;
    backdrop-filter: blur(4px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      box-shadow: none;
    }
  `}
`;

// Hero Section
export const HeroSection = styled.section`
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin: 0 15rem; // Requested 15rem margin

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }

  @media (max-width: 1200px) {
    margin: 0 5rem;
  }

  @media (max-width: 768px) {
    margin: 0 1.5rem;
    text-align: center;
  }
`;

export const HeroContent = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  
  span {
    background: linear-gradient(to right, #c084fc, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
  
  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
  }
`;

export const HeroVisual = styled.div`
  flex: 1;
  position: relative;
`;

interface GlassCardProps {
  hover?: boolean;
}

export const GlassCard = styled.div<GlassCardProps>`
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  z-index: 10;
  animation: ${float} 6s ease-in-out infinite;
  
  ${props => props.hover && `
    transition: background-color 0.3s;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `}
`;

export const CodeBlock = styled.div`
  font-family: monospace;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CodeLine = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Features Section
export const FeaturesSection = styled.section`
  padding: 5rem 0;
  margin: 0 15rem; // Requested 15rem margin

  @media (max-width: 1200px) {
    margin: 0 5rem;
  }

  @media (max-width: 768px) {
    margin: 0 1.5rem;
  }
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const IconWrapper = styled.div`
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  width: fit-content;
  margin-bottom: 1rem;
`;
