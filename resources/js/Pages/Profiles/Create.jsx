// resources/js/Pages/Profiles/Create.jsx
import React from 'react';
import { useForm, Head, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import InputField from '@/Components/InputField';
import CheckboxField from '@/Components/CheckboxField';
import MainLayout from '@/Layouts/MainLayout';
import SelectField from '@/Components/SelectField';
import TextareaField from '@/Components/TextareaField';
import ImageUpload from '@/Components/ImageUpload';

function CreateProfile() {
    const { errors, auth, userProfile } = usePage().props;

    // 1.  Datos iniciales: 'images' debe ser null o un objeto File, NO un array.
    const initialData = {
        name: userProfile?.name || '',
        age: userProfile?.age || '',
        gender: userProfile?.gender || '',
        short_description: userProfile?.short_description || '',
        can_be_contacted: userProfile?.can_be_contacted ?? true,
        team_up: userProfile?.team_up || '',
        looking_in: userProfile?.looking_in || '',
        budget: userProfile?.budget || '',
        accommodation_for: userProfile?.accommodation_for || 'myself',
        ready_to_move: userProfile?.ready_to_move || '',
        lgbt_friendly: userProfile?.lgbt_friendly ?? false,
        cannabis_friendly: userProfile?.cannabis_friendly ?? false,
        cat_friendly: userProfile?.cat_friendly ?? false,
        dog_friendly: userProfile?.dog_friendly ?? false,
        children_friendly: userProfile?.children_friendly ?? false,
        student_friendly: userProfile?.student_friendly ?? false,
        senior_friendly: userProfile?.senior_friendly ?? false,
        requires_background_check: userProfile?.requires_background_check ?? false,
        description: userProfile?.description || '',
        phone_number: userProfile?.phone_number || '',
        phone_number_public: userProfile?.phone_number_public ?? false,
        images: null, //  <--  CAMBIO AQUÍ:  Debe ser null inicialmente.
    };

    const { data, setData, post, processing, reset, errors: formErrors } = useForm(initialData);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('CreateProfile:onSubmit - Iniciando envío del formulario', data);

        // 2. Usa FormData para enviar archivos correctamente:
        const formData = new FormData();
        for (let key in data) {
            if (key === 'images' && data.images) {
                // Añade la imagen SOLO si existe.
                formData.append('images', data.images);
            } else {
                formData.append(key, data[key]);
            }
        }


        post(route('profiles.store'), {
            data: formData,  // <-- Envía el FormData.
            onSuccess: () => {
                console.log('CreateProfile:onSubmit - Perfil creado con éxito.');
                // No llames a reset() aquí.  Deja los datos en el formulario
                // para que el usuario pueda ver que se guardaron correctamente.
                // reset();  // <--  Quita esto.
            },
            onError: (errors) => {
                console.error('CreateProfile:onSubmit - Error al crear el perfil:', errors);
            },
            // Importante para enviar archivos:
            forceFormData: true, // <--  AÑADE ESTO.
        });
    };

    const RenderSectionTitle = ({ title }) => {
        return (
            <div className="py-2">
                <h3 className="pb-1 text-xl font-semibold border-b-2 border-gray-200">{title}</h3>
            </div>
        )
    };

    return (
        <MainLayout auth={auth}>
            <div className="max-w-3xl p-6 pt-10 mx-auto mt-10 border rounded-lg">
                <Head title="Create New Profile" />
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Muestra errores de Inertia (si los hay) */}
                    {Object.keys(formErrors).length > 0 && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <ul className="mt-1.5 ml-4 list-disc list-inside">
                                {Object.values(formErrors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mx-auto w-full max-w-[600px]">
                        <ImageUpload
                            data={data}
                            setData={setData}
                            name="images"
                            // Pasa la URL completa, no relativa.
                            initialImage={userProfile?.profile_image ? `${window.location.origin}/storage/${userProfile.profile_image}` : null}
                            maxImages={1}  // <--  SOLO 1 IMAGEN.

                        />
                        {/* Ya no necesitas mostrar la imagen aquí, ImageUpload lo hace. */}
                    </div>


                    <RenderSectionTitle title={'Personal Information'}/>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <InputField
                            data={data}
                            setData={setData}
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                        />
                        <InputField
                            data={data}
                            setData={setData}
                            name="age"
                            label="Age"
                            type="number"
                            placeholder="Enter your age"
                        />
                        <SelectField
                            data={data}
                            setData={setData}
                            name="gender"
                            label="Gender"
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />
                        <InputField
                            data={data}
                            setData={setData}
                            name="short_description"
                            label="Short Description"
                            placeholder="E.g., Student, Professional..."
                        />
                    </div>

                    <RenderSectionTitle title={'Contact & Preferences'}/>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="can_be_contacted"
                            label="Allow Contact"
                            description="Allow other users to message you."
                        />
                        {/*  USAR SelectField AQUI */}
                        <SelectField
                            data={data}
                            setData={setData}
                            name="team_up"
                            label="Team Up"
                            options={[
                                { value: 'looking', label: 'Looking for Team Ups' },
                                { value: 'open', label: 'Open to Team Ups' },
                                { value: 'not_interested', label: 'Not Interested in Team Ups' },
                            ]}
                        />

                        <InputField
                            data={data}
                            setData={setData}
                            name="looking_in"
                            label="Looking In"
                            placeholder="Enter location"
                        />
                        <InputField
                            data={data}
                            setData={setData}
                            name="budget"
                            label="Budget"
                            type="number"
                            InputProps={{
                                startAdornment: <span>$</span>,
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <SelectField
                            data={data}
                            setData={setData}
                            name="accommodation_for"
                            label="Accommodation For"
                            options={[
                                { value: 'myself', label: 'Myself' },
                                { value: 'other', label: 'Other' },
                            ]}
                        />

                        <InputField
                            data={data}
                            setData={setData}
                            name="ready_to_move"
                            label="Ready to Move"
                            type="date"
                        />
                    </div>


                    <RenderSectionTitle title={'Preferences'}/>
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

                    {RenderSectionTitle('Extra Requirements')}
                    <div className="grid grid-cols-1 gap-4">
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="requires_background_check"
                            label="Background Check"
                        />
                    </div>


                    <RenderSectionTitle title={'About You'}/>
                    <TextareaField
                        data={data}
                        setData={setData}
                        name="description"
                        label="About Me"
                        placeholder="Describe yourself..."
                        minLength={75}
                    />

                    {RenderSectionTitle('Contact Information')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 flex align-end items-end">
                        <InputField
                            data={data}
                            setData={setData}
                            name="phone_number"
                            label="Phone Number"
                            placeholder="Enter your phone number"
                        />
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="phone_number_public"
                            label="Public Phone Number"
                            description="Make your phone number visible to others."
                            adaptive={true}
                        />
                    </div>

                    <Button type="submit" className="w-full p-3 text-white rounded-md bg-[--black] hover:border hover:bg-[--white]" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Profile'}
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
}

export default CreateProfile;