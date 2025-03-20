// resources/js/Pages/Content/components/SearchWithCustomFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import './SearchWithCustomFilter.css';
import { Modal, Button } from 'react-bootstrap';
import CityFilterInput from '@/Components/CityFilterInput';

const CATEGORIES = [
    { id: 1, name: 'All Listing', icon: 'fa-border-all' },
    { id: 2, name: 'Rooms', icon: 'fa-bed-front' },
    { id: 3, name: 'Roommates', icon: 'fa-user-group-simple' },
    { id: 4, name: 'PG', icon: 'fa-building' },
];

const GENDER_OPTIONS = [
    { id: 1, name: 'All', value: 'All' },
    { id: 2, name: 'Men', value: 'male' },
    { id: 3, name: 'Women', value: 'female' },
];

const SORT_OPTIONS = [
    { id: 1, name: 'Recents', value: 'recents' },
    { id: 2, name: 'Revelant', value: 'relevant' },
];

const MARGIN_BELOW_BUTTON = 8;

function SearchWithCustomFilter({ searchTerm: initialSearchTerm, filterCategory: initialFilterCategory, filterGender: initialFilterGender, filterCities: initialFilterCities, filterMinPrice: initialFilterMinPrice, filterMaxPrice: initialFilterMaxPrice, selectedSort: initialSelectedSort }) { // Recibe selectedSort
    const [activeCategory, setActiveCategory] = useState(initialFilterCategory || 'All Listing');
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    const { props } = usePage();

    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [genderDropdownPosition, setGenderDropdownPosition] = useState({ top: 0, left: 0 });
    const [sortDropdownPosition, setSortDropdownPosition] = useState({ top: 0, left: 0 });

    const genderTriggerRef = useRef(null);
    const sortTriggerRef = useRef(null);
    const genderDropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    const minInputRef = useRef(null);
    const maxInputRef = useRef(null);

    const [selectedGender, setSelectedGender] = useState(initialFilterGender || 'All');
    const [selectedCities, setSelectedCities] = useState(initialFilterCities || []);
    const [selectedSort, setSelectedSort] = useState(initialSelectedSort || 'recents'); // Inicializar con el valor de las props
    const [priceRange, setPriceRange] = useState({ min: initialFilterMinPrice || 0, max: initialFilterMaxPrice || 0 });
    const [showModal, setShowModal] = useState(false);

    const [tempSelectedCities, setTempSelectedCities] = useState(initialFilterCities || []);
    const [tempPriceRange, setTempPriceRange] = useState({ min: initialFilterMinPrice || 0, max: initialFilterMaxPrice || 0 });
    const [tempSelectedGender, setTempSelectedGender] = useState(initialFilterGender || 'All');
    const [tempActiveCategory, setTempActiveCategory] = useState(initialFilterCategory || 'All Listing');


    const handleShowModal = () => {
        setTempSelectedCities(selectedCities);
        setTempPriceRange(priceRange);
        setTempSelectedGender(selectedGender);
        setTempActiveCategory(activeCategory);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleFilterChange = (category, gender, cities, priceRange) => {
        const params = {
            filterCategory: category,
            filterGender: gender,
            cities: cities.map(city => city.value),
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            selectedSort: selectedSort, // Enviar selectedSort en la petición
        };
        console.log("SearchWithCustomFilter:handleFilterChange - Params:", params);

        router.get(route('content.index'), params, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => handleCloseModal(),
        });
    };

    useEffect(() => {
        setActiveCategory(initialFilterCategory || 'All Listing');
        setSelectedGender(initialFilterGender || 'All');
        setSelectedCities(initialFilterCities || []);
        setPriceRange({ min: initialFilterMinPrice || 0, max: initialFilterMaxPrice || 0 });
        setTempSelectedCities(initialFilterCities || []);
        setTempPriceRange({ min: initialFilterMinPrice || 0, max: initialFilterMaxPrice || 0 });
        setTempSelectedGender(initialFilterGender || 'All');
        setTempActiveCategory(initialFilterCategory || 'All Listing');
        setSelectedSort(initialSelectedSort || 'recents'); // Asegurar que selectedSort se actualiza
    }, [initialFilterCategory, initialFilterGender, initialFilterCities, initialFilterMinPrice, initialFilterMaxPrice, initialSelectedSort, props]);

    const calculateDropdownPosition = (triggerRef, dropdownRef, setPosition) => {
        if (triggerRef.current && dropdownRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - triggerRect.bottom;
            const dropdownHeight = dropdownRect.height;
            const position = spaceBelow >= dropdownHeight + MARGIN_BELOW_BUTTON ? 'below' : 'above';
            let top, left;

            if (position === 'below') {
                top = triggerRect.bottom + MARGIN_BELOW_BUTTON;
            } else {
                top = triggerRect.top - dropdownHeight - MARGIN_BELOW_BUTTON;
            }

            left = triggerRect.left + (triggerRect.width / 2) - (dropdownRect.width / 2);
            left = Math.max(10, Math.min(left, window.innerWidth - dropdownRect.width - 20));
            setPosition({ top, left });
        }
    };

    const toggleGenderDropdown = () => {
        setIsGenderOpen(!isGenderOpen);
        if (!isGenderOpen) {
            setIsSortOpen(false);
        }
    };

    const toggleSortDropdown = () => {
        setIsSortOpen(!isSortOpen);
        if (!isSortOpen) {
            setIsGenderOpen(false);
        }
    };

      useEffect(() => {
        if (isGenderOpen) {
            calculateDropdownPosition(genderTriggerRef, genderDropdownRef, setGenderDropdownPosition);
        }
    }, [isGenderOpen]);

    useEffect(() => {
        if (isSortOpen) {
            calculateDropdownPosition(sortTriggerRef, sortDropdownRef, setSortDropdownPosition);
        }
    }, [isSortOpen]);


    useEffect(() => {
        const handleResizeAndScroll = () => {
            if (isGenderOpen) {
                calculateDropdownPosition(genderTriggerRef, genderDropdownRef, setGenderDropdownPosition);
            }
            if (isSortOpen) {
                calculateDropdownPosition(sortTriggerRef, sortDropdownRef, setSortDropdownPosition);
            }
        };

        if (isGenderOpen || isSortOpen) {
            window.addEventListener('resize', handleResizeAndScroll);
            window.addEventListener('scroll', handleResizeAndScroll);
        }

        return () => {
            window.removeEventListener('resize', handleResizeAndScroll);
            window.removeEventListener('scroll', handleResizeAndScroll);
        };
    }, [isGenderOpen, isSortOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target) && !genderTriggerRef.current.contains(event.target)) {
                setIsGenderOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target) && !sortTriggerRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleGenderOptionClick = (value) => {
        setSelectedGender(value);
        setTempSelectedGender(value);
        setIsGenderOpen(false);
        router.get(route('content.index'), {
            filterCategory: activeCategory,
            filterGender: value,
            cities: selectedCities.map(city => city.value),
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            selectedSort: selectedSort, // Enviar selectedSort
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSortOptionClick = (value) => {
        setSelectedSort(value);
        setIsSortOpen(false);
         router.get(route('content.index'), {
            filterCategory: activeCategory,  // Mantener los otros filtros
            filterGender: selectedGender,
            cities: selectedCities.map(city => city.value),
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            selectedSort: value, // Enviar la nueva opción de ordenamiento
        }, { preserveState: true, preserveScroll: true });
    };

    const handleCityChange = (selectedOptions) => setTempSelectedCities(selectedOptions);
    const handlePriceChange = (newPriceRange) => setTempPriceRange(newPriceRange);

    const handleCategoryClick = (categoryName) => {
        setActiveCategory(categoryName);
        setTempActiveCategory(categoryName);
        router.get(route('content.index'), {
            filterCategory: categoryName,
            filterGender: selectedGender,
            cities: selectedCities.map(city => city.value),
            minPrice: priceRange.min,
            maxPrice: priceRange.max,
            selectedSort: selectedSort, // Enviar selectedSort

        }, { preserveState: true, preserveScroll: true });
    };

    const calculateInputWidth = (inputElement, value) => {
        if (!inputElement) return;

        const tempSpan = document.createElement('span');
        Object.assign(tempSpan.style, {
            visibility: 'hidden',
            position: 'absolute',
            whiteSpace: 'pre',
            fontSize: window.getComputedStyle(inputElement).fontSize,
            fontFamily: window.getComputedStyle(inputElement).fontFamily,
        });

        tempSpan.textContent = `${value}₹`;
        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.offsetWidth;
        inputElement.style.width = `${textWidth + 20}px`;
        document.body.removeChild(tempSpan);
    };

    useEffect(() => {
        if (showModal) {
            calculateInputWidth(minInputRef.current, tempPriceRange.min);
            calculateInputWidth(maxInputRef.current, tempPriceRange.max);
        }
    }, [tempPriceRange.min, tempPriceRange.max, showModal]);

    const handleModalApply = () => {
        setSelectedCities(tempSelectedCities);
        setPriceRange(tempPriceRange);
        setSelectedGender(tempSelectedGender);
        setActiveCategory(tempActiveCategory);
        handleFilterChange(tempActiveCategory, tempSelectedGender, tempSelectedCities, tempPriceRange);
    };

    const handleModalCancel = () => {
        setTempSelectedCities(selectedCities);
        setTempPriceRange(priceRange);
        setTempSelectedGender(selectedGender);
        setTempActiveCategory(activeCategory);
        handleCloseModal();
    };

    return (
        <div className="search-custom-filter">
            <div className="filter-categories">
                {CATEGORIES.map((category) => (
                    <div
                        key={category.id}
                        className={`filter-category-item ${activeCategory === category.name ? 'filter-active' : ''}`}
                        onClick={() => handleCategoryClick(category.name)}
                    >
                        <i className={`filter-icon fa-regular ${category.icon}`}></i>
                        <p className="filter-category-name">{category.name}</p>
                    </div>
                ))}
            </div>

            <div className="filter-dropdown-container">

                <div className="filter-gender-trigger" onClick={toggleSortDropdown} ref={sortTriggerRef}>
                    <p className="filter-gender-text">
                        {selectedSort === 'recents' ? 'Recents' : 'Revelant'}
                    </p>
                </div>

                <div className="filter-gender-trigger" onClick={toggleGenderDropdown} ref={genderTriggerRef}>
                    <p className="filter-gender-text">
                        {selectedGender === 'All' ? 'Gender' : (selectedGender === 'male' ? 'Men' : 'Women')}
                    </p>
                </div>


                <Button variant="primary" onClick={handleShowModal} style={{ marginLeft: '10px' }}>
                    <i className="fa-regular fa-filter"></i>
                </Button>


                {isSortOpen && (
                    <div
                        ref={sortDropdownRef}
                        className="filter-gender-dropdown"
                        style={{
                            top: sortDropdownPosition.top,
                            left: sortDropdownPosition.left,
                        }}
                    >
                        <div className="filter-gender-options">
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    className="filter-gender-option"
                                    onClick={() => handleSortOptionClick(option.value)}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isGenderOpen && (
                    <div
                        ref={genderDropdownRef}
                        className="filter-gender-dropdown"
                        style={{
                            top: genderDropdownPosition.top,
                            left: genderDropdownPosition.left,
                        }}
                    >
                        <div className="filter-gender-options">
                            {GENDER_OPTIONS.map((option) => (
                                <button
                                    key={option.id}
                                    className="filter-gender-option"
                                    onClick={() => handleGenderOptionClick(option.value)}
                                >
                                    {option.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="filter-modal-section">
                        <label>Select Cities:</label>
                        <CityFilterInput
                            value={tempSelectedCities}
                            onChange={handleCityChange}
                            placeholder="Select Cities"
                        />
                    </div>

                    <div className="filter-modal-section">
                        <label>Price Range:</label>
                        <div className="filter-price-container">
                            <div className="input-wrapper">
                                <span>₹</span>
                                <input
                                    type="number"
                                    id="minPrice"
                                    className="filter-price-input"
                                    value={tempPriceRange.min}
                                    onChange={(e) => handlePriceChange({ ...tempPriceRange, min: parseInt(e.target.value) || 0 })}
                                    aria-label="Minimum price in Indian Rupees"
                                    ref={minInputRef}
                                />
                            </div>
                            <div className="separator">-</div>
                            <div className="input-wrapper">
                                <span>₹</span>
                                <input
                                    type="number"
                                    id="maxPrice"
                                    className="filter-price-input"
                                    value={tempPriceRange.max}
                                    onChange={(e) => handlePriceChange({ ...tempPriceRange, max: parseInt(e.target.value) || 0 })}
                                    aria-label="Maximum price in Indian Rupees"
                                    ref={maxInputRef}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleModalApply}>
                        Apply Filters
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SearchWithCustomFilter;