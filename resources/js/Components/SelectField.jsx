// Components/SelectField.jsx

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

function SelectField({ data, setData, name, label, options, placeholder, ...props }) {
    const handleChange = (value) => {
        setData(name, value);
    };

    return (
        <div>
            <Label>{label}</Label>
            <Select
                value={data[name] || ''}
                onValueChange={handleChange}
                {...props}
            >
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {/* {errors[name] && <div>{errors[name]}</div>} */}
        </div>
    );
}

export default SelectField;