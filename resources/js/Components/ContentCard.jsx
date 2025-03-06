// resources/js/Components/ContentCard.jsx
import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

function ContentCard({ item }) {
    const user = item?.user || {};
    const firstImageUrl = item?.imageUrls?.[0] || item?.profile_image;

    let line1, line2;
    if (item.type === 'room') {
        line1 = item.address;
        line2 = user?.name ?? user?.username ?? 'Unknown User';
    } else if (item.type === 'profile') {
        line1 = item.name;
        line2 = `Looking in: ${item.looking_in}`;
    } else {
        line1 = user?.name ?? user?.username ?? 'Unknown User'; // Default case, or handle as needed
        line2 = item?.address || item?.name; // Default case
    }

    const detail1 = item?.address ? `₹${item?.rent}` : `₹${Math.floor(item?.budget || 0)}`;
    const detail1Label = item?.address ? "Rent" : "Budget";
    const detail2 = item?.address ? item?.preferred_gender : item?.gender;
    const detail2Label = item?.address ? "Preferred Gender" : "Gender";
    const cardDescription = item?.description;


    return (
        <Link href={route('content.show', { type: item.type, id: item.id })}>
            <div className="relative transition-all transition duration-200 transform bg-white border border-gray-200 rounded-lg cursor-pointer content-card hover:shadow-lg hover:scale-105">
                {/* Image Container */}
                <div className="flex">
                    <div className="relative w-1/2 image-container bg-slate-100" style={{ borderRadius: '5px 0px 0px', overflow: 'hidden' }}>
                        <div className="relative h-full image-wrapper" style={{ paddingBottom: '100%' }}>
                            {firstImageUrl ? (
                                <img
                                    alt={line1}
                                    src={firstImageUrl}
                                    className="absolute inset-0 object-cover w-full h-full"
                                    style={{ borderRadius: '0px 0px 0px 5px' }}
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* Info Container */}
                    <div className="text-wrapper py-3 px-5 relative h-full flex flex-col justify-start items-start gap-0.5 w-full">
                        {/* Line 1 - Location for Room, Name for Profile */}
                        <div className="flex items-center space-x-1 user-info">
                            <p className="text-base truncate max-w-[170px] md:text-lg text-gray-600 font-medium">
                                {line1}
                            </p>
                        </div>

                        {/* Line 2 - Name for Room, Looking In for Profile */}
                        <div className="flex items-start gap-1 pb-4 -ml-1 text-xs text-gray-500 location lg:text-sm">
                            <p className="w-40 p-[3px] text-xs truncate sm:w-80 md:w-40 lg:w-80">
                                {line2}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="flex flex-row gap-4 details-container">

                            <div className='flex flex-col items-start'>
                                <span className='text-xs text-gray-500 detail-label'>{detail1Label}</span>
                                <span className='flex items-center pt-1 space-x-1 text-sm font-medium text-gray-600 lg:order-2 whitespace-nowrap'>{detail1}</span>
                            </div>

                            {detail2 && (
                                <div className='flex flex-col items-start'>
                                    <span className='text-xs text-gray-500 detail-label'>{detail2Label}</span>
                                    <span className='flex items-center pt-1 space-x-1 text-sm font-medium text-gray-600 lg:order-2 whitespace-nowrap'>{detail2}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-2 text-xs text-gray-700 description-container" style={{ maxWidth: '100%' }}>
                            <p className="break-words line-clamp-2">{cardDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ContentCard;