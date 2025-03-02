// Components/ImageUpload.jsx
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useState, useEffect } from 'react';

function ImageUpload({ data, setData, name, maxImages = 8, maxFileSizeMB = 3 }) {
    const [previews, setPreviews] = useState([]);
    const maxFileSize = maxFileSizeMB * 1024 * 1024;

    useEffect(() => {
        const currentPreviews = previews;
        return () => {
            currentPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const handleImageChange = (e) => {
        handleFiles(Array.from(e.target.files));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(Array.from(e.dataTransfer.files));
    };

    const handleFiles = (files) => {
        const newFiles = Array.from(files)
            .slice(0, maxImages)
            .filter(file => file.size <= maxFileSize && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type));

        const currentImages = data.images || [];
        const updatedFiles = [...currentImages, ...newFiles].slice(0, maxImages);
        setData(name, updatedFiles);
        const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    return (
        <div>
            <Label>Imágenes</Label>
            <div
                className="p-4 text-center border-2 border-gray-300 border-dashed cursor-pointer"
                onClick={() => document.getElementById('image-upload').click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {previews.length === 0 ? (
                    <p>Sube una imagen o arrastra y suelta aquí</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                        {previews.map((src, index) => (
                            <img key={index} src={src} alt={`Preview ${index}`} className="object-cover rounded h-60 w-60" />
                        ))}
                    </div>
                )}
                <Input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                />
            </div>
             {/* {errors[name] && <div>{errors[name]}</div>} */}
        </div>
    );
}
export default ImageUpload;