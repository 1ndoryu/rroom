// resources/js/Pages/Content/components/GenderFilterTest.jsx
import { useState } from 'react';
import { usePage } from '@inertiajs/react';

const DROPDOWN_CATEGORIES = [
    { id: 1, name: 'All', value: 'All' },
    { id: 2, name: 'Men', value: 'male' },
    { id: 3, name: 'Women', value: 'female' },
];

export default function GenderFilterTest() {
    const { props } = usePage();
    const currentGender = props.filterGender || 'All';  // Obtener de props

    const [selectedGender, setSelectedGender] = useState(currentGender);

    const handleChange = (genderValue) => {
        setSelectedGender(genderValue); // Actualizar estado local (opcional, para feedback visual)

        // Construir la URL manualmente
        const url = new URL(window.location.href);
        url.searchParams.set('filterGender', genderValue);

        // Forzar recarga completa de la página
        window.location.href = url.toString();
    };

    return (
        <div>
            <label htmlFor="gender-select">Gender:</label>
            <select
                id="gender-select"
                value={selectedGender}
                onChange={(e) => handleChange(e.target.value)}
            >
                {DROPDOWN_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.value}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}