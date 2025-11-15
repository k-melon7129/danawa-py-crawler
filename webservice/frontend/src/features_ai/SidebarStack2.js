import React, { useState, useEffect } from 'react';

function SidebarStack2({ onModelSelect, onPartEdit, onBack, isActive, selectedParts, partCategories, currentCategory }) {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (categoryId) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
        }
    };

    const handlePartEditClick = (categoryId) => {
        onPartEdit(categoryId); // 확정 해제
        setExpandedCategory(categoryId); // 드롭다운 열기
    };

    const selectModel = (categoryId, model) => {
        // Stack 3로 이동하여 해당 모델의 제품들 보여주기
        onModelSelect(categoryId, model);
    };

    const getCompletedCount = () => {
        return Object.values(selectedParts).filter(part => part.confirmed).length;
    };

    // 카테고리별 아이콘 매핑
    const getCategoryIcon = (categoryId) => {
        const icons = {
            cpu: '🖥️',
            gpu: '🎮',
            mainboard: '🔲',
            ram: '💾',
            ssd: '💿',
            hdd: '📀',
            psu: '⚡',
            case: '📦',
            cooler: '❄️',
            monitor: '🖥️'
        };
        return icons[categoryId] || '🔧';
    };

    const getProgressPercentage = () => {
        return Math.round((getCompletedCount() / partCategories.length) * 100);
    };

    return (
        <div className={`sidebar-stack sidebar-stack-2 ${isActive ? 'slide-in' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-title">🛠️ 부품 선택</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>
                    진행도: {getCompletedCount()}/{partCategories.length} ({getProgressPercentage()}%)
                </div>
            </div>

            <div className="sidebar-content">
                {/* Progress Tracker */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.8rem', color: 'white' }}>📊 부품 선택 진행도</div>
                    
                    {/* Progress Bar */}
                    <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        background: 'rgba(255,255,255,0.3)', 
                        borderRadius: '10px', 
                        marginBottom: '1rem',
                        overflow: 'hidden'
                    }}>
                        <div style={{ 
                            width: `${getProgressPercentage()}%`, 
                            height: '100%', 
                            background: 'linear-gradient(90deg, #10b981, #34d399)',
                            borderRadius: '10px',
                            transition: 'width 0.5s ease'
                        }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {partCategories.map(cat => {
                            const isConfirmed = selectedParts[cat.id]?.confirmed;
                            const isSelecting = currentCategory === cat.id;
                            return (
                                <span 
                                    key={cat.id}
                                    style={{
                                        fontSize: '0.75rem',
                                        padding: '0.4rem 0.7rem',
                                        borderRadius: '6px',
                                        background: isConfirmed ? 'rgba(16, 185, 129, 0.9)' : isSelecting ? 'rgba(245, 158, 11, 0.9)' : 'rgba(255,255,255,0.25)',
                                        color: 'white',
                                        border: isSelecting ? '2px solid #fbbf24' : 'none',
                                        fontWeight: '500',
                                        boxShadow: isConfirmed || isSelecting ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                                    }}
                                >
                                    {getCategoryIcon(cat.id)} {cat.name} {isConfirmed ? '✓' : isSelecting ? '⏳' : ''}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Part Categories (Vertical Expansion) */}
                {partCategories.map(category => {
                    const part = selectedParts[category.id];
                    const isConfirmed = part?.confirmed;
                    const isSelecting = currentCategory === category.id;
                    
                    return (
                        <div key={category.id} style={{ marginBottom: '1rem' }}>
                            <div 
                                onClick={() => {
                                    if (isConfirmed) {
                                        handlePartEditClick(category.id);
                                    } else {
                                        toggleCategory(category.id);
                                    }
                                }}
                                style={{
                                    padding: '1rem',
                                    background: isConfirmed ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : isSelecting ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 'white',
                                    border: `2px solid ${isConfirmed ? '#10b981' : isSelecting ? '#f59e0b' : '#e2e8f0'}`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    transition: 'all 0.3s',
                                    opacity: isConfirmed ? 0.85 : 1,
                                    boxShadow: isConfirmed ? '0 2px 8px rgba(16, 185, 129, 0.2)' : isSelecting ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = isConfirmed ? '0 2px 8px rgba(16, 185, 129, 0.2)' : isSelecting ? '0 4px 12px rgba(245, 158, 11, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(category.id)}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1rem' }}>
                                            {category.name}
                                        </span>
                                        {isConfirmed && <span style={{ fontSize: '1rem' }}>🔒</span>}
                                    </div>
                                    {isConfirmed && (
                                        <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '0.3rem', fontWeight: '600' }}>
                                            ✓ {part.model}
                                        </div>
                                    )}
                                    {isConfirmed && part.product && (
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                <span>📦</span>
                                                <span>{part.product.name}</span>
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.3rem', fontWeight: '500' }}>
                                                💡 클릭하여 다른 모델로 변경 가능
                                            </div>
                                        </div>
                                    )}
                                    {isSelecting && (
                                        <div style={{ fontSize: '0.8rem', color: '#d97706', marginTop: '0.3rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <span className="pulse">⏳</span>
                                            <span>제품 선택 중...</span>
                                        </div>
                                    )}
                                </div>
                                {!isConfirmed && (
                                    <span style={{ 
                                        fontSize: '1.3rem', 
                                        color: expandedCategory === category.id ? '#2563eb' : '#94a3b8',
                                        transition: 'all 0.3s',
                                        fontWeight: 'bold'
                                    }}>
                                        {expandedCategory === category.id ? '▼' : '▷'}
                                    </span>
                                )}
                            </div>

                            {/* Expanded Model Options (Vertical) - 확정되지 않은 경우만 표시 */}
                            {!isConfirmed && expandedCategory === category.id && (
                                <div style={{ marginTop: '0.8rem', paddingLeft: '0.5rem' }}>
                                    {category.models.map((model, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => selectModel(category.id, model)}
                                            style={{
                                                padding: '0.9rem 1rem',
                                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '8px',
                                                marginBottom: '0.6rem',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                                fontWeight: '500',
                                                transition: 'all 0.3s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
                                                e.currentTarget.style.borderColor = '#2563eb';
                                                e.currentTarget.style.transform = 'translateX(8px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
                                                e.currentTarget.style.borderColor = '#e2e8f0';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <span>{model}</span>
                                            <span style={{ color: '#2563eb', fontSize: '1.2rem', fontWeight: 'bold' }}>→</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* AI Auto Complete Button */}
                <button 
                    className="btn-primary" 
                    style={{ 
                        width: '100%', 
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        border: 'none',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                    }}
                >
                    ✨ AI 추천으로 전체 자동 구성
                </button>

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>
                        ← 뒤로
                    </button>
                </div>
                
                {/* Info Box */}
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#dbeafe',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#1e40af'
                }}>
                    💡 <strong>사용 방법:</strong><br/>
                    부품을 클릭하여 모델 선택 → 다음 화면에서 제품 확정<br/>
                    모든 부품이 확정되면 자동으로 최종 견적으로 이동합니다.
                </div>
            </div>
        </div>
    );
}


export default SidebarStack2;