// /Components/InputField.jsx

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";


function InputField({ data, setData, name, label, type = "text", placeholder, ...props }) {
    const handleChange = (e) => {
        setData(name, e.target.value);
    };

    return (
        // Usa divs y labels en vez de FormItem, FormLabel, etc.
        <div>
            <Label>{label}</Label>
            <div>
                <Input
                    type={type}
                    value={data[name] || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    {...props}
                />
            </div>
            {/* Podrías mostrar errores de Inertia aquí si los tuvieras
                {errors[name] && <div>{errors[name]}</div>}  */}
        </div>
    );
}

export default InputField;