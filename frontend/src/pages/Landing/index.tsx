import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScanText, BrainCircuit, FileQuestion, Sparkles, ArrowRight } from 'lucide-react';
import * as E from './style';

const Landing = () => {
    const navigate = useNavigate();
    return (
        <E.PageContainer>
            {/* Background Elements */}
            <E.Background>
                <E.Orb top="-10%" left="-10%" width="40%" height="40%" color="#9333ea" />
                <E.Orb bottom="-10%" right="-10%" width="40%" height="40%" color="#2563eb" delay="2s" />
            </E.Background>

            {/* Navigation */}
            <E.Nav>
                <E.Logo>
                    <Sparkles color="#22d3ee" />
                    Parsey
                </E.Logo>
                <E.NavLinks>
                    <E.NavLink href="#features">Features</E.NavLink>
                    <E.NavLink href="#how-it-works">How it Works</E.NavLink>
                    <E.NavLink href="#pricing">Pricing</E.NavLink>
                </E.NavLinks>
                <E.Button onClick={() => navigate('/generator')}>Get Started</E.Button>
            </E.Nav>

            {/* Hero Section */}
            <E.HeroSection>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ flex: 1 }}
                >
                    <E.Title>
                        Transform Images into <br />
                        <span>Intelligent Problems</span>
                    </E.Title>
                    <E.Subtitle>
                        Upload any English text or problem sheet. We analyze the grammar, structure, and context to generate TOEIC-style questions and personalized study materials instantly.
                    </E.Subtitle>
                    <E.ButtonGroup>
                        <E.Button onClick={() => navigate('/generator')}>
                            Try Demo <ArrowRight size={20} />
                        </E.Button>
                        <E.Button variant="outline">
                            Learn More
                        </E.Button>
                    </E.ButtonGroup>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{ flex: 1, position: 'relative' }}
                >
                    <E.GlassCard>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }}></div>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }}></div>
                            <span style={{ fontSize: '0.875rem', color: '#9ca3af', marginLeft: '0.5rem' }}>analysis_result.json</span>
                        </div>
                        <E.CodeBlock>
                            <E.CodeLine>
                                <span style={{ color: '#c084fc' }}>Input:</span>
                                <span style={{ color: '#d1d5db' }}>"The meeting was postponed..."</span>
                            </E.CodeLine>
                            <E.CodeLine>
                                <span style={{ color: '#60a5fa' }}>Analysis:</span>
                                <span style={{ color: '#4ade80' }}>Passive Voice, Past Tense</span>
                            </E.CodeLine>
                            <E.CodeLine>
                                <span style={{ color: '#facc15' }}>Generated:</span>
                                <span style={{ color: '#d1d5db' }}>TOEIC Part 5 Question...</span>
                            </E.CodeLine>
                        </E.CodeBlock>
                    </E.GlassCard>

                    {/* Decorative Elements behind card */}
                    <E.Orb top="-20px" right="-20px" width="80px" height="80px" color="#06b6d4" style={{ filter: 'blur(40px)', opacity: 0.4 }} />
                    <E.Orb bottom="-20px" left="-20px" width="80px" height="80px" color="#a855f7" style={{ filter: 'blur(40px)', opacity: 0.4 }} />
                </motion.div>
            </E.HeroSection>

            {/* Features Section */}
            <E.FeaturesSection id="features">
                <E.SectionHeader>
                    <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: 700 }}>Powered by Advanced AI</h2>
                    <p style={{ color: '#9ca3af' }}>From OCR to RAG-enhanced generation</p>
                </E.SectionHeader>

                <E.Grid>
                    <FeatureCard
                        icon={<ScanText size={32} color="#22d3ee" />}
                        title="Smart OCR"
                        description="Instantly extract text from images, PDFs, or handwritten notes with high precision."
                        delay={0}
                    />
                    <FeatureCard
                        icon={<BrainCircuit size={32} color="#c084fc" />}
                        title="Deep Analysis"
                        description="Identify parts of speech, sentence structures, and grammar rules using LLMs."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<FileQuestion size={32} color="#f472b6" />}
                        title="Problem Generation"
                        description="Create TOEIC-style questions (Part 5/6/7) that match the difficulty and style of the input."
                        delay={0.4}
                    />
                </E.Grid>
            </E.FeaturesSection>
        </E.PageContainer>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
    >
        <E.GlassCard hover>
            <E.IconWrapper>{icon}</E.IconWrapper>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{description}</p>
        </E.GlassCard>
    </motion.div>
);

export default Landing;

