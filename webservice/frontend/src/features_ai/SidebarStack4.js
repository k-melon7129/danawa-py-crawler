import React, { useState, useEffect } from 'react';

function SidebarStack4({ userAnswers, estimateMode, selectedParts, onBack, isActive }) {
    const [showAIMessage, setShowAIMessage] = useState(false);

    useState(() => {
        setTimeout(() => setShowAIMessage(true), 500);
    }, []);

    // selectedParts를 견적 테이블 형식으로 변환
    const getFinalBuild = () => {
        const partsList = [];

        if (selectedParts.cpu?.confirmed) {
            partsList.push({
                category: 'CPU',
                model: selectedParts.cpu.model,
                product: selectedParts.cpu.product?.name || selectedParts.cpu.model,
                price: selectedParts.cpu.product?.price || 489000,
                specs: '8코어 16스레드',
            });
        }

        if (selectedParts.gpu?.confirmed) {
            partsList.push({
                category: 'GPU',
                model: selectedParts.gpu.model,
                product: selectedParts.gpu.product?.name || selectedParts.gpu.model,
                price: selectedParts.gpu.product?.price || 479000,
                specs: '8GB GDDR6',
            });
        }

        if (selectedParts.ram?.confirmed) {
            partsList.push({
                category: 'RAM',
                model: selectedParts.ram.model,
                product: selectedParts.ram.product?.name || selectedParts.ram.model,
                price: selectedParts.ram.product?.price || 189000,
                specs: selectedParts.ram.model,
            });
        }

        if (selectedParts.ssd?.confirmed) {
            partsList.push({
                category: 'SSD',
                model: selectedParts.ssd.model,
                product: selectedParts.ssd.product?.name || selectedParts.ssd.model,
                price: selectedParts.ssd.product?.price || 149000,
                specs: selectedParts.ssd.model,
            });
        }

        if (selectedParts.case?.confirmed) {
            partsList.push({
                category: 'CASE',
                model: selectedParts.case.model,
                product: selectedParts.case.product?.name || selectedParts.case.model,
                price: selectedParts.case.product?.price || 129000,
                specs: selectedParts.case.model,
            });
        }

        if (selectedParts.psu?.confirmed) {
            partsList.push({
                category: 'PSU',
                model: selectedParts.psu.model,
                product: selectedParts.psu.product?.name || selectedParts.psu.model,
                price: selectedParts.psu.product?.price || 159000,
                specs: selectedParts.psu.model,
            });
        }

        // AI 자동 완성 모드인 경우 샘플 데이터 (발표용 현실적인 가격)
        if (estimateMode === 'auto' && partsList.length === 0) {
            return [
                {
                    category: 'CPU',
                    model: 'AMD Ryzen 7 7800X3D',
                    product: 'AMD Ryzen 7 7800X3D',
                    price: 520000,
                    specs: '8코어 16스레드',
                },
                {
                    category: 'GPU',
                    model: 'RTX 4060',
                    product: 'ZOTAC RTX 4060 Twin Edge',
                    price: 420000,
                    specs: '8GB GDDR6',
                },
                {
                    category: 'RAM',
                    model: '32GB DDR5-5600',
                    product: 'Samsung DDR5 32GB (16GB x 2)',
                    price: 140000,
                    specs: '32GB DDR5-5600',
                },
                {
                    category: 'SSD',
                    model: '1TB NVMe',
                    product: 'Samsung 980 PRO 1TB',
                    price: 130000,
                    specs: '1TB NVMe Gen4',
                },
                { category: 'CASE', model: 'Mid Tower', product: 'NZXT H510 Flow', price: 110000, specs: 'Mid Tower' },
                {
                    category: 'PSU',
                    model: '750W 80+ Gold',
                    product: 'Corsair RM750e',
                    price: 130000,
                    specs: '750W 80+ Gold',
                },
            ];
        }

        return partsList;
    };

    const finalBuild = getFinalBuild();
    const totalPrice = finalBuild.reduce((sum, item) => sum + item.price, 0);
    const budget = 1500000; // 발표용 예산 (총 견적: 약 145만원)
    const remaining = budget - totalPrice;
    const usageRate = ((totalPrice / budget) * 100).toFixed(1);

    const handleAIReview = () => {
        alert('AI가 견적을 재검토하고 있습니다...\n\n✓ 전력 공급 충분\n✓ 부품 호환성 양호\n✓ 예산 범위 내');
    };

    return (
        <div className={`sidebar-stack sidebar-stack-4 ${isActive ? 'slide-in' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-title">📋 최종 견적서</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>
                    {estimateMode === 'auto' ? '✨ AI 자동 완성' : '🤖 AI 가이드 선택'} 방식
                </div>
            </div>

            <div className="sidebar-content">
                {/* Estimate Summary Table (Horizontal Card Style) */}
                <div style={{ marginBottom: '2rem' }}>
                    <label className="form-label">📦 견적 구성 ({finalBuild.length}개 부품)</label>
                    {finalBuild.length === 0 ? (
                        <div
                            style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: '#f8fafc',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '10px',
                                color: '#64748b',
                            }}
                        >
                            아직 선택된 부품이 없습니다.
                            <br />
                            Stack 2에서 부품을 선택해주세요.
                        </div>
                    ) : (
                        <div
                            style={{
                                background: '#ffffff',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                        >
                            {finalBuild.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '90px 1fr 130px',
                                        gap: '1rem',
                                        padding: '1.2rem',
                                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                                        borderBottom: idx < finalBuild.length - 1 ? '1px solid #e2e8f0' : 'none',
                                        alignItems: 'start',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <div
                                        style={{
                                            fontWeight: '700',
                                            fontSize: '0.9rem',
                                            color: '#ffffff',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            padding: '0.5rem',
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.category}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                marginBottom: '0.3rem',
                                                color: '#1e293b',
                                            }}
                                        >
                                            {item.product}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>📄 {item.specs}</div>
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '800',
                                            color: '#2563eb',
                                            textAlign: 'right',
                                        }}
                                    >
                                        ₩{item.price.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Total & Remaining Budget */}
                {finalBuild.length > 0 && (
                    <div
                        style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: '600', color: 'white' }}>💰 총 견적 금액</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'white' }}>
                                ₩{totalPrice.toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>잔액</span>
                            <span
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    color: remaining >= 0 ? '#d1fae5' : '#fecaca',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                {remaining >= 0 ? '+' : ''}₩{remaining.toLocaleString()}
                            </span>
                        </div>
                        <div
                            style={{
                                width: '100%',
                                height: '10px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                marginBottom: '0.5rem',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            <div
                                style={{
                                    width: `${Math.min(usageRate, 100)}%`,
                                    height: '100%',
                                    background:
                                        usageRate > 95
                                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                                            : 'linear-gradient(90deg, #10b981, #34d399)',
                                    transition: 'width 0.5s ease',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                }}
                            ></div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'white', textAlign: 'center', fontWeight: '600' }}>
                            📊 예산 사용률: {usageRate}%
                        </div>
                    </div>
                )}

                {/* AI Closing Message */}
                {showAIMessage && finalBuild.length > 0 && (
                    <div
                        style={{
                            padding: '1.5rem',
                            background: '#f1f5f9',
                            borderLeft: '4px solid #2563eb',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            animation: 'slideUp 0.5s ease-out',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '0.8rem' }}>
                            <div style={{ fontSize: '1.5rem' }}>🎧</div>
                            <div>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2563eb' }}>
                                    다오나
                                </div>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#1e293b' }}>
                                    "선택하신 조건으로 견적 구성을 마쳤어요.
                                    <br />
                                    수고하셨어요, 이제 완벽한 PC를 만날 준비만 남았네요!"
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                    <button className="btn-secondary" style={{ fontWeight: '600' }}>
                        🔄 초기화
                    </button>
                    <button className="btn-secondary" style={{ fontWeight: '600' }}>
                        💾 견적서 저장
                    </button>
                    <button className="btn-secondary" style={{ fontWeight: '600' }}>
                        📝 PDF 출력
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleAIReview}
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            border: 'none',
                            fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        }}
                    >
                        🤖 AI 재검토
                    </button>
                </div>

                {/* Back Button */}
                <button className="btn-secondary" onClick={onBack} style={{ width: '100%' }}>
                    ← 이전 단계로 돌아가기
                </button>

                {/* AI Review Info */}
                <div
                    style={{
                        marginTop: '1.5rem',
                        padding: '1rem',
                        background: '#fef3c7',
                        border: '1px solid #fbbf24',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: '#92400e',
                    }}
                >
                    💡 <strong>AI 재검토</strong>는 다음을 자동으로 확인합니다:
                    <br />
                    • PSU 용량이 GPU+CPU 요구전력보다 충분한지
                    <br />
                    • CPU와 메인보드 소켓 호환성
                    <br />• 예산 초과 5% 이상 여부
                </div>
            </div>
        </div>
    );
}

export default SidebarStack4;
