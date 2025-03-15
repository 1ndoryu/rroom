// /Components/LocationInputField.jsx
import React, { useState, useEffect, useRef } from 'react';
import InputField from '@/Components/InputField';
import { Label } from "@/components/ui/label";
import { cities } from '@/data/cities';

function LocationInputField({ data, setData, name, label, placeholder, isLocationSpecific, ...props }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);
    const MAX_SUGGESTIONS = 6;
    const DEBOUNCE_DELAY = 300; // Tiempo de espera en milisegundos (ajusta según necesites)
    let debounceTimeout; // Variable para almacenar el timeout del debounce

    useEffect(() => {
        if (isLocationSpecific && data[name]) {
          //  fetchSuggestions(data[name]); //quitar esto para que se ejecute despues del delay
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [isLocationSpecific, data[name]]);

    const fetchSuggestions = async (query) => {
        if (!query) {
            clearTimeout(debounceTimeout); // Limpia cualquier timeout anterior
            setSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const filteredCities = cities.filter(city =>
                city.toLowerCase().includes(query.toLowerCase())
            ).slice(0, MAX_SUGGESTIONS);

            console.log("LocationInputField: fetchSuggestions: Buscando sugerencias para:", query);
            setSuggestions(filteredCities);
            console.log("LocationInputField: fetchSuggestions: Sugerencias encontradas:", filteredCities);
            setShowSuggestions(true);

        } catch (error) {
            console.error("LocationInputField: fetchSuggestions: Error fetching suggestions", error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setData(name, suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        console.log("LocationInputField: handleSuggestionClick: Sugerencia seleccionada:", suggestion);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setData(name, inputValue);
        clearTimeout(debounceTimeout); // Limpia cualquier timeout anterior

         debounceTimeout = setTimeout(() => {
            console.log("LocationInputField: handleInputChange: Ejecutando búsqueda después del debounce");
            fetchSuggestions(inputValue);
        }, DEBOUNCE_DELAY);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSuggestions(false);
                console.log("LocationInputField: handleClickOutside: Ocultando sugerencias (clic fuera)");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
             clearTimeout(debounceTimeout); // Importante limpiar el timeout al desmontar
        };
    }, [suggestionsRef, inputRef]);

    return (
        <div>
            <InputField
                ref={inputRef}
                data={data}
                setData={setData}
                name={name}
                label={label}
                placeholder={placeholder}
                onChange={handleInputChange}
                {...props}
            />
            {isLocationSpecific && (
                <div className="relative" ref={suggestionsRef}>
                    {loading && <div>Loading...</div>}
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