
// Components/CheckboxField.jsx
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";

function CheckboxField({ data, setData, name, label, description, ...props }) {
    const handleChange = (checked) => {
        setData(name, checked);
    };

    return (
        <div className="flex flex-row items-center h-max mt-auto justify-between p-2.5 space-x-3 space-y-0 border rounded-md">
            <div className="flex flex-col">
                <Label className="font-medium text-gray-800">{label}</Label>
                {description && (
                    <p className="text-sm text-gray-700">{description}</p>
                )}
            </div>
            <div>
                <Checkbox
                    checked={data[name] || false}
                    onCheckedChange={handleChange}
                    {...props}
                />
            </div>
            {/* {errors[name] && <div>{errors[name]}</div>} */}
        </div>
    );
}

export default CheckboxField;