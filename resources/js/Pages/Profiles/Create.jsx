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

    const initialData = {
        name: userProfile?.name || '',
        age: userProfile?.age || '',
        gender: userProfile?.gender || '',
        short_description: userProfile?.short_description || '',
        can_be_contacted: userProfile?.can_be_contacted ?? true, //  Usa ?? para valores booleanos
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
        images: [],
    };


    const { data, setData, post, processing, reset, errors: formErrors } = useForm(initialData);

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('CreateProfile:onSubmit - Iniciando envío del formulario', data);

        post(route('profiles.store'), {
            onSuccess: () => {
                console.log('CreateProfile:onSubmit - Perfil creado con éxito.');
                reset();
            },
            onError: (errors) => {
                console.error('CreateProfile:onSubmit - Error al crear el perfil:', errors);
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
            <div className="max-w-3xl p-6 pt-10 mx-auto mt-10 border rounded-lg">
                <Head title="Create New Profile" />
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
                    {/* Image Upload */}
                    <div className="mx-auto w-full max-w-[600px]">
                        <ImageUpload
                            data={data}
                            setData={setData}
                            name="images"
                            initialImage={userProfile?.profile_image ? `/storage/${userProfile.profile_image}` : null}

                        />
                        {userProfile?.profile_image && !data.images.length && (
                            <img
                                src={`/storage/${userProfile.profile_image}`}
                                alt="Profile"
                                className="object-cover w-32 h-32 mt-2 rounded-full"
                            />
                        )}
                    </div>


                    {renderSectionTitle('Personal Information')}
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

                    {renderSectionTitle('Contact & Preferences')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CheckboxField
                            data={data}
                            setData={setData}
                            name="can_be_contacted"
                            label="Allow Contact"
                            description="Allow other users to message you."
                        />

                        <InputField  //podria ser select
                            data={data}
                            setData={setData}
                            name="team_up"
                            label="Team Up"
                            placeholder="Team Up preferences (optional)"
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


                    {/* Environment & Compatibility */}
                    {renderSectionTitle('Preferences')}
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


                    {renderSectionTitle('About You')}
                    <TextareaField
                        data={data}
                        setData={setData}
                        name="description"
                        label="About Me"
                        placeholder="Describe yourself..."
                        minLength={75}
                    />

                    {renderSectionTitle('Contact Information')}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        />
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full p-3 text-white rounded-md bg-[--black] hover:border hover:bg-[--white]" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Profile'}
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
}

export default CreateProfile;