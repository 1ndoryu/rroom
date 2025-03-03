// resources/js/Pages/Content/Show.jsx
import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

function ContentShow({ item }) {
    const { auth } = usePage().props
    const user = item.user || {};
    const title = item.type === 'room' ? item.address : item.name;
    const imageUrls = item.type === 'room' ? item.imageUrls : [item.profile_image];

    return (
        <MainLayout auth={auth}>
            <Head title={title} />
            <div className="flex flex-col items-center p-6 mx-auto align-content-center">
                <h1 className="mb-4 text-3xl font-bold">{title}</h1>


                {imageUrls && imageUrls.length > 0 ? (
                    <div className="flex flex-col items-start justify-center mb-6 max-w-[700px] max-h-[400px]">
                        {imageUrls.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`${title} - Image ${index + 1}`}
                                className="object-cover object-center w-[695px] h-auto overflow-hidden rounded-lg"
                            />
                        ))}
                    </div>
                ) : (
                    <p>No images available.</p>
                )}


                <div className="flex flex-col items-center p-5 rounded-lg max-w-[700px] border">

                    <div className="flex flex-col gap-[12px]">
                        <p className="text-gray-700">
                            <strong>Description.</strong>
                            <p className='pt-2'>{item.description}</p>
                        </p>

                        {item.type === 'room' && (
                            <div className="grid grid-cols-2 p-4 gap-y-2 gap-x-4">
                                <span className="text-gray-700">Rent</span><span>₹{item.rent}</span>
                                <span className="text-gray-700">Bills Included</span><span>{item.bills_included ? 'Yes' : 'No'}</span>
                                <span className="text-gray-700">Security Deposit</span><span>₹{item.security_deposit}</span>
                                <span className="text-gray-700">Preferred Gender</span><span>{item.preferred_gender}</span>
                                <span className="text-gray-700">Property Type</span><span>{item.property_type}</span>
                                <span className="text-gray-700">Available On</span><span>{item.available_on}</span>
                            </div>
                        )}

                        {item.type === 'profile' && (
                            <div className="grid grid-cols-2 p-4 gap-y-2 gap-x-4">
                                <span className="text-gray-700">Budget</span><span>₹{item.budget}</span>
                                <span className="text-gray-700">Age</span><span>{item.age}</span>
                                <span className="text-gray-700">Gender</span><span>{item.gender}</span>
                                <span className="text-gray-700">Looking In</span><span>{item.looking_in}</span>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </MainLayout >
    );
}

export default ContentShow;