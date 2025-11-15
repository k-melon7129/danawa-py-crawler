import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';
import ComparisonModal from './ComparisonModal'; // ComparisonModal import
import PartDetailModal from './PartDetailModal'; // 👈 1. 이 줄을 추가
import { Routes, Route, Link } from 'react-router-dom'; //페이지 새로 추가
import AiBuildApp from './features_ai/AiBuildApp';

const CATEGORIES = ['CPU', '쿨러', '메인보드', 'RAM', '그래픽카드', 'SSD', 'HDD', '파워', '케이스'];
const ITEMS_PER_PAGE = 21;

// 백엔드 API 기본 URL 설정 (Docker 환경에서는 backend:8080, 로컬에서는 localhost:8080)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// (FILTER_LABELS, FILTER_ORDER_MAP, generateSpecString 함수는 기존과 동일)
const FILTER_LABELS = {
    manufacturer: '제조사',
    codename: '코드네임',
    cpu_series: 'CPU 시리즈',
    cpu_class: 'CPU 종류',
    socket: '소켓 구분',
    cores: '코어 수',
    threads: '스레드 수',
    integrated_graphics: '내장그래픽 탑재 여부',
    // --- 👇 [신규] 벤치마크 라벨 추가 ---
    bench_cinebench_r23_multi: 'Cinebench R23 (Multi)',
    bench_cinebench_r23_single: 'Cinebench R23 (Single)',
    bench_geekbench_6_multi: 'Geekbench 6 (Multi)',
    bench_geekbench_6_single: 'Geekbench 6 (Single)',
    bench_blender_median: 'Blender (Median)',
    bench_3dmark_timespy_cpu: '3DMark Time Spy (CPU)',
    product_type: '제품 분류',
    cooling_method: '냉각 방식',
    air_cooling_form: '공랭 형태',
    cooler_height: '쿨러 높이',
    radiator_length: '라디에이터',
    fan_size: '팬 크기',
    fan_connector: '팬 커넥터',
    device_type: '사용 장치',
    product_class: '제품 분류',
    capacity: '메모리 용량',
    ram_count: '램 개수',
    clock_speed: '동작 클럭(대역폭)',
    ram_timing: '램 타이밍',
    heatsink_presence: '히트싱크',
    chipset: '세부 칩셋',
    form_factor: '폼팩터',
    memory_spec: '메모리 종류',
    memory_slots: '메모리 슬롯',
    vga_connection: 'VGA 연결',
    m2_slots: 'M.2',
    wireless_lan: '무선랜 종류',
    nvidia_chipset: 'NVIDIA 칩셋',
    amd_chipset: 'AMD 칩셋',
    intel_chipset: '인텔 칩셋',
    gpu_interface: '인터페이스',
    gpu_memory_capacity: '메모리 용량',
    output_ports: '출력 단자',
    recommended_psu: '권장 파워용량',
    fan_count: '팬 개수',
    gpu_length: '가로(길이)',
    ssd_interface: '인터페이스',
    memory_type: '메모리 타입',
    ram_mounted: 'RAM 탑재',
    sequential_read: '순차읽기',
    sequential_write: '순차쓰기',
    hdd_series: '시리즈 구분',
    disk_capacity: '디스크 용량',
    rotation_speed: '회전수',
    buffer_capacity: '버퍼 용량',
    hdd_warranty: 'A/S 정보',
    case_size: '케이스 크기',
    supported_board: '지원보드 규격',
    side_panel: '측면 개폐 방식',
    psu_length: '파워 장착 길이',
    vga_length: 'VGA 길이',
    cpu_cooler_height_limit: 'CPU쿨러 높이',
    rated_output: '정격출력',
    eighty_plus_cert: '80PLUS인증',
    eta_cert: 'ETA인증',
    cable_connection: '케이블연결',
    pcie_16pin: 'PCIe 16핀(12+4)',
};

const FILTER_ORDER_MAP = {
    CPU: ['manufacturer', 'codename', 'cpu_series', 'cpu_class', 'socket', 'cores', 'threads', 'integrated_graphics'],
    쿨러: [
        'manufacturer',
        'product_type',
        'cooling_method',
        'air_cooling_form',
        'cooler_height',
        'radiator_length',
        'fan_size',
        'fan_connector',
    ],
    메인보드: [
        'manufacturer',
        'socket',
        'chipset',
        'form_factor',
        'memory_spec',
        'memory_slots',
        'vga_connection',
        'm2_slots',
        'wireless_lan',
    ],
    RAM: [
        'manufacturer',
        'device_type',
        'product_class',
        'capacity',
        'ram_count',
        'clock_speed',
        'ram_timing',
        'heatsink_presence',
    ],
    그래픽카드: [
        'manufacturer',
        'nvidia_chipset',
        'amd_chipset',
        'intel_chipset',
        'gpu_interface',
        'gpu_memory_capacity',
        'output_ports',
        'recommended_psu',
        'fan_count',
        'gpu_length',
    ],
    SSD: [
        'manufacturer',
        'form_factor',
        'ssd_interface',
        'capacity',
        'memory_type',
        'ram_mounted',
        'sequential_read',
        'sequential_write',
    ],
    HDD: ['manufacturer', 'hdd_series', 'disk_capacity', 'rotation_speed', 'buffer_capacity', 'hdd_warranty'],
    케이스: [
        'manufacturer',
        'product_type',
        'case_size',
        'supported_board',
        'side_panel',
        'psu_length',
        'vga_length',
        'cpu_cooler_height_limit',
    ],
    파워: [
        'manufacturer',
        'product_type',
        'rated_output',
        'eighty_plus_cert',
        'eta_cert',
        'cable_connection',
        'pcie_16pin',
    ],
};

// --- [수정됨] JSON specs 필드를 파싱하여 스펙 문자열을 생성하는 함수 ---
const generateSpecString = (part) => {
    let specs = [];
    let parsedSpecs = {}; // 1. 빈 스펙 객체 생성

    // 2. part.specs (JSON 문자열)가 존재하면 파싱하여 parsedSpecs 객체에 저장
    try {
        if (part.specs) {
            parsedSpecs = JSON.parse(part.specs);
        }
    } catch (e) {
        console.error('Failed to parse specs JSON:', e, part.specs);
    }

    // 3. part.cores 대신 parsedSpecs.cores (snake_case)에서 데이터를 찾도록 수정
    // (Python 크롤러가 snake_case로 저장했으므로 snake_case 키를 사용)
    switch (part.category) {
        case 'CPU':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.socket,
                parsedSpecs.cores,
                parsedSpecs.threads,
                parsedSpecs.cpu_series,
                parsedSpecs.codename,
            ];
            break;
        case '쿨러':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.cooling_method,
                parsedSpecs.air_cooling_form,
                parsedSpecs.fan_size,
                parsedSpecs.radiator_length,
            ];
            break;
        case '메인보드':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.socket,
                parsedSpecs.chipset,
                parsedSpecs.form_factor,
                parsedSpecs.memory_spec,
            ];
            break;
        case 'RAM':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.product_class,
                parsedSpecs.capacity,
                parsedSpecs.clock_speed,
                parsedSpecs.ram_timing,
            ];
            break;
        case '그래픽카드':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.nvidia_chipset || parsedSpecs.amd_chipset || parsedSpecs.intel_chipset,
                parsedSpecs.gpu_memory_capacity,
                parsedSpecs.gpu_length,
            ];
            break;
        case 'SSD':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.form_factor,
                parsedSpecs.ssd_interface,
                parsedSpecs.capacity,
                parsedSpecs.sequential_read,
            ];
            break;
        case 'HDD':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.disk_capacity,
                parsedSpecs.rotation_speed,
                parsedSpecs.buffer_capacity,
            ];
            break;
        case '케이스':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.case_size,
                parsedSpecs.supported_board,
                parsedSpecs.cpu_cooler_height_limit,
                parsedSpecs.vga_length,
            ];
            break;
        case '파워':
            specs = [
                parsedSpecs.manufacturer,
                parsedSpecs.rated_output,
                parsedSpecs.eighty_plus_cert,
                parsedSpecs.cable_connection,
            ];
            break;
        default:
            return '';
    }
    return specs.filter(Boolean).join(' / ');
};

function App() {
    const [parts, setParts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('CPU');
    const [availableFilters, setAvailableFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [history, setHistory] = useState([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortOption, setSortOption] = useState('reviewCount,desc');
    const [comparisonList, setComparisonList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);

    const [openFilter, setOpenFilter] = useState('manufacturer');

    const handleFilterToggle = (filterKey) => {
        setOpenFilter((prevOpenFilter) => (prevOpenFilter === filterKey ? null : filterKey));
    };

    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme('dark');
        }
    }, []);

    const handleAddToCompare = (e, partToAdd) => {
        e.preventDefault();
        e.stopPropagation();
        setComparisonList((prevList) => {
            if (prevList.find((p) => p.id === partToAdd.id)) {
                return prevList.filter((p) => p.id !== partToAdd.id);
            }
            if (prevList.length > 0 && prevList[0].category !== partToAdd.category) {
                alert('같은 카테고리의 상품만 비교할 수 있습니다.');
                return prevList;
            }
            if (prevList.length < 3) {
                return [...prevList, partToAdd];
            }
            alert('최대 3개의 상품만 비교할 수 있습니다.');
            return prevList;
        });
    };

    const handleRemoveFromCompare = (partId) => {
        setComparisonList((prevList) => prevList.filter((p) => p.id !== partId));
    };

    const handleOpenDetailModal = (part) => {
        setSelectedPart(part);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPart(null);
    };

    const fetchParts = useCallback(
        async (category, filters, keyword, page, sort) => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                params.append('category', category);
                params.append('page', page);
                params.append('size', ITEMS_PER_PAGE);
                params.append('sort', sort);

                for (const key in filters) {
                    if (filters[key] && filters[key].length > 0) {
                        filters[key].forEach((value) => params.append(key, value));
                    }
                }

                if (keyword) params.append('keyword', keyword);

                const response = await axios.get(`${API_BASE_URL}/api/parts?${params.toString()}`);

                setParts(response.data.content);
                setTotalPages(response.data.totalPages);

                if (keyword && !history.includes(keyword)) {
                    const newHistory = [keyword, ...history];
                    setHistory(newHistory.slice(0, 10));
                }
            } catch (error) {
                console.error('데이터를 불러오는 중 오류가 발생했습니다.', error);
                setParts([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        },
        [history]
    );

    useEffect(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        const loadCategoryData = async () => {
            setIsLoading(true);
            try {
                const filtersRes = await axios.get(`${API_BASE_URL}/api/filters?category=${selectedCategory}`);
                setAvailableFilters(filtersRes.data);
            } catch (error) {
                console.error('필터 목록을 불러오는 중 오류가 발생했습니다.', error);
                setAvailableFilters({});
            }

            setSelectedFilters({});
            setCurrentPage(0);
            setSearchTerm('');
        };

        loadCategoryData().then(() => {
            fetchParts(selectedCategory, {}, '', 0, sortOption);
        });
    }, [selectedCategory, sortOption, fetchParts]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...selectedFilters };
        const currentValues = newFilters[filterType] || [];

        if (currentValues.includes(value)) {
            newFilters[filterType] = currentValues.filter((item) => item !== value);
        } else {
            newFilters[filterType] = [...currentValues, value];
        }

        if (newFilters[filterType].length === 0) {
            delete newFilters[filterType];
        }

        setSelectedFilters(newFilters);
        setCurrentPage(0);
        fetchParts(selectedCategory, newFilters, searchTerm, 0, sortOption);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchParts(selectedCategory, selectedFilters, searchTerm, 0, sortOption);
    };

    const handleHistoryClick = (keyword) => {
        setSearchTerm(keyword);
        setCurrentPage(0);
        fetchParts(selectedCategory, selectedFilters, keyword, 0, sortOption);
    };

    const handleDeleteHistory = (e, itemToDelete) => {
        e.stopPropagation();
        setHistory(history.filter((item) => item !== itemToDelete));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchParts(selectedCategory, selectedFilters, searchTerm, pageNumber, sortOption);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) handlePageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) handlePageChange(currentPage + 1);
    };

    const handleSortChange = (sortValue) => {
        setSortOption(sortValue);
    };

    const handleRemoveFilter = (filterKey, valueToRemove) => {
        const newFilters = { ...selectedFilters };
        const newValues = newFilters[filterKey].filter((value) => value !== valueToRemove);
        if (newValues.length > 0) newFilters[filterKey] = newValues;
        else delete newFilters[filterKey];

        setSelectedFilters(newFilters);
        setCurrentPage(0);
        fetchParts(selectedCategory, newFilters, searchTerm, 0, sortOption);
    };

    const handleResetFilters = () => {
        setSelectedFilters({});
        setCurrentPage(0);
        fetchParts(selectedCategory, {}, searchTerm, 0, sortOption);
    };

    const renderSelectedFilters = () => {
        if (Object.keys(selectedFilters).length === 0) return null;
        return (
            <div className="selected-filters-container">
                {Object.entries(selectedFilters).flatMap(([key, values]) =>
                    values.map((value) => (
                        <div key={`${key}-${value}`} className="filter-tag">
                            <span>
                                {FILTER_LABELS[key]}: {value}
                            </span>
                            <button onClick={() => handleRemoveFilter(key, value)}>🅧</button>
                        </div>
                    ))
                )}
                <button className="reset-filters-btn" onClick={handleResetFilters}>
                    전체 초기화
                </button>
            </div>
        );
    };

    const SkeletonCard = () => (
        <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-info">
                <div className="skeleton-text long"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-text medium"></div>
            </div>
        </div>
    );

    const renderFilters = () => {
        const filterOrder = FILTER_ORDER_MAP[selectedCategory] || Object.keys(availableFilters);
        return filterOrder.map((filterKey) => {
            const values = availableFilters[filterKey];
            if (!values || values.length === 0) return null;
            const label = FILTER_LABELS[filterKey] || filterKey;
            const isOpen = openFilter === filterKey;

            if (['fanSize', 'capacity', 'gpuMemoryCapacity', 'diskCapacity'].includes(filterKey)) {
                values.sort((a, b) => {
                    const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
                    const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
                    return numB - numA;
                });
            } else {
                values.sort();
            }

            return (
                <div key={filterKey} className={`filter-group ${isOpen ? 'active' : ''}`}>
                    <strong className="filter-title" onClick={() => handleFilterToggle(filterKey)}>
                        {label}
                        <span className="toggle-icon">{isOpen ? '▲' : '▼'}</span>
                    </strong>
                    <div className="radio-group">
                        {values.map((value) => (
                            <label key={value} className="radio-label">
                                <input
                                    type="checkbox"
                                    checked={(selectedFilters[filterKey] || []).includes(value)}
                                    onChange={() => handleFilterChange(filterKey, value)}
                                />
                                <span className="radio-text">{value}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={`app-wrapper ${theme}`}>
            <Routes>
                {/* ✅ 기존 다나와 비교 페이지를 메인(/)으로 지정 */}
                <Route
                    path="/"
                    element={
                        <div className="app-container">
                            <header>
                                <h1>💻 다 나올까? 💻</h1>
                                <nav className="top-nav">
                                    <Link to="/">가격 비교</Link>
                                    <Link to="/ai">AI 견적 추천</Link>
                                </nav>
                                <button className="theme-toggle-btn" onClick={toggleTheme}>
                                    {theme === 'light' ? '🌙' : '☀️'}
                                </button>
                            </header>

                            <nav className="category-nav">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </nav>

                            <div className="main-content">
                                <aside className="filters-sidebar">
                                    <div className="controls-container">
                                        <h2 className="controls-title">상세 검색</h2>
                                        <div className="controls-container-grid">
                                            <div className="search-sort-wrapper">
                                                <form className="search-container" onSubmit={handleSearch}>
                                                    <strong className="filter-title">상품명 검색</strong>
                                                    <div className="search-bar">
                                                        <input
                                                            type="text"
                                                            placeholder={`${selectedCategory} 내에서 검색...`}
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            onFocus={() => setIsHistoryVisible(true)}
                                                            onBlur={() =>
                                                                setTimeout(() => setIsHistoryVisible(false), 200)
                                                            }
                                                        />
                                                        <button type="submit">검색</button>
                                                    </div>
                                                    {isHistoryVisible && history.length > 0 && (
                                                        <div className="history-container">
                                                            <ul className="history-list">
                                                                {history.map((item, index) => (
                                                                    <li
                                                                        key={index}
                                                                        className="history-item"
                                                                        onMouseDown={() => handleHistoryClick(item)}
                                                                    >
                                                                        <span className="history-term">{item}</span>
                                                                        <button
                                                                            className="delete-btn"
                                                                            onMouseDown={(e) =>
                                                                                handleDeleteHistory(e, item)
                                                                            }
                                                                        >
                                                                            X
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </form>
                                                <div className="sort-container">
                                                    <strong className="filter-title">정렬</strong>
                                                    <select
                                                        className="filter-select"
                                                        value={sortOption}
                                                        onChange={(e) => handleSortChange(e.target.value)}
                                                    >
                                                        <option value="reviewCount,desc">인기상품순</option>
                                                        <option value="createdAt,desc">신상품순</option>
                                                        <option value="price,asc">낮은가격순</option>
                                                        <option value="price,desc">높은가격순</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {renderFilters()}
                                        </div>
                                    </div>
                                </aside>

                                <main className="products-area">
                                    {renderSelectedFilters()}
                                    {isLoading ? (
                                        <div className="parts-list">
                                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                                                <SkeletonCard key={index} />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="parts-list">
                                                {parts.length > 0 ? (
                                                    parts.map((part) => {
                                                        const specString = generateSpecString(part);
                                                        return (
                                                            <div
                                                                key={part.id}
                                                                className="card-link"
                                                                onClick={() => handleOpenDetailModal(part)}
                                                            >
                                                                <div className="part-card">
                                                                    <img
                                                                        src={
                                                                            part.imgSrc ||
                                                                            'https://img.danawa.com/new/noData/img/noImg_160.gif'
                                                                        }
                                                                        alt={part.name}
                                                                        className="part-image"
                                                                    />
                                                                    <div className="part-info">
                                                                        <h2 className="part-name">{part.name}</h2>
                                                                        {specString && (
                                                                            <p className="part-specs">{specString}</p>
                                                                        )}
                                                                        <p className="part-price">
                                                                            {part.price.toLocaleString()}원
                                                                        </p>
                                                                        <div className="part-reviews">
                                                                            <span>
                                                                                의견{' '}
                                                                                {part.reviewCount?.toLocaleString() ||
                                                                                    0}
                                                                            </span>
                                                                            <span className="review-divider">|</span>
                                                                            <span>
                                                                                ⭐ {part.starRating || 'N/A'} (
                                                                                {part.ratingReviewCount?.toLocaleString() ||
                                                                                    0}
                                                                                )
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="part-card-footer">
                                                                        <button
                                                                            onClick={(e) => handleAddToCompare(e, part)}
                                                                            disabled={
                                                                                comparisonList.length >= 3 &&
                                                                                !comparisonList.find(
                                                                                    (p) => p.id === part.id
                                                                                )
                                                                            }
                                                                            className={
                                                                                comparisonList.find(
                                                                                    (p) => p.id === part.id
                                                                                )
                                                                                    ? 'btn-compare active'
                                                                                    : 'btn-compare'
                                                                            }
                                                                        >
                                                                            {comparisonList.find(
                                                                                (p) => p.id === part.id
                                                                            )
                                                                                ? '✔ 비교 중'
                                                                                : '✚ 비교 담기'}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="no-results">검색 결과가 없습니다.</div>
                                                )}
                                            </div>

                                            <div className="pagination-container">
                                                <button
                                                    onClick={handlePrevPage}
                                                    disabled={currentPage === 0}
                                                    className="page-btn arrow-btn"
                                                >
                                                    &lt;
                                                </button>
                                                {totalPages > 1 &&
                                                    Array.from({ length: totalPages }, (_, i) => i).map(
                                                        (pageNumber) => (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => handlePageChange(pageNumber)}
                                                                className={`page-btn ${
                                                                    currentPage === pageNumber ? 'active' : ''
                                                                }`}
                                                            >
                                                                {pageNumber + 1}
                                                            </button>
                                                        )
                                                    )}
                                                <button
                                                    onClick={handleNextPage}
                                                    disabled={currentPage === totalPages - 1}
                                                    className="page-btn arrow-btn"
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </main>
                            </div>

                            {comparisonList.length > 0 && (
                                <div className="comparison-tray">
                                    <div className="comparison-tray-items">
                                        {comparisonList.map((part) => (
                                            <div key={part.id} className="comparison-item">
                                                <span>{part.name.substring(0, 15)}...</span>
                                                <button onClick={() => handleRemoveFromCompare(part.id)}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="btn-show-compare"
                                        onClick={() => setIsModalOpen(true)}
                                        disabled={comparisonList.length < 2}
                                    >
                                        비교하기 ({comparisonList.length}/3)
                                    </button>
                                </div>
                            )}

                            {isModalOpen && (
                                <ComparisonModal
                                    products={comparisonList}
                                    onClose={() => setIsModalOpen(false)}
                                    filterLabels={FILTER_LABELS}
                                    filterOrderMap={FILTER_ORDER_MAP}
                                />
                            )}

                            {isDetailModalOpen && selectedPart && (
                                <PartDetailModal
                                    part={selectedPart}
                                    onClose={handleCloseDetailModal}
                                    filterLabels={FILTER_LABELS}
                                />
                            )}
                        </div>
                    }
                />

                {/* ✅ AI 견적 추천 페이지를 /ai 경로로 이동 */}
                <Route path="/ai" element={<AiBuildApp />} />
            </Routes>
        </div>
    );
}

export default App;
