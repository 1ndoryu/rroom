// Components/ImageUpload.jsx
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { useState, useEffect } from 'react';

function ImageUpload({ data, setData, name, initialImage, maxImages = 8, maxFileSizeMB = 3 }) {
    const [previews, setPreviews] = useState([]);
    const maxFileSize = maxFileSizeMB * 1024 * 1024;

    useEffect(() => {
        // Load initial image if provided
        if (initialImage) {
            setPreviews([initialImage]);
        }

        // Revoke object URLs on unmount
        const currentPreviews = previews;
        return () => {
            currentPreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [initialImage, previews]); //  Depend on initialImage


    const handleImageChange = (e) => {
        handleFiles(Array.from(e.target.files));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(Array.from(e.dataTransfer.files));
    };


    const handleFiles = (files) => {
        let newFiles = Array.from(files)
            .filter(file => file.size <= maxFileSize && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type));

        let updatedFiles;
        if (initialImage) { // If there was an initial image, replace it
            updatedFiles = [...newFiles].slice(0, maxImages);
        } else { // Otherwise, add to existing files
            const currentImages = data.images || [];
            updatedFiles = [...currentImages, ...newFiles].slice(0, maxImages);
        }

        setData(name, updatedFiles);

        // Create previews, either replacing the initial image or adding to existing ones.
        const newPreviews = updatedFiles.map(file => {
            return typeof file === 'string' ? file : URL.createObjectURL(file)
        });

        setPreviews(newPreviews);

    };

    const handleDelete = () => {  //add de delete function
        setData(name, []);
        setPreviews([]);
    };

    return (
        <div>
            <Label>Images</Label>
            <div
                className="p-4 text-center border-2 border-gray-300 border-dashed cursor-pointer"
                onClick={() => document.getElementById('image-upload').click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {previews.length === 0 ? (
                    <p>Upload an image or drag and drop here</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                        {previews.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} alt={`Preview ${index}`} className="object-cover rounded h-60 w-60" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 p-1 m-1 text-white bg-red-500 rounded-full"
                                    onClick={handleDelete}
                                >
                                    X {/* Consider using an icon */}
                                </button>
                            </div>
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
        </div>
    );
}
export default ImageUpload;