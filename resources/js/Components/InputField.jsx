// /Components/InputField.jsx
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils"; // Import the cn function


// /Components/InputField.jsx
function InputField({ data, setData, name, label, type = "text", placeholder, InputProps, ...props }) {
    const handleChange = (e) => {
        setData(name, e.target.value);
    };

    const startAdornment = InputProps?.startAdornment;
    const endAdornment = InputProps?.endAdornment;

    return (
        <div>
            <Label>{label}</Label>
            <div className="relative">
                {startAdornment && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {startAdornment}
                    </span>
                )}
                <Input
                    type={type}
                    value={data[name] || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={cn({
                        "pl-10": startAdornment,
                        "pr-10": endAdornment,
                    })}
                    {...props}
                />
                {endAdornment && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {endAdornment}
                    </span>
                )}
            </div>
        </div>
    );
}

export default InputField;