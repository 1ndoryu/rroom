// /Components/LocationInputField.jsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from '@/Components/InputField';
import { Label } from "@/components/ui/label";
import { cities } from '@/data/cities';

function LocationInputField({ data, setData, name, label, placeholder, isLocationSpecific, allowMultipleCities = false, ...props }) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);
    const MAX_SUGGESTIONS = 6;
    const DEBOUNCE_DELAY = 300;
    let debounceTimeout;

    useEffect(() => {
        if (isLocationSpecific && getSearchQuery(inputValue)) {
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [isLocationSpecific, inputValue]);

    useEffect(() => {
        if (!allowMultipleCities) {
            if (data[name]) {
                setInputValue(data[name]);
            } else {
                setInputValue('');
            }
        } else {
            if (data[name] && Array.isArray(data[name])) {
                setInputValue(data[name].join(', ') + ', ');
            } else {
                setInputValue('');
            }
        }
    }, [data[name], name, allowMultipleCities]);


    const fetchSuggestions = async (query) => {
        if (!query) {
            clearTimeout(debounceTimeout);
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const filteredCities = cities.filter(city =>
                city.toLowerCase().includes(query.toLowerCase()) && !getSelectedCitiesArray(inputValue).includes(city)
            ).slice(0, MAX_SUGGESTIONS);

            console.log("LocationInputField: fetchSuggestions: Buscando sugerencias para:", query);
            setSuggestions(filteredCities);
            console.log("LocationInputField: fetchSuggestions: Sugerencias encontradas:", filteredCities);
            setShowSuggestions(true);

        } catch (error) {
            console.error("LocationInputField: fetchSuggestions: Error buscando sugerencias", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (allowMultipleCities) {
            const currentInputValue = inputValue;
            const searchQuery = getSearchQuery(currentInputValue);

            let updatedInputValue = '';
            if (searchQuery) {
                // Reemplazar solo la parte de la búsqueda con la sugerencia y añadir ", "
                const index = currentInputValue.lastIndexOf(searchQuery);
                updatedInputValue = currentInputValue.substring(0, index) + suggestion + ', ';
            } else if (currentInputValue.trim() === '') {
                // Si el input estaba vacío, simplemente empezar con la sugerencia y ", "
                updatedInputValue = suggestion + ', ';
            } else {
                // Caso donde hay texto pero no era parte de una busqueda previa (raro, pero por si acaso)
                updatedInputValue = currentInputValue + suggestion + ', '; // O decide como quieres manejar este caso
            }


            setInputValue(updatedInputValue);
            setData(name, getSelectedCitiesArray(updatedInputValue));
        } else {
            setData(name, suggestion);
            setInputValue(suggestion);
        }
        setSuggestions([]);
        setShowSuggestions(false);
        console.log("LocationInputField: handleSuggestionClick: Sugerencia seleccionada:", suggestion);
    };


    const handleInputChange = (e) => {
        const newInputValue = e.target.value;
        setInputValue(newInputValue);

        if (!allowMultipleCities) {
            setData(name, newInputValue);
        }

        const searchQuery = getSearchQuery(newInputValue);

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            console.log("LocationInputField: handleInputChange: Ejecutando busqueda despues del debounce");
            fetchSuggestions(searchQuery);
        }, DEBOUNCE_DELAY);
    };


    const getSelectedCitiesArray = (currentInputValue) => {
        return currentInputValue.split(',').map(city => city.trim()).filter(city => city !== '');
    };

    const getSearchQuery = (currentInputValue) => {
        if (!allowMultipleCities) return currentInputValue;
        const citiesArray = currentInputValue.split(',').map(city => city.trim());
        const lastPart = citiesArray.pop() || '';
        return lastPart.trim();
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
                console.log("LocationInputField: handleClickOutside: Ocultando sugerencias (click fuera)");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(debounceTimeout);
        };
    }, [suggestionsRef, inputRef]);


    return (
        <div>
            <InputField
                ref={inputRef}
                data={allowMultipleCities ? { [name]: inputValue } : data}
                setData={allowMultipleCities ? setInputValue : setData}
                name={allowMultipleCities ? 'tempInput' : name}
                label={label}
                placeholder={placeholder}
                onChange={handleInputChange}
                value={inputValue}
                {...props}
            />
            {isLocationSpecific && (
                <div className="relative" ref={suggestionsRef}>
                    {loading && <div>Cargando...</div>}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default LocationInputField;