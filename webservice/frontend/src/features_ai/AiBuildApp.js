import React, { useState } from 'react';
import './ai-build.css';
import AiIntro from './AiIntro';
import ChatUI from './ChatUI';
import SidebarStack1 from './SidebarStack1';
import SidebarStack2 from './SidebarStack2';
import SidebarStack3 from './SidebarStack3';
import SidebarStack4 from './SidebarStack4';
import AiChatbot from './AiChatbot';

function AiBuildApp() {
    const [phase, setPhase] = useState('intro'); // 'intro', 'chat', 'sidebar'
    const [userAnswers, setUserAnswers] = useState({});
    const [estimateMode, setEstimateMode] = useState(null); // 'auto' or 'guided'
    const [activeStack, setActiveStack] = useState(1);

    // Stack 2와 Stack 3 간 공유 상태
    const [selectedParts, setSelectedParts] = useState({}); // {cpu: {model: 'i5-13400F', product: '...', confirmed: true}}
    const [currentCategory, setCurrentCategory] = useState(null); // 현재 선택 중인 카테고리
    const [currentModel, setCurrentModel] = useState(null); // 현재 선택 중인 모델

    // AI 자동 완성 데이터 생성 (발표용 현실적인 가격)
    const generateAutoCompleteParts = () => {
        return {
            cpu: {
                model: 'AMD Ryzen 7 7800X3D',
                product: { id: 1, name: 'AMD Ryzen 7 7800X3D', price: 520000, brand: 'AMD', specs: '8코어 16스레드' },
                confirmed: true,
            },
            gpu: {
                model: 'RTX 4060',
                product: { id: 1, name: 'ZOTAC RTX 4060 Twin Edge', price: 420000, brand: 'ZOTAC', specs: '8GB GDDR6' },
                confirmed: true,
            },
            ram: {
                model: '32GB DDR5-5600',
                product: {
                    id: 1,
                    name: 'Samsung DDR5 32GB (16GB x 2)',
                    price: 140000,
                    brand: 'Samsung',
                    specs: '32GB DDR5-5600',
                },
                confirmed: true,
            },
            ssd: {
                model: '1TB NVMe',
                product: {
                    id: 1,
                    name: 'Samsung 980 PRO 1TB',
                    price: 130000,
                    brand: 'Samsung',
                    specs: '1TB NVMe Gen4',
                },
                confirmed: true,
            },
            case: {
                model: 'Mid Tower',
                product: { id: 1, name: 'NZXT H510 Flow', price: 110000, brand: 'NZXT', specs: 'Mid Tower' },
                confirmed: true,
            },
            psu: {
                model: '750W 80+ Gold',
                product: { id: 1, name: 'Corsair RM750e', price: 130000, brand: 'Corsair', specs: '750W 80+ Gold' },
                confirmed: true,
            },
        };
    };

    const partCategories = [
        { id: 'cpu', name: 'CPU', models: ['Intel Core i5-13400F', 'AMD Ryzen 7 7800X3D', 'Intel Core i7-13700K'] },
        { id: 'gpu', name: 'GPU', models: ['RTX 3060', 'RTX 4060', 'RTX 4070', 'RTX 4080'] },
        { id: 'ram', name: 'RAM', models: ['16GB DDR4-3200', '32GB DDR4-3600', '32GB DDR5-5600'] },
        { id: 'ssd', name: 'SSD', models: ['500GB NVMe', '1TB NVMe', '2TB NVMe'] },
        { id: 'case', name: 'CASE', models: ['Full Tower', 'Mid Tower', 'Mini Tower'] },
        { id: 'psu', name: 'PSU', models: ['650W 80+ Gold', '750W 80+ Gold', '850W 80+ Platinum'] },
    ];

    const handlePhaseChange = (newPhase, data = {}) => {
        setPhase(newPhase);
        if (data.answers) {
            setUserAnswers((prev) => ({ ...prev, ...data.answers }));
        }
        if (data.mode) {
            setEstimateMode(data.mode);
        }
        if (data.stack) {
            setActiveStack(data.stack);
        }
    };

    // Stack 2에서 모델 선택 시 호출 (확정된 부품도 재선택 가능)
    const handleModelSelect = (categoryId, model) => {
        setCurrentCategory(categoryId);
        setCurrentModel(model);
        setActiveStack(3); // Stack 3로 이동
    };

    // 확정된 부품 수정 시작
    const handlePartEdit = (categoryId) => {
        // confirmed 상태를 해제하여 드롭다운으로 다른 모델 선택 가능하게
        const newSelectedParts = { ...selectedParts };
        delete newSelectedParts[categoryId]; // 해당 부품 선택 해제
        setSelectedParts(newSelectedParts);

        // Stack2에서 해당 카테고리 드롭다운 열기 위해 상태만 변경
        // Stack3로 이동하지 않음
    };

    // Stack 3에서 제품 확정 시 호출
    const handleProductConfirm = (categoryId, model, product) => {
        const newSelectedParts = {
            ...selectedParts,
            [categoryId]: {
                model: model,
                product: product,
                confirmed: true,
            },
        };
        setSelectedParts(newSelectedParts);

        setCurrentCategory(null);
        setCurrentModel(null);

        // 모든 부품이 확정되었는지 확인
        const allConfirmed = partCategories.every((cat) => newSelectedParts[cat.id]?.confirmed);

        if (allConfirmed) {
            // 모든 부품 확정되면 Stack 4로 자동 이동
            setTimeout(() => {
                setActiveStack(4);
            }, 500);
        } else {
            // AI 자동완성 모드면 Stack4로, 가이드 모드면 Stack2로
            if (estimateMode === 'auto') {
                setActiveStack(4);
            } else {
                setActiveStack(2);
            }
        }
    };

    return (
        <div className="app">
            {/* Fixed Navigation Bar */}
            <nav className="navbar">
                <div className="nav-brand">Danaolga & Daona: AI PC Builder</div>
            </nav>

            {/* AI Chatbot (플로팅 버튼) */}
            {phase === 'sidebar' && <AiChatbot />}

            {/* Phase 1: Intro Screen */}
            {phase === 'intro' && <AiIntro onNext={() => handlePhaseChange('chat')} />}

            {/* Phase 1: Chat UI (4-step dialogue) */}
            {phase === 'chat' && <ChatUI onComplete={(answers) => handlePhaseChange('sidebar', { answers })} />}

            {/* Phase 2: Sidebar Stacks */}
            {phase === 'sidebar' && (
                <div className="sidebar-layout">
                    <SidebarStack1
                        onNext={(mode) => {
                            setEstimateMode(mode);
                            if (mode === 'auto') {
                                // AI 자동완성: 모든 부품 자동 선택
                                setSelectedParts(generateAutoCompleteParts());
                                // Stack2와 Stack4만 표시 (Stack3는 건너뜀)
                                setTimeout(() => setActiveStack(2), 100);
                                setTimeout(() => setActiveStack(4), 400);
                            } else {
                                setActiveStack(2); // Go to Stack 2
                            }
                        }}
                        isActive={activeStack >= 1}
                    />

                    {estimateMode && activeStack >= 2 && (
                        <SidebarStack2
                            onModelSelect={handleModelSelect}
                            onPartEdit={handlePartEdit}
                            onBack={() => setActiveStack(1)}
                            isActive={activeStack >= 2}
                            selectedParts={selectedParts}
                            partCategories={partCategories}
                            currentCategory={currentCategory}
                        />
                    )}

                    {estimateMode && activeStack >= 3 && currentCategory && currentModel && (
                        <SidebarStack3
                            onProductConfirm={handleProductConfirm}
                            onBack={() => {
                                setActiveStack(estimateMode === 'auto' ? 4 : 2);
                                setCurrentCategory(null);
                                setCurrentModel(null);
                            }}
                            isActive={activeStack >= 3}
                            currentCategory={currentCategory}
                            currentModel={currentModel}
                        />
                    )}

                    {estimateMode && activeStack >= 4 && (
                        <SidebarStack4
                            userAnswers={userAnswers}
                            estimateMode={estimateMode}
                            selectedParts={selectedParts}
                            onBack={() => setActiveStack(estimateMode === 'auto' ? 1 : 2)}
                            isActive={activeStack >= 4}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default AiBuildApp;
