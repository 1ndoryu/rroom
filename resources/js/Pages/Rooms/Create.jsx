// resources/js/Pages/Rooms/Create.jsx
import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react'; // Importa usePage
import { Button } from "@/Components/ui/button";
import InputField from '@/Components/InputField';
import CheckboxField from '@/Components/CheckboxField';
import MainLayout from '@/Layouts/MainLayout';
import SelectField from '@/Components/SelectField';
import TextareaField from '@/Components/TextareaField';
import ImageUpload from '@/Components/ImageUpload';
import PropertyTypeSelector from '@/Components/PropertyTypeSelector';
import LocationInputField from '@/Components/LocationInputField';

function CreateRoom() {
    const { errors, auth } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        address: '',
        city: '',
        hide_address: false,
        property_type: 'apartment',
        rent: '', // Inicializa como string vacío
        bills_included: false,
        security_deposit: '',  // Inicializa como string vacío
        available_on: '',
        preferred_gender: '',
        bathroom_type: 'shared',
        parking: false,
        internet_access: false,
        private_room: false,
        furnished: false,
        accessible: false,
        lgbt_friendly: false,
        cannabis_friendly: false,
        cat_friendly: false,
        dog_friendly: false,
        children_friendly: false,
        student_friendly: false,
        senior_friendly: false,
        requires_background_check: false,
        description: '',
        roomies_description: '',
        bedrooms: '', // String vacío
        bathrooms: '', // String vacío
        roomies: '',  // String vacío
        minimum_stay: '',    // String vacío
        maximum_stay: '',    // String vacío
        images: [],
    });

    const onSubmit = (e) => { // Recibe el evento 'e'
        e.preventDefault(); // Previene el comportamiento por defecto del form
        console.log('CreateRoom:onSubmit - Iniciando envío del formulario', data);

        post(route('rooms.store'), {  // No necesitas formData aquí
            onSuccess: () => {
                console.log('CreateRoom:onSubmit - Habitación creada con éxito.');
                reset();
            },
            onError: (errors) => {
                console.error('CreateRoom:onSubmit - Error al crear la habitación:', errors);
            },
        });
    };

    const renderSectionTitle = (title) => (
        <div className="py-2">
            <h3 className="pb-1 text-xl font-semibold border-b-2 border-gray-200">{title}</h3>
        </div>
    );

    return (
        <MainLayout auth={auth}>
            <div className="max-w-3xl p-6 pt-10 mx-auto mt-10 border rounded-lg" >
                <Head title="Create New Room" />
                <form onSubmit={onSubmit} className="space-y-6"> {/* Solo onSubmit, no encType */}

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

                    {/* Image Upload */}
                    <div className="mx-auto w-full max-w-[600px]">
                        <ImageUpload data={data} setData={setData} name="images" />
                    </div>

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

                    {/* Submit Button */}
                    <Button type="submit" className="w-full p-3 text-white rounded-md bg-[--black] hover:border hover:bg-[--white]" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Room'}
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
}

export default CreateRoom;