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
            <div className="container p-6 mx-auto">
                <h1 className="mb-4 text-3xl font-bold">{title}</h1>

                {/* Sección de Imágenes */}
                <div className="mb-6">
                    {imageUrls && imageUrls.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {imageUrls.map((url, index) => (
                                <img key={index} src={url} alt={`${title} - Image ${index + 1}`} className="w-full h-auto rounded-lg" />
                            ))}
                        </div>
                    ) : (
                        <p>No images available.</p>
                    )}
                </div>


                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Detalles comunes */}
                    <div>
                        <h2 className="mb-2 text-xl font-semibold">Details</h2>
                        <p className="text-gray-700">
                            <strong>Posted by:</strong> {user.name}
                        </p>
                        <p className="text-gray-700">
                            <strong>Description:</strong> {item.description}
                        </p>


                        {/* Detalles específicos de Room */}
                        {item.type === 'room' && (
                            <>
                                <p className="text-gray-700"><strong>Rent:</strong> ₹{item.rent}</p>
                                <p className="text-gray-700"><strong>Preferred Gender:</strong> {item.preferred_gender}</p>
                                <p className="text-gray-700"><strong>Property Type:</strong> {item.property_type}</p>
                                <p className="text-gray-700"><strong>Bills Included:</strong> {item.bills_included ? 'Yes' : 'No'}</p>
                                <p className="text-gray-700"><strong>Security Deposit:</strong> ₹{item.security_deposit}</p>
                                <p className="text-gray-700"><strong>Available On:</strong> {item.available_on}</p>

                            </>
                        )}

                        {/* Detalles específicos de Profile */}
                        {item.type === 'profile' && (
                            <>
                                <p className="text-gray-700"><strong>Budget:</strong> ₹{item.budget}</p>
                                <p className="text-gray-700"><strong>Age:</strong> {item.age}</p>
                                <p className="text-gray-700"><strong>Gender:</strong> {item.gender}</p>
                                <p className="text-gray-700"><strong>Looking In:</strong> {item.looking_in}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default ContentShow;