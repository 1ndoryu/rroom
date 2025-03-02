// Components/TextareaField.jsx

import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

function TextareaField({ data, setData, name, label, placeholder, ...props }) {
    const handleChange = (e) => {
        setData(name, e.target.value);
    };

    return (
        <div>
            <Label>{label}</Label>
                <Textarea
                    placeholder={placeholder}
                    className="resize-none"
                    value={data[name] || ''}
                    onChange={handleChange}
                    {...props}
                />
            {/* {errors[name] && <div>{errors[name]}</div>} */}
        </div>
    );
}
export default TextareaField;