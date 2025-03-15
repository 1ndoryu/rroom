// resources/js/Pages/Rooms/Edit.jsx
import React, { useEffect } from 'react'; //  Importante: useEffect
import { useForm, Head, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import InputField from '@/Components/InputField';
import CheckboxField from '@/Components/CheckboxField';
import MainLayout from '@/Layouts/MainLayout';
import SelectField from '@/Components/SelectField';
import TextareaField from '@/Components/TextareaField';
import ImageUpload from '@/Components/ImageUpload';
import PropertyTypeSelector from '@/Components/PropertyTypeSelector';
import LocationInputField from '@/Components/LocationInputField';


function EditRoom({ room }) {  // Recibe `room` como prop.
    const { errors, auth } = usePage().props;

    const { data, setData, put, processing, reset, isDirty } = useForm({  //  Usa `put`
        address: room.address,  //  Inicializa con los datos de la habitación.
        city: room.city,
        hide_address: room.hide_address,
        property_type: room.property_type,
        rent: room.rent,
        bills_included: room.bills_included,
        security_deposit: room.security_deposit,
        available_on: room.available_on,
        preferred_gender: room.preferred_gender,
        bathroom_type: room.bathroom_type,
        parking: room.parking,
        internet_access: room.internet_access,
        private_room: room.private_room,
        furnished: room.furnished,
        accessible: room.accessible,
        lgbt_friendly: room.lgbt_friendly,
        cannabis_friendly: room.cannabis_friendly,
        cat_friendly: room.cat_friendly,
        dog_friendly: room.dog_friendly,
        children_friendly: room.children_friendly,
        student_friendly: room.student_friendly,
        senior_friendly: room.senior_friendly,
        requires_background_check: room.requires_background_check,
        description: room.description,
        roomies_description: room.roomies_description,
        bedrooms: room.bedrooms,
        bathrooms: room.bathrooms,
        roomies: room.roomies,
        minimum_stay: room.minimum_stay,
        maximum_stay: room.maximum_stay,
        images: [], //  Para *nuevas* imágenes.  Vacío al inicio.
        existing_images: room.images, //  Para imágenes *existentes*.
    });
    //Logica para hacer que todo lo que este vacio string se rellene como null
    useEffect(() => {
        // Iterar sobre las claves del objeto `data`
        for (const key in data) {
          // Verificar si el valor es un string vacío
          if (data[key] === '') {
            // Establecer el valor a null
            setData(key, null);
          }
        }
    }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('EditRoom:onSubmit - Iniciando envío del formulario', data);

        put(route('rooms.update', { room: room.id }), {  // Usa `put` y la ruta correcta.
            onSuccess: () => {
                console.log('EditRoom:onSubmit - Habitación actualizada con éxito.');
            },
            onError: (errors) => {
                console.error('EditRoom:onSubmit - Error al actualizar la habitación:', errors);
            },
        });
    };

    // Función para manejar la eliminación de imágenes existentes
    const handleRemoveExistingImage = (imageId) => {
      // Filtrar las imágenes existentes, excluyendo la que se va a eliminar
      setData('existing_images', (prevImages) =>
          prevImages.filter((image) => image.id !== imageId)
      );
    };

    const renderSectionTitle = (title) => (
      <div className="py-2">
          <h3 className="pb-1 text-xl font-semibold border-b-2 border-gray-200">{title}</h3>
      </div>
    );


    return (
        <MainLayout auth={auth}>
            <div className="max-w-3xl p-6 pt-10 mx-auto mt-10 border rounded-lg">
                <Head title={`Edit Room - ${room.address}`} />
                <form onSubmit={onSubmit} className="space-y-6">

                    {/* Mostrar errores de validación */}
                    {Object.keys(errors).length > 0 && (
                        <div style={{ color: 'red' }}>
                            <ul>
                                {Object.keys(errors).map((key) => (
                                    <li key={key}>{errors[key]}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Image Upload  (para *nuevas* imágenes)*/}
                    <div className="mx-auto w-full max-w-[600px]">
                        <ImageUpload data={data} setData={setData} name="images" />
                    </div>

                     {/* Existing Images (Muestra y permite eliminar) */}
                    {data.existing_images.length > 0 && (
                        <>
                            {renderSectionTitle('Existing Images')}
                            <div className="grid grid-cols-3 gap-4">
                                {data.existing_images.map((image) => (
                                    <div key={image.id} className="relative c-image">
                                        <img src={image.url} alt="Existing" className="object-cover rounded h-60 w-60" />
                                        <button
                                            type="button"
                                            className="button-close-upload"
                                            onClick={() => handleRemoveExistingImage(image.id)}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Basic Information */}
                    {renderSectionTitle('Basic Information')}
                    <div className="flex flex-col gap-4">
                        <PropertyTypeSelector data={data} setData={setData} name="property_type" />
                        <InputField
                            data={data}
                            setData={setData}
                            name="address"
                            label="Address"
                            placeholder="Enter the Address"
                        />
                        <LocationInputField
                            data={data}
                            setData={setData}
                            name="city"
                            label="City"
                            placeholder="Enter the City"
                            isLocationSpecific={true}
                        />
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="hide_address"
                            label="Hide street name"
                            description="Show number, hide street."
                        />
                    </div>

                    {renderSectionTitle('Financials & Availability')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            data={data}
                            setData={setData}
                            name="rent"
                            label="Rent"
                            type="number"
                            InputProps={{
                                startAdornment: <span>$</span>,
                                endAdornment: <span>/ month</span>,
                            }}
                        />
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="bills_included"
                            label="Bills Included"
                        />
                        <InputField
                            data={data}
                            setData={setData}
                            name="security_deposit"
                            label="Deposit"
                            type="number"
                            InputProps={{
                                startAdornment: <span>$</span>,
                            }}
                        />
                        <InputField
                            data={data}
                            setData={setData}
                            name="available_on"
                            label="Available From"
                            type="date"
                        />
                    </div>

                    {/* Roommate Preferences */}
                    {renderSectionTitle('Roommate Preferences')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <SelectField
                            data={data}
                            setData={setData}
                            name="preferred_gender"
                            label="Preferred Gender"
                            options={[
                                { value: "any", label: "No preference" },
                                { value: "females", label: "Females" },
                                { value: "males", label: "Males" },
                                { value: "couples", label: "Couples" }
                            ]}
                        />
                        <SelectField
                            data={data}
                            setData={setData}
                            name="bathroom_type"
                            label="Bathroom Type"
                            options={[
                                { value: "shared", label: "Shared" },
                                { value: "own", label: "Private" },
                                { value: "ensuite", label: "Ensuite" }
                            ]}
                        />
                    </div>

                    {/* Property Features */}
                    {renderSectionTitle('Property Features')}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {[
                            { name: 'parking', label: 'Parking', icon: '🚙' },
                            { name: 'internet_access', label: 'Internet', icon: '🖥' },
                            { name: 'private_room', label: 'Private', icon: '☝️' },
                            { name: 'furnished', label: 'Furnished', icon: '🛏' },
                            { name: 'accessible', label: 'Accessible', icon: '🧑‍🦽' },
                        ].map((item) => (
                            <CheckboxField
                                key={item.name}
                                data={data}
                                setData={setData}
                                name={item.name}
                                label={item.label}
                            />
                        ))}
                    </div>

                    {/* Environment & Compatibility */}
                    {renderSectionTitle('Environment')}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {[
                            { name: 'lgbt_friendly', label: 'LGBT+', icon: '🏳️‍🌈' },
                            { name: 'cannabis_friendly', label: 'Cannabis', icon: '🌲' },
                            { name: 'cat_friendly', label: 'Cats', icon: '🐱' },
                            { name: 'dog_friendly', label: 'Dogs', icon: '🐶' },
                            { name: 'children_friendly', label: 'Children' },
                            { name: 'student_friendly', label: 'Students' },
                            { name: 'senior_friendly', label: 'Seniors' },
                        ].map((item) => (
                            <CheckboxField
                                key={item.name}
                                data={data}
                                setData={setData}
                                name={item.name}
                                label={item.label}
                            />
                        ))}
                    </div>

                    {/* Extra Requirements */}
                    {renderSectionTitle('Extra Requirements')}
                    <div className="grid grid-cols-1 gap-4">
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="requires_background_check"
                            label="Background Check"
                        />
                    </div>

                    {/* Descriptions */}
                    {renderSectionTitle('Descriptions')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <TextareaField
                            data={data}
                            setData={setData}
                            name="description"
                            label="About Property"
                            placeholder="Describe the property..."
                            minLength={75}
                        />
                        <TextareaField
                            data={data}
                            setData={setData}
                            name="roomies_description"
                            label="About Roommates"
                            placeholder="Describe current residents..."
                            minLength={75}
                        />
                    </div>

                    {/* Numerical Data */}
                    {renderSectionTitle('Numerical Data')}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                        <InputField data={data} setData={setData} name="bedrooms" label="Bedrooms" type="number" min="1" />
                        <InputField data={data} setData={setData} name="bathrooms" label="Bathrooms" type="number" min="1" />
                        <InputField data={data} setData={setData} name="roomies" label="Roommates" type="number" min="1" />
                        <InputField data={data} setData={setData} name="minimum_stay" label="Min Stay (months)" type="number" />
                        <InputField data={data} setData={setData} name="maximum_stay" label="Max Stay (months)" type="number" />
                    </div>

                    <Button type="submit" className="w-full p-3 text-white rounded-md bg-[--black] hover:border hover:bg-[--white]" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Room'}
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
}

export default EditRoom;