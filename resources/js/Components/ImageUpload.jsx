// Components/ImageUpload.jsx
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useEffect, useRef, useState } from 'react'; // Import useRef
import '../../css/image-upload.css';

import IconClose from '../../assets/IconClose.jsx';

function ImageUpload({
    data,
    setData,
    name,
    initialImage  = null,
    maxImages = 1,
    maxFileSizeMB = 3,
}) {
    const [preview, setPreview] = useState(null); //  Solo UNA previsualización.
    const fileInputRef = useRef(null); // Referencia al input file
    const maxFileSize = maxFileSizeMB * 1024 * 1024;

    useEffect(() => {
        if (initialImage) {
            setPreview(initialImage);
        }

        // Limpia el objeto URL al desmontar.
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [initialImage, preview]);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; //  Toma solo el PRIMER archivo.
        if (
            file &&
            file.size <= maxFileSize &&
            ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
                file.type,
            )
        ) {
            setData(name, file); //  Guarda el OBJETO File, no un array.
            setPreview(URL.createObjectURL(file)); //  Crea la previsualización.
        } else {
            //Si no es valido, se establece los valores a null
            setData(name, null);
            setPreview(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0]; //  Toma solo el PRIMER archivo.
        if (
            file &&
            file.size <= maxFileSize &&
            ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
                file.type,
            )
        ) {
            setData(name, file);
            setPreview(URL.createObjectURL(file));
        } else {
            //Si no es valido, se establece los valores a null
            setData(name, null);
            setPreview(null);
        }
    };

    const handleDelete = () => {
        setData(name, null); //  Borra la imagen del estado.
        setPreview(null); //  Borra la previsualización.
        // Limpia el input file (para que se pueda volver a seleccionar el mismo archivo).
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <Label>Image</Label>
            <div
                className="p-4 text-center border-2 border-gray-300 border-dashed cursor-pointer"
                onClick={() => fileInputRef.current?.click()} // Usa la referencia
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative flex items-center justify-center c-image">
                        <img
                            src={preview}
                            alt="Preview"
                            className="object-cover rounded h-60 w-60"
                        />
                        <button
                            type="button"
                            className="button-close-upload"
                            onClick={handleDelete}
                        >
                            <IconClose />
                        </button>
                    </div>
                ) : (
                    <p>Upload an image or drag and drop here.</p>
                )}
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                    ref={fileInputRef} // Asigna la referencia
                />
            </div>
        </div>
    );
}

export default ImageUpload;
