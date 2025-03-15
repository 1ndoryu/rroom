// /Components/CityFilterInput.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { cities } from '@/data/cities'; // Asegúrate de que esta ruta sea correcta

const CityFilterInput = ({ value, onChange, placeholder }) => {
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        // Prepara las opciones para react-select.  Formato: { value: 'ciudad', label: 'Ciudad' }
        const options = cities.map(city => ({ value: city.toLowerCase(), label: city }));
        setCityOptions(options);
    }, []);

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