// Components/PropertyTypeSelector.jsx
import { Label } from "@/Components/ui/label";
const propertyTypes = [
    { type: 'apartment', icon: "fa-regular fa-building" },
    { type: 'condo', icon: "fa-regular fa-buildings" },
    { type: 'house', icon: "fa-regular fa-house" },
    { type: 'townhouse', icon: "fa-regular fa-house-turret" },
    { type: 'basement', icon: "fa-regular fa-stairs" },
    { type: 'loft', icon: "fa-regular fa-city" },
    { type: 'studio', icon: "fa-regular fa-person-shelter" },
    { type: 'trailer', icon: "fa-regular fa-caravan-simple" }
];

function PropertyTypeSelector({ data, setData, name }) {
    const handleChange = (e) => {
        setData(name, e.target.value);
    };

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {propertyTypes.map(({ type, icon }) => (
                <div
                    key={type}
                    className="flex flex-col items-center space-y-3"
                >

                        <label
                            htmlFor={`property_type_${type}`}
                            className={`
                                relative flex flex-col items-center cursor-pointer rounded-lg border border-gray-200 bg-white py-4
                                focus:outline-none text-gray-500
                                has-[:focus]:ring-2 has-[:focus]:ring-offset-2 has-[:focus]:ring-orange-500/25 has-[:focus]:border-orange-500
                                has-[:checked]:ring-2 has-[:checked]:ring-offset-2 has-[:checked]:ring-orange-500/25 has-[:checked]:border-orange-500 has-[:checked]:text-orange-500 w-[110px]
                            `}
                        >
                            <input
                                type="radio"
                                id={`property_type_${type}`}
                                name={name}
                                value={type}
                                checked={data[name] === type}
                                onChange={handleChange}
                                className="sr-only"
                            />
                            <i className={icon}></i>
                            <div className="block mt-2 text-sm font-medium text-center text-gray-900 peer-checked:text-orange-500">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                        </label>
                </div>
            ))}
        </div>
    )
}
export default PropertyTypeSelector;