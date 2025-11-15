import SidebarStack1Expert from './SidebarStack1Expert';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// 도움말 툴팁 컴포넌트 (Portal 사용)
function HelpIcon({ title, description }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState(null);
    const iconRef = useRef(null);

    const handleMouseEnter = () => {
        if (iconRef.current) {
            const iconRect = iconRef.current.getBoundingClientRect();

            // 물음표 아이콘 우측에 바로 표시
            setPosition({
                top: iconRect.top + window.scrollY,
                left: iconRect.right + window.scrollX + 10,
            });
            setShowTooltip(true);
        }
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        setPosition(null);
    };

    return (
        <>
            <div
                className="tooltip-wrapper"
                ref={iconRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <span className="help-icon">?</span>
            </div>

            {/* 실제 표시되는 툴팁 (물음표 우측에 고정) */}
            {showTooltip &&
                position &&
                ReactDOM.createPortal(
                    <div
                        className="tooltip-portal"
                        style={{
                            position: 'absolute',
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                            zIndex: 99999,
                            pointerEvents: 'none',
                        }}
                    >
                        <div className="tooltip-content-right">
                            <strong>{title}</strong>
                            {description}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}

// 도움말 텍스트 데이터
const HELP_TEXTS = {
    estimateMode: {
        title: '견적 진행 방식',
        description:
            '• AI 자동 완성: 다오나가 대화 내용을 바탕으로 모든 부품을 자동으로 선택해드립니다. 초보자에게 추천!\n\n• AI 가이드 선택: 각 부품을 직접 고르면서 견적을 만듭니다. AI가 추천은 해주지만 최종 선택은 본인이 합니다. 어느정도 PC에 대해 아시는 분께 추천!',
    },
    recommendStyle: {
        title: '추천 스타일',
        description:
            '• 가성비 중심: 같은 성능이면 더 저렴한 제품을 추천합니다. 예산이 제한적이거나 실용적인 구성을 원할 때\n\n• 균형형: 가격과 성능의 균형을 맞춥니다. 가장 무난한 선택\n\n• 최고사양형: 가격보다 성능을 우선합니다. 최고의 부품으로 구성하고 싶을 때',
    },
    aiFlexibility: {
        title: 'AI 유연성',
        description:
            '• 엄격 모드: 설정한 조건을 정확히 지킵니다 (예: 예산 절대 초과 안함)\n\n• 유연 모드: 더 나은 구성을 위해 조건을 약간 조정할 수 있습니다 (예: 예산 5% 초과해도 성능이 훨씬 좋으면 추천)',
    },
    budget: {
        title: '예산 설정',
        description:
            'PC 구매에 사용할 최소~최대 예산을 설정하세요. 유연성은 예산을 얼마나 초과할 수 있는지를 의미합니다. (예: 10% = 150만원 예산에서 최대 165만원까지 허용)',
    },
    budgetFlexibility: {
        title: '예산 여유도',
        description:
            '더 좋은 부품 구성을 위해 예산을 얼마나 초과할 수 있는지 설정합니다.\n\n【예산 여유도 설명】\n• 0% (보수적): 설정한 예산을 절대 초과하지 않습니다\n• 10% (적당): 약간의 예산 초과를 허용합니다\n• 20% (여유형): 더 나은 구성을 위해 예산을 유연하게 조정합니다\n\n예시: 150만원 예산에 10% 여유도 = 최대 165만원까지 추천 가능\n\n💡 팁: 여유도를 주면 가격 대비 성능이 훨씬 좋은 부품으로 업그레이드할 수 있는 기회를 놓치지 않습니다.',
    },
    usagePurpose: {
        title: '사용 목적',
        description:
            'PC를 주로 어떤 용도로 사용하실 건가요? 여러 개 선택 가능하며, 선택한 목적에 맞춰 부품 비율이 자동 조정됩니다.',
    },
    componentRatio: {
        title: '부품별 예산 비율',
        description:
            '전체 예산 중 각 부품에 얼마를 투자할지 설정합니다. 자물쇠를 클릭하면 해당 비율을 고정할 수 있어요. 게임용이면 GPU 비중을 높이고, 작업용이면 CPU/RAM 비중을 높이는 게 좋습니다.\n\n【AI 자동 설정】\n선택한 사용 목적과 성능 설정을 기반으로 AI가 최적의 부품 비율을 자동으로 계산해드립니다.\n\n예시:\n• 게이밍: GPU 비중 증가\n• 영상편집: CPU+RAM 비중 증가\n• 사무용: 균형잡힌 비율\n\n자동 설정 후에도 수동으로 조정 가능합니다.',
    },
    performance: {
        title: '성능 및 작업 우선도',
        description:
            '‼️ 선택사항: 이 섹션을 접어두면 미설정으로 처리되며, AI가 사용 목적을 기반으로 자동으로 판단합니다.\n\n주로 어떤 작업을 하실 건가요? 작업 강도가 높을수록 더 강력한 CPU를, 그래픽 목표가 높을수록 더 강력한 GPU를 추천합니다.\n\n【작업 강도】\n• 가벼움: 문서/웹/영상시청 (저사양 CPU)\n• 중간: 사무/코딩/간단한 편집 (중급 CPU)\n• 고사양: 3D렌더링/영상편집/AI학습 (고성능 CPU)\n\n【멀티태스킹】\n• 낮음: 1-2개 프로그램 (16GB RAM)\n• 보통: 여러 프로그램 동시 (16-32GB RAM)\n• 높음: 수십개 탭/프로그램 (32GB+ RAM)\n\n【그래픽 목표】\n• 낮음: 그래픽 불필요 (내장그래픽)\n• 보통: 1080p 게임 (RTX 4060급)\n• 높음: 1440p/4K 게임 (RTX 4070+급)\n• 최고: 4K 울트라 (RTX 4080+급)',
    },
    caseEnvironment: {
        title: '케이스 및 환경',
        description:
            '‼️ 선택사항: 이 섹션을 접어두면 미설정으로 처리되며, AI가 일반적인 미들타워 케이스로 추천합니다.\n\n【케이스 크기】\n• 빅타워: 확장성 최고, 공간 많이 차지\n• 미들타워: 가장 일반적, 확장성과 크기 균형\n• 미니타워: 작은 공간, 확장 제한적\n• SFF: 매우 작음, 특수 부품 필요\n\n【패널 형태】\n• 강화유리: 내부 보임, 예쁘지만 무겁고 지문\n• 폐쇄형: 소음 차단 좋음, 통풍 약함\n• 메시: 통풍 우수, 쿨링 좋지만 먼지\n• 전면유리: 디자인과 기능성의 균형',
    },
    powerNoise: {
        title: '전력 효율 및 소음',
        description:
            '‼️ 선택사항: 이 섹션을 접어두면 미설정으로 처리되며, AI가 균형잡힌 냉각으로 추천합니다.\n\n【전력 절약 모드】\n전기세가 걱정된다면 켜세요. 저전력 부품을 우선 추천합니다. 다만 성능이 약간 낮아질 수 있습니다.\n\n【소음 기준】\n• 무소음 지향: 저소음 쿨러/팬 우선, 성능 약간 포기 가능\n• 균형 잡힌 냉각: 소음과 성능의 균형 (추천)\n• 최대 냉각 성능: 소음보다 성능 우선, 쿨링 극대화',
    },
    design: {
        title: '디자인 및 외관',
        description:
            '‼️ 선택사항: 이 섹션을 접어두면 미설정으로 처리되며, AI가 기본적인 디자인으로 추천합니다.\n\n【RGB 조명】\n화려한 LED 조명을 원하시나요? 켜면 RGB 부품을 우선 추천하지만 가격이 더 비쌉니다.\n\n【색상 테마】\n선호하는 색상을 최대 3개까지 선택하세요.\n\n【재질】\n철제/스틸: 튼튼하고 저렴 | 알루미늄: 가볍고 고급 | 플라스틱: 저렴',
    },
    upgradeDurability: {
        title: '업그레이드 및 내구성',
        description:
            '‼️ 선택사항: 이 섹션을 접어두면 미설정으로 처리되며, AI가 일반적인 기준으로 추천합니다.\n\n【업그레이드 계획】\n나중에 부품을 추가하거나 교체할 계획이 있나요? 켜면 확장성이 좋은 메인보드와 여유있는 파워를 추천합니다.\n\n【AS 기준】\n• 국내: AS가 빠르고 편리하지만 선택폭이 좁음\n• 상관없음: 더 많은 선택지, 해외 배송 AS 가능\n\n【사용 수명 목표】\n• 1-3년: 단기 사용, 저렴한 부품 OK\n• 3-5년: 일반적인 사용 기간\n• 5년+: 장기 사용, 내구성 좋은 부품',
    },
};

function SidebarStack1({ onNext, isActive }) {
    const contentRef = useRef(null);
    const [mode, setMode] = useState('basic'); // 'basic' or 'expert'
    const [estimateMode, setEstimateMode] = useState('auto');
    const [recommendStyle, setRecommendStyle] = useState('balanced');
    const [aiFlexibility, setAiFlexibility] = useState('strict');
    const [usagePurposes, setUsagePurposes] = useState([]);

    // 사이드바가 활성화될 때 스크롤을 맨 위로
    useEffect(() => {
        if (isActive && contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [isActive]);

    // 모드 전환 시 스크롤을 맨 위로
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [mode]);

    // 선택적 섹션 펼치기/접기 상태
    const [expandedSections, setExpandedSections] = useState({
        performance: false,
        caseEnvironment: false,
        powerNoise: false,
        design: false,
        upgrade: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // 성능 및 작업 우선도
    const [workloadIntensity, setWorkloadIntensity] = useState('medium');
    const [multitaskingLevel, setMultitaskingLevel] = useState('normal');
    const [graphicsTarget, setGraphicsTarget] = useState('normal');

    // 케이스 및 환경
    const [caseSize, setCaseSize] = useState('mid');
    const [panelType, setPanelType] = useState('tempered_glass');

    // 전력 및 소음
    const [powerSaving, setPowerSaving] = useState(false);
    const [noiseCriteria, setNoiseCriteria] = useState('balanced');

    // 디자인 및 외관
    const [colorTheme, setColorTheme] = useState([]);
    const [rgbLighting, setRgbLighting] = useState(false);
    const [material, setMaterial] = useState('steel');

    // 업그레이드 및 내구성
    const [upgradePlan, setUpgradePlan] = useState(false);
    const [asCriteria, setAsCriteria] = useState('domestic');
    const [lifecycle, setLifecycle] = useState('3-5years');

    // 예산 설정
    const [budgetMin, setBudgetMin] = useState(1000000);
    const [budgetMax, setBudgetMax] = useState(1500000);
    const [budgetFlexibility, setBudgetFlexibility] = useState(10); // 0-20%

    // 부품별 비율 (총합 100%)
    const [componentRatios, setComponentRatios] = useState({
        cpu: 25,
        gpu: 35,
        mainboard: 10,
        ram: 8,
        storage: 7,
        psu: 5,
        case: 5,
        cooler: 3,
        etc: 2,
    });

    // 부품별 잠금 상태
    const [lockedComponents, setLockedComponents] = useState({});

    // 현재 예산 (슬라이더)
    const [currentBudget, setCurrentBudget] = useState(1500000);

    const handleStart = () => {
        onNext(estimateMode);
    };

    const handlePurposeChange = (purpose) => {
        if (usagePurposes.includes(purpose)) {
            setUsagePurposes(usagePurposes.filter((p) => p !== purpose));
        } else {
            setUsagePurposes([...usagePurposes, purpose]);
        }
    };

    const handleColorChange = (color) => {
        if (colorTheme.includes(color)) {
            setColorTheme(colorTheme.filter((c) => c !== color));
        } else if (colorTheme.length < 3) {
            setColorTheme([...colorTheme, color]);
        }
    };

    const toggleLock = (component) => {
        setLockedComponents((prev) => ({
            ...prev,
            [component]: !prev[component],
        }));
    };

    const handleRatioChange = (component, newValue) => {
        const lockedKeys = Object.keys(lockedComponents).filter((key) => lockedComponents[key]);
        const unlockedKeys = Object.keys(componentRatios).filter((key) => !lockedComponents[key] && key !== component);

        const currentTotal = Object.values(componentRatios).reduce((sum, val) => sum + val, 0);
        const diff = newValue - componentRatios[component];

        if (unlockedKeys.length === 0) return;

        const distributeAmount = -diff / unlockedKeys.length;

        const newRatios = { ...componentRatios };
        newRatios[component] = newValue;

        unlockedKeys.forEach((key) => {
            newRatios[key] = Math.max(0, Math.round(newRatios[key] + distributeAmount));
        });

        const newTotal = Object.values(newRatios).reduce((sum, val) => sum + val, 0);
        if (newTotal !== 100) {
            const adjustment = 100 - newTotal;
            const firstUnlocked = unlockedKeys[0];
            if (firstUnlocked) {
                newRatios[firstUnlocked] = Math.max(0, newRatios[firstUnlocked] + adjustment);
            }
        }

        setComponentRatios(newRatios);
    };

    const setAIAutoRatio = () => {
        let newRatios = {};

        if (usagePurposes.includes('게이밍')) {
            // 게이밍: GPU 중심
            newRatios = { cpu: 20, gpu: 45, mainboard: 8, ram: 8, storage: 6, psu: 5, case: 4, cooler: 3, etc: 1 };
        } else if (usagePurposes.includes('영상 편집')) {
            // 영상 편집: CPU, GPU, RAM 균형
            newRatios = { cpu: 28, gpu: 30, mainboard: 10, ram: 12, storage: 8, psu: 5, case: 3, cooler: 3, etc: 1 };
        } else if (usagePurposes.includes('코딩·AI')) {
            // 코딩·AI: CPU, RAM 중심
            newRatios = { cpu: 30, gpu: 25, mainboard: 10, ram: 15, storage: 8, psu: 5, case: 3, cooler: 3, etc: 1 };
        } else if (usagePurposes.includes('디자인')) {
            // 디자인: GPU, RAM 중심
            newRatios = { cpu: 22, gpu: 35, mainboard: 8, ram: 12, storage: 8, psu: 6, case: 4, cooler: 4, etc: 1 };
        } else if (usagePurposes.includes('사무용')) {
            // 사무용: 균형
            newRatios = { cpu: 25, gpu: 20, mainboard: 10, ram: 10, storage: 12, psu: 8, case: 8, cooler: 5, etc: 2 };
        } else {
            // 기본 균형형
            newRatios = { cpu: 25, gpu: 35, mainboard: 10, ram: 8, storage: 7, psu: 5, case: 5, cooler: 3, etc: 2 };
        }

        // 잠긴 항목은 유지
        Object.keys(lockedComponents).forEach((comp) => {
            if (lockedComponents[comp]) {
                newRatios[comp] = componentRatios[comp];
            }
        });

        setComponentRatios(newRatios);
    };

    // 예상 금액 계산
    const getEstimatedAmounts = () => {
        const total = currentBudget;
        const amounts = {};
        Object.keys(componentRatios).forEach((comp) => {
            amounts[comp] = Math.floor((total * componentRatios[comp]) / 100);
        });
        return amounts;
    };

    const estimatedAmounts = getEstimatedAmounts();
    const totalRatio = Object.values(componentRatios).reduce((sum, val) => sum + val, 0);
    const flexibleBudget = {
        current: currentBudget,
        flexMax: currentBudget + Math.floor(currentBudget * (budgetFlexibility / 100)),
    };

    return (
        <div className={`sidebar-stack sidebar-stack-1 ${isActive ? 'slide-in' : ''}`}>
            <div className="sidebar-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div className="sidebar-title">메인 사이드바</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>AI 조건 설정</div>
                    </div>
                    <button
                        onClick={() => setMode(mode === 'basic' ? 'expert' : 'basic')}
                        style={{
                            padding: '0.5rem 1rem',
                            background:
                                mode === 'expert'
                                    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    >
                        {mode === 'basic' ? '기본 모드' : '전문가 모드'}
                    </button>
                </div>
            </div>

            <div className="sidebar-content" ref={contentRef}>
                {/* 기본 모드 콘텐츠 */}
                {mode === 'basic' && (
                    <>
                        {/* 견적 진행 방식 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    견적 진행 방식
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.estimateMode.title}
                                    description={HELP_TEXTS.estimateMode.description}
                                />
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div className="form-radio">
                                    <input
                                        type="radio"
                                        name="estimateMode"
                                        value="auto"
                                        checked={estimateMode === 'auto'}
                                        onChange={(e) => setEstimateMode(e.target.value)}
                                    />
                                    <span>AI 자동 완성</span>
                                </div>
                                <div className="form-radio">
                                    <input
                                        type="radio"
                                        name="estimateMode"
                                        value="guided"
                                        checked={estimateMode === 'guided'}
                                        onChange={(e) => setEstimateMode(e.target.value)}
                                    />
                                    <span>AI 가이드 선택</span>
                                </div>
                            </div>
                        </div>

                        {/* 추천 스타일 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    추천 스타일
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.recommendStyle.title}
                                    description={HELP_TEXTS.recommendStyle.description}
                                />
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div className="form-radio">
                                    <input
                                        type="radio"
                                        name="recommendStyle"
                                        value="value"
                                        checked={recommendStyle === 'value'}
                                        onChange={(e) => setRecommendStyle(e.target.value)}
                                    />
                                    <span>가성비 중심</span>
                                </div>
                                <div className="form-radio">
                                    <input
                                        type="radio"
                                        name="recommendStyle"
                                        value="balanced"
                                        checked={recommendStyle === 'balanced'}
                                        onChange={(e) => setRecommendStyle(e.target.value)}
                                    />
                                    <span>균형형</span>
                                </div>
                                <div className="form-radio">
                                    <input
                                        type="radio"
                                        name="recommendStyle"
                                        value="highend"
                                        checked={recommendStyle === 'highend'}
                                        onChange={(e) => setRecommendStyle(e.target.value)}
                                    />
                                    <span>최고사양형</span>
                                </div>
                            </div>
                        </div>

                        {/* AI 유연성 토글 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    AI 유연성
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.aiFlexibility.title}
                                    description={HELP_TEXTS.aiFlexibility.description}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                }}
                            >
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>조건 엄격 모드</span>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        checked={aiFlexibility === 'flexible'}
                                        onChange={(e) => setAiFlexibility(e.target.checked ? 'flexible' : 'strict')}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>자유 추천 모드</span>
                            </div>
                        </div>

                        {/* 사용 목적 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    사용 목적 (복수 선택 가능)
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.usagePurpose.title}
                                    description={HELP_TEXTS.usagePurpose.description}
                                />
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                {['사무용', '게이밍', '디자인', '영상 편집', '코딩·AI'].map((purpose) => (
                                    <div key={purpose} className="form-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={usagePurposes.includes(purpose)}
                                            onChange={() => handlePurposeChange(purpose)}
                                        />
                                        <span>{purpose}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 예산 설정 - 단일 슬라이더 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    예산 범위
                                </label>
                                <HelpIcon title={HELP_TEXTS.budget.title} description={HELP_TEXTS.budget.description} />
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                {/* 최소/최대 입력 필드 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1, marginRight: '0.5rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            최소 예산
                                        </label>
                                        <input
                                            type="text"
                                            value={`₩${budgetMin.toLocaleString()}`}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 500000;
                                                setBudgetMin(val);
                                                if (currentBudget < val) setCurrentBudget(val);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                            }}
                                        />
                                    </div>
                                    <div style={{ flex: 1, marginLeft: '0.5rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            최대 예산
                                        </label>
                                        <input
                                            type="text"
                                            value={`₩${budgetMax.toLocaleString()}`}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 5000000;
                                                setBudgetMax(val);
                                                if (currentBudget > val) setCurrentBudget(val);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '0.5rem',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* 단일 슬라이더 */}
                                <div style={{ marginBottom: '0.8rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.3rem' }}>
                                        현재 예산:{' '}
                                        <span style={{ fontWeight: '700', color: '#2563eb' }}>
                                            ₩{currentBudget.toLocaleString()}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min={budgetMin}
                                        max={budgetMax}
                                        step="50000"
                                        value={currentBudget}
                                        onChange={(e) => setCurrentBudget(parseInt(e.target.value))}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 예산 여유도 슬라이더 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    예산 여유도
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.budgetFlexibility.title}
                                    description={HELP_TEXTS.budgetFlexibility.description}
                                />
                            </div>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                <div
                                    style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
                                >
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>보수적 (0%)</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2563eb' }}>
                                        +{budgetFlexibility}%
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>여유형 (+20%)</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="1"
                                    value={budgetFlexibility}
                                    onChange={(e) => setBudgetFlexibility(parseInt(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                                <div
                                    style={{
                                        marginTop: '0.8rem',
                                        padding: '0.8rem',
                                        background: '#dbeafe',
                                        borderRadius: '6px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '0.85rem', color: '#1e40af' }}>
                                        예상 총 견적 (여유도 포함)
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
                                        ₩{flexibleBudget.current.toLocaleString()} ~ ₩
                                        {flexibleBudget.flexMax.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 부품별 비율 슬라이더 */}
                        <div className="form-group">
                            <div className="section-header-with-help">
                                <label className="form-label" style={{ margin: 0 }}>
                                    부품별 비율 설정 (총합 100%)
                                </label>
                                <HelpIcon
                                    title={HELP_TEXTS.componentRatio.title}
                                    description={HELP_TEXTS.componentRatio.description}
                                />
                            </div>
                            <button
                                onClick={setAIAutoRatio}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 1rem',
                                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginBottom: '0.8rem',
                                }}
                                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.02)')}
                                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                            >
                                🤖 AI 자동 설정
                            </button>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                                {Object.entries(componentRatios).map(([component, ratio]) => {
                                    const labels = {
                                        cpu: 'CPU',
                                        gpu: 'GPU',
                                        mainboard: '메인보드',
                                        ram: 'RAM',
                                        storage: '저장장치',
                                        psu: '파워',
                                        case: '케이스',
                                        cooler: '쿨러',
                                        etc: '기타',
                                    };
                                    const isLocked = lockedComponents[component];
                                    return (
                                        <div
                                            key={component}
                                            style={{
                                                marginBottom: '1rem',
                                                opacity: isLocked ? 0.6 : 1,
                                                transition: 'opacity 0.2s',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '0.3rem',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                                        {labels[component]}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleLock(component)}
                                                        style={{
                                                            background: isLocked ? '#10b981' : '#e2e8f0',
                                                            color: isLocked ? 'white' : '#64748b',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '0.2rem 0.4rem',
                                                            fontSize: '0.75rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                        }}
                                                        title={isLocked ? '잠금 해제' : '비율 고정'}
                                                    >
                                                        {isLocked ? '🔒' : '🔓'}
                                                    </button>
                                                </div>
                                                <span
                                                    style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: '600' }}
                                                >
                                                    {ratio}% (₩{estimatedAmounts[component].toLocaleString()})
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="50"
                                                step="1"
                                                value={ratio}
                                                onChange={(e) => handleRatioChange(component, parseInt(e.target.value))}
                                                disabled={isLocked}
                                                style={{
                                                    width: '100%',
                                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                                <div
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.8rem',
                                        background: totalRatio === 100 ? '#d1fae5' : '#fee2e2',
                                        borderRadius: '6px',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: '0.85rem',
                                            color: totalRatio === 100 ? '#065f46' : '#991b1b',
                                        }}
                                    >
                                        총합: {totalRatio}% {totalRatio === 100 ? '✓' : '⚠️ 100%로 조정 필요'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 성능 및 작업 우선도 */}
                        <div className="form-group">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: expandedSections.performance ? '#e0f2fe' : '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: expandedSections.performance
                                        ? '2px solid #0ea5e9'
                                        : '2px solid transparent',
                                }}
                                onClick={() => toggleSection('performance')}
                            >
                                <label
                                    className="form-label"
                                    style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    성능 및 작업 우선도
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <HelpIcon
                                        title={HELP_TEXTS.performance.title}
                                        description={HELP_TEXTS.performance.description}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                                        {expandedSections.performance ? '설정됨' : '미설정'}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b' }}>
                                        {expandedSections.performance ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                            {expandedSections.performance && (
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            작업 강도
                                        </label>
                                        <select
                                            className="form-select"
                                            value={workloadIntensity}
                                            onChange={(e) => setWorkloadIntensity(e.target.value)}
                                        >
                                            <option value="light">가벼움</option>
                                            <option value="medium">중간</option>
                                            <option value="heavy">고사양</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            멀티태스킹 정도
                                        </label>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="multitasking"
                                                value="low"
                                                checked={multitaskingLevel === 'low'}
                                                onChange={(e) => setMultitaskingLevel(e.target.value)}
                                            />
                                            <span>낮음</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="multitasking"
                                                value="normal"
                                                checked={multitaskingLevel === 'normal'}
                                                onChange={(e) => setMultitaskingLevel(e.target.value)}
                                            />
                                            <span>보통</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="multitasking"
                                                value="high"
                                                checked={multitaskingLevel === 'high'}
                                                onChange={(e) => setMultitaskingLevel(e.target.value)}
                                            />
                                            <span>높음</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            그래픽 목표
                                        </label>
                                        <select
                                            className="form-select"
                                            value={graphicsTarget}
                                            onChange={(e) => setGraphicsTarget(e.target.value)}
                                        >
                                            <option value="low">낮음 (FHD / 기본 옵션)</option>
                                            <option value="normal">보통 (QHD / 중간 옵션)</option>
                                            <option value="high">높음 (QHD~4K / 고급 설정)</option>
                                            <option value="ultra">최고 (4K / 울트라 옵션)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 케이스 및 환경 */}
                        <div className="form-group">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: expandedSections.caseEnvironment ? '#e0f2fe' : '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: expandedSections.caseEnvironment
                                        ? '2px solid #0ea5e9'
                                        : '2px solid transparent',
                                }}
                                onClick={() => toggleSection('caseEnvironment')}
                            >
                                <label
                                    className="form-label"
                                    style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    케이스 및 환경
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <HelpIcon
                                        title={HELP_TEXTS.caseEnvironment.title}
                                        description={HELP_TEXTS.caseEnvironment.description}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                                        {expandedSections.caseEnvironment ? '설정됨' : '미설정'}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b' }}>
                                        {expandedSections.caseEnvironment ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                            {expandedSections.caseEnvironment && (
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            케이스 크기
                                        </label>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="caseSize"
                                                value="full"
                                                checked={caseSize === 'full'}
                                                onChange={(e) => setCaseSize(e.target.value)}
                                            />
                                            <span>빅타워 (Full Tower)</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="caseSize"
                                                value="mid"
                                                checked={caseSize === 'mid'}
                                                onChange={(e) => setCaseSize(e.target.value)}
                                            />
                                            <span>미들타워 (Mid Tower)</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="caseSize"
                                                value="mini"
                                                checked={caseSize === 'mini'}
                                                onChange={(e) => setCaseSize(e.target.value)}
                                            />
                                            <span>미니타워 (Mini Tower)</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="caseSize"
                                                value="sff"
                                                checked={caseSize === 'sff'}
                                                onChange={(e) => setCaseSize(e.target.value)}
                                            />
                                            <span>SFF (Small Form Factor)</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            패널 형태
                                        </label>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="panelType"
                                                value="tempered_glass"
                                                checked={panelType === 'tempered_glass'}
                                                onChange={(e) => setPanelType(e.target.value)}
                                            />
                                            <span>강화유리</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="panelType"
                                                value="closed"
                                                checked={panelType === 'closed'}
                                                onChange={(e) => setPanelType(e.target.value)}
                                            />
                                            <span>폐쇄형</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="panelType"
                                                value="mesh"
                                                checked={panelType === 'mesh'}
                                                onChange={(e) => setPanelType(e.target.value)}
                                            />
                                            <span>메시</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="panelType"
                                                value="front_glass"
                                                checked={panelType === 'front_glass'}
                                                onChange={(e) => setPanelType(e.target.value)}
                                            />
                                            <span>전면유리</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 전력 효율 및 소음 */}
                        <div className="form-group">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: expandedSections.powerNoise ? '#e0f2fe' : '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: expandedSections.powerNoise ? '2px solid #0ea5e9' : '2px solid transparent',
                                }}
                                onClick={() => toggleSection('powerNoise')}
                            >
                                <label
                                    className="form-label"
                                    style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    전력 효율 및 소음
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <HelpIcon
                                        title={HELP_TEXTS.powerNoise.title}
                                        description={HELP_TEXTS.powerNoise.description}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                                        {expandedSections.powerNoise ? '설정됨' : '미설정'}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b' }}>
                                        {expandedSections.powerNoise ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                            {expandedSections.powerNoise && (
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="form-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={powerSaving}
                                                onChange={(e) => setPowerSaving(e.target.checked)}
                                            />
                                            <span>전기 절약 모드 (전성비 중심 추천)</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            소음 기준
                                        </label>
                                        <select
                                            className="form-select"
                                            value={noiseCriteria}
                                            onChange={(e) => setNoiseCriteria(e.target.value)}
                                        >
                                            <option value="silent">무소음 지향</option>
                                            <option value="balanced">균형 잡힌 냉각</option>
                                            <option value="performance">최대 냉각 성능</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 디자인 및 외관 */}
                        <div className="form-group">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: expandedSections.design ? '#e0f2fe' : '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: expandedSections.design ? '2px solid #0ea5e9' : '2px solid transparent',
                                }}
                                onClick={() => toggleSection('design')}
                            >
                                <label
                                    className="form-label"
                                    style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    디자인 및 외관
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <HelpIcon
                                        title={HELP_TEXTS.design.title}
                                        description={HELP_TEXTS.design.description}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                                        {expandedSections.design ? '설정됨' : '미설정'}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b' }}>
                                        {expandedSections.design ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                            {expandedSections.design && (
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            색상 테마 (최대 3개)
                                        </label>
                                        {['블랙', '화이트', '실버', '레드', '블루'].map((color) => (
                                            <div key={color} className="form-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={colorTheme.includes(color)}
                                                    onChange={() => handleColorChange(color)}
                                                    disabled={!colorTheme.includes(color) && colorTheme.length >= 3}
                                                />
                                                <span>{color}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="form-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={rgbLighting}
                                                onChange={(e) => setRgbLighting(e.target.checked)}
                                            />
                                            <span>RGB 조명</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            재질
                                        </label>
                                        <select
                                            className="form-select"
                                            value={material}
                                            onChange={(e) => setMaterial(e.target.value)}
                                        >
                                            <option value="steel">철제·스틸</option>
                                            <option value="aluminum">알루미늄</option>
                                            <option value="plastic">플라스틱</option>
                                            <option value="other">기타</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 업그레이드 및 내구성 */}
                        <div className="form-group">
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.8rem 1rem',
                                    background: expandedSections.upgrade ? '#e0f2fe' : '#f8fafc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: expandedSections.upgrade ? '2px solid #0ea5e9' : '2px solid transparent',
                                }}
                                onClick={() => toggleSection('upgrade')}
                            >
                                <label
                                    className="form-label"
                                    style={{ margin: 0, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    업그레이드 및 내구성
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <HelpIcon
                                        title={HELP_TEXTS.upgradeDurability.title}
                                        description={HELP_TEXTS.upgradeDurability.description}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                                        {expandedSections.upgrade ? '설정됨' : '미설정'}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: '#64748b' }}>
                                        {expandedSections.upgrade ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                            {expandedSections.upgrade && (
                                <div
                                    style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        marginTop: '0.5rem',
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div className="form-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={upgradePlan}
                                                onChange={(e) => setUpgradePlan(e.target.checked)}
                                            />
                                            <span>업그레이드 계획 있음</span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            AS 기준
                                        </label>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="asCriteria"
                                                value="domestic"
                                                checked={asCriteria === 'domestic'}
                                                onChange={(e) => setAsCriteria(e.target.value)}
                                            />
                                            <span>국내</span>
                                        </div>
                                        <div className="form-radio">
                                            <input
                                                type="radio"
                                                name="asCriteria"
                                                value="any"
                                                checked={asCriteria === 'any'}
                                                onChange={(e) => setAsCriteria(e.target.value)}
                                            />
                                            <span>상관없음</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                fontSize: '0.85rem',
                                                color: '#64748b',
                                                marginBottom: '0.3rem',
                                                display: 'block',
                                            }}
                                        >
                                            사용 수명 목표
                                        </label>
                                        <select
                                            className="form-select"
                                            value={lifecycle}
                                            onChange={(e) => setLifecycle(e.target.value)}
                                        >
                                            <option value="1-3years">1~3년</option>
                                            <option value="3-5years">3~5년</option>
                                            <option value="5plus">5년 이상</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 실행 버튼 */}
                        <button className="btn-primary" onClick={handleStart}>
                            AI 견적 추천 시작
                        </button>
                    </>
                )}

                {/* 전문가 모드 콘텐츠 */}
                {mode === 'expert' && (
                    <SidebarStack1Expert
                        onNext={onNext}
                        currentBudget={currentBudget}
                        setCurrentBudget={setCurrentBudget}
                        componentRatios={componentRatios}
                        setComponentRatios={setComponentRatios}
                        lockedComponents={lockedComponents}
                        toggleLock={toggleLock}
                        handleRatioChange={handleRatioChange}
                        setAIAutoRatio={setAIAutoRatio}
                        totalRatio={totalRatio}
                    />
                )}
            </div>
        </div>
    );
}

export default SidebarStack1;
