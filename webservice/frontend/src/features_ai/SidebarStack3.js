import React, { useState, useEffect } from 'react';

function SidebarStack3({ onProductConfirm, onBack, isActive, currentCategory, currentModel }) {
    const [sortBy, setSortBy] = useState('recommended');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const brands = ['ASUS', 'MSI', 'ZOTAC', 'GIGABYTE', 'EVGA', 'PNY'];

    // 카테고리와 모델에 따른 제품 데이터 (실제로는 API에서 가져와야 함)
    const getProductsForModel = (category, model) => {
        // GPU RTX 4060 예시
        if (category === 'gpu' && model === 'RTX 4060') {
            return [
                {
                    id: 1,
                    name: 'ZOTAC RTX 4060 Twin Edge',
                    price: 420000,
                    brand: 'ZOTAC',
                    tags: ['쿨링좋음', '조용함', '전성비우수'],
                    aiScore: 95,
                    stock: '재고풍부',
                    shipping: '무료배송',
                    reviewCount: 342,
                    image: 'https://via.placeholder.com/150x100/2563eb/ffffff?text=RTX+4060',
                },
                {
                    id: 2,
                    name: 'ASUS DUAL RTX 4060 OC',
                    price: 445000,
                    brand: 'ASUS',
                    tags: ['감성RGB', '쿨링강화', '고급형'],
                    aiScore: 92,
                    stock: '재고적음',
                    shipping: '무료배송',
                    reviewCount: 218,
                    image: 'https://via.placeholder.com/150x100/dc2626/ffffff?text=ASUS',
                },
                {
                    id: 3,
                    name: 'MSI RTX 4060 VENTUS 2X',
                    price: 410000,
                    brand: 'MSI',
                    tags: ['가성비', '콤팩트', '저렴함'],
                    aiScore: 88,
                    stock: '재고풍부',
                    shipping: '무료배송',
                    reviewCount: 456,
                    image: 'https://via.placeholder.com/150x100/000000/ffffff?text=MSI',
                },
                {
                    id: 4,
                    name: 'GIGABYTE RTX 4060 EAGLE OC',
                    price: 430000,
                    brand: 'GIGABYTE',
                    tags: ['안정성', '쿨링우수', '중급형'],
                    aiScore: 90,
                    stock: '재고적음',
                    shipping: '유료배송',
                    reviewCount: 187,
                    image: 'https://via.placeholder.com/150x100/f97316/ffffff?text=GIGABYTE',
                },
            ];
        }

        // 다른 카테고리/모델에 대한 샘플 데이터
        return [
            {
                id: 1,
                name: `${model} - 제품 A`,
                price: 300000,
                brand: brands[0],
                tags: ['추천', '인기'],
                aiScore: 90,
                stock: '재고풍부',
                shipping: '무료배송',
                reviewCount: 120,
                image: 'https://via.placeholder.com/150x100/6366f1/ffffff?text=Product+A',
            },
            {
                id: 2,
                name: `${model} - 제품 B`,
                price: 320000,
                brand: brands[1],
                tags: ['가성비', '우수'],
                aiScore: 85,
                stock: '재고적음',
                shipping: '무료배송',
                reviewCount: 89,
                image: 'https://via.placeholder.com/150x100/8b5cf6/ffffff?text=Product+B',
            },
            {
                id: 3,
                name: `${model} - 제품 C`,
                price: 310000,
                brand: brands[2],
                tags: ['고급형', '안정성'],
                aiScore: 88,
                stock: '품절임박',
                shipping: '무료배송',
                reviewCount: 234,
                image: 'https://via.placeholder.com/150x100/ec4899/ffffff?text=Product+C',
            },
        ];
    };

    const products = currentModel ? getProductsForModel(currentCategory, currentModel) : [];

    const getSortedProducts = () => {
        let filtered = products;

        // Brand filter
        if (selectedBrand) {
            filtered = filtered.filter((p) => p.brand === selectedBrand);
        }

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        switch (sortBy) {
            case 'price':
                return [...filtered].sort((a, b) => a.price - b.price);
            case 'recommended':
            default:
                return [...filtered].sort((a, b) => b.aiScore - a.aiScore);
        }
    };

    const handleProductSelect = (product) => {
        // 바로 선택 처리 (confirm 대화상자 제거)
        onProductConfirm(currentCategory, currentModel, product);
    };

    const getCategoryDisplayName = (categoryId) => {
        const names = {
            cpu: 'CPU',
            gpu: 'GPU',
            ram: 'RAM',
            ssd: 'SSD',
            case: 'CASE',
            psu: 'PSU',
        };
        return names[categoryId] || categoryId.toUpperCase();
    };

    return (
        <div className={`sidebar-stack sidebar-stack-3 ${isActive ? 'slide-in' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-title">📌 세부 모델 선택</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.3rem' }}>
                    {getCategoryDisplayName(currentCategory)} &gt; {currentModel}
                </div>
            </div>

            <div className="sidebar-content">
                {/* Current Selection Info */}
                <div
                    style={{
                        padding: '1rem',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        border: '2px solid #f59e0b',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                    }}
                >
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#92400e', marginBottom: '0.3rem' }}>
                        🎯 현재 선택 중
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>
                        {getCategoryDisplayName(currentCategory)}: {currentModel}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#78716c', marginTop: '0.3rem' }}>
                        ⬇️ 아래에서 제품을 선택하면 이 부품이 확정됩니다.
                    </div>
                </div>

                {/* Search Bar */}
                <div className="form-group">
                    <label className="form-label">🔍 제품 검색</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="제품명 또는 브랜드로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            padding: '0.8rem',
                            fontSize: '0.95rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            transition: 'all 0.2s',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                        onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                </div>

                {/* Sort Dropdown */}
                <div className="form-group">
                    <label className="form-label">🔄 정렬 기준</label>
                    <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="recommended">추천순 (AI 맞춤 순위)</option>
                        <option value="price">최저가순</option>
                        <option value="reviews">리뷰 많은 순</option>
                        <option value="brand">브랜드순</option>
                    </select>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                        💡 추천순은 1스택 설정 기준을 반영한 AI 개인화 순위입니다.
                    </div>
                </div>

                {/* Brand Filter (Horizontal) */}
                <div className="form-group">
                    <label className="form-label">🏪 브랜드 필터</label>
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        <button
                            onClick={() => setSelectedBrand(null)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '6px',
                                background: !selectedBrand ? '#2563eb' : '#e2e8f0',
                                color: !selectedBrand ? 'white' : '#1e293b',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                            }}
                        >
                            전체
                        </button>
                        {brands.map((brand) => (
                            <button
                                key={brand}
                                onClick={() => setSelectedBrand(brand)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: selectedBrand === brand ? '#2563eb' : '#e2e8f0',
                                    color: selectedBrand === brand ? 'white' : '#1e293b',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {brand}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product List (Vertical) */}
                <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">📦 상품 리스트 ({getSortedProducts().length}개)</label>
                    {getSortedProducts().length === 0 && (
                        <div
                            style={{
                                padding: '2rem',
                                textAlign: 'center',
                                color: '#64748b',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                border: '2px dashed #cbd5e1',
                            }}
                        >
                            🔍 검색 결과가 없습니다.
                            <br />
                            <span style={{ fontSize: '0.85rem' }}>다른 검색어나 필터를 시도해보세요.</span>
                        </div>
                    )}
                    {getSortedProducts().map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            style={{
                                padding: '1.2rem',
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#2563eb';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.2)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e2e8f0';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Product Image */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '120px',
                                    background: `url(${product.image}) center/cover`,
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    border: '1px solid #e2e8f0',
                                }}
                            ></div>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '0.8rem',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            marginBottom: '0.4rem',
                                            color: '#1e293b',
                                        }}
                                    >
                                        {product.name}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                        🏪 {product.brand}
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            fontSize: '0.75rem',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: '0.2rem 0.5rem',
                                                background:
                                                    product.stock === '재고풍부'
                                                        ? '#d1fae5'
                                                        : product.stock === '품절임박'
                                                        ? '#fee2e2'
                                                        : '#fef3c7',
                                                color:
                                                    product.stock === '재고풍부'
                                                        ? '#065f46'
                                                        : product.stock === '품절임박'
                                                        ? '#991b1b'
                                                        : '#92400e',
                                                borderRadius: '4px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {product.stock}
                                        </span>
                                        <span
                                            style={{
                                                padding: '0.2rem 0.5rem',
                                                background: product.shipping === '무료배송' ? '#dbeafe' : '#f1f5f9',
                                                color: product.shipping === '무료배송' ? '#1e40af' : '#475569',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            🚚 {product.shipping}
                                        </span>
                                        <span
                                            style={{
                                                padding: '0.2rem 0.5rem',
                                                background: '#fef3c7',
                                                color: '#92400e',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            ⭐ 리뷰 {product.reviewCount}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div
                                        style={{
                                            fontSize: '1.3rem',
                                            fontWeight: '800',
                                            color: '#2563eb',
                                            marginBottom: '0.3rem',
                                        }}
                                    >
                                        ₩{product.price.toLocaleString()}
                                    </div>
                                    {sortBy === 'recommended' && (
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: '#10b981',
                                                    fontWeight: '700',
                                                    marginBottom: '0.2rem',
                                                }}
                                            >
                                                🤖 AI 매칭 {product.aiScore}%
                                            </div>
                                            <div
                                                style={{
                                                    width: '60px',
                                                    height: '6px',
                                                    background: '#e2e8f0',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: `${product.aiScore}%`,
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, #10b981, #34d399)',
                                                        borderRadius: '3px',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.5rem',
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        💬 #{tag}
                                    </span>
                                ))}
                            </div>
                            <div
                                style={{
                                    marginTop: '0.8rem',
                                    padding: '0.6rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                                }}
                            >
                                ✅ 클릭하여 선택 →
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button className="btn-secondary" onClick={onBack} style={{ width: '100%' }}>
                    ← 모델 선택으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default SidebarStack3;
