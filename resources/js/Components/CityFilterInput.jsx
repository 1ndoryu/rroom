// /Components/CityFilterInput.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { cities } from '@/data/cities';

const CityFilterInput = ({ value, onChange, placeholder }) => {
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        const options = cities.map(city => ({ value: city.toLowerCase(), label: city }));
        setCityOptions(options);
    }, []);

    // NEW: useEffect to handle external value changes (from props)
    useEffect(() => {
        // Ensure the value prop is an array of objects with 'value' and 'label'
        if (value && Array.isArray(value)) {
           const validValue = value.map(v => {
                if(typeof v === 'string') {
                    return { value: v.toLowerCase(), label: v };
                } else if (typeof v === 'object' && v !== null && v.value && v.label) {
                     return v;
                }
                return null; // Or some default object if needed
           }).filter(item => item !== null); // Remove null values

            onChange(validValue);
        }
    }, [value]);

    return (
        <Select
            isMulti
            options={cityOptions}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="filter-city-select" 
            classNamePrefix="select"      
        />
    );
};

export default CityFilterInput;