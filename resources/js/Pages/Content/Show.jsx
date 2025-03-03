// resources/js/Pages/Content/Show.jsx
import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';

function ContentShow({ item }) {
    const { auth } = usePage().props;
    const user = item.user || {};
    const title = item.type === 'room' ? item.address : item.name;
    const imageUrls =
        item.type === 'room' ? item.imageUrls : [item.profile_image];

    return (
        <MainLayout auth={auth}>
            <Head title={title} />
            <div className="align-content-center mx-auto flex flex-col items-center p-6">
                <h1 className="mb-4 text-3xl font-bold">{title}</h1>

                {imageUrls && imageUrls.length > 0 ? (
                    <div className="mb-6 flex max-h-[400px] max-w-[700px] flex-col items-start justify-center">
                        {imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`${title} - Image ${index + 1}`}
                                className="h-auto w-[695px] overflow-hidden rounded-lg object-cover object-center"
                            />
                        ))}
                    </div>
                ) : (
                    <p>No images available.</p>
                )}

                <div className="flex max-w-[700px] flex-col items-center rounded-lg border p-5">
                    <div className="flex flex-col gap-[12px]">
                        <p className="text-gray-700">
                            <strong>Description.</strong>
                            <p className="pt-2">{item.description}</p>
                        </p>

                        {item.type === 'room' && (
                            <div className="w-full flex flex-col gap-x-4 gap-y-2 p-4 max-[668px]:p-1">

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-money-bills"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Rent
                                        </span>
                                    </div>

                                    <span>₹{item.rent}</span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-money-check-dollar"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Bills Included
                                        </span>
                                    </div>

                                    <span>{item.bills_included ? 'Yes' : 'No'}</span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-lock"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Security Deposit
                                        </span>
                                    </div>

                                    <span>₹{item.security_deposit}</span>
                                </div>


                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-person-half-dress"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Preferred Gender
                                        </span>
                                    </div>

                                    <span>{item.preferred_gender}</span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-house-user"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Property Type
                                        </span>
                                    </div>

                                    <span>{item.property_type}</span>
                                </div>

                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <i
                                            className="fa-solid fa-calendar"
                                            style={{ color: '#a0a0a0' }}
                                        ></i>
                                        <span className="text-gray-700">
                                            Available On
                                        </span>
                                    </div>

                                    <span>{new Date(item.available_on).toLocaleDateString()}</span>
                                </div>

                            </div>
                        )}

                        {item.type === 'profile' && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-4">
                                <span className="text-gray-700">Budget</span>
                                <span>₹{item.budget}</span>
                                <span className="text-gray-700">Age</span>
                                <span>{item.age}</span>
                                <span className="text-gray-700">Gender</span>
                                <span>{item.gender}</span>
                                <span className="text-gray-700">
                                    Looking In
                                </span>
                                <span>{item.looking_in}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ContentShow;
