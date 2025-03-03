// resources/js/Components/ContentCard.jsx
import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';

function ContentCard({ item }) {
    const user = item?.user || {};
    const firstImageUrl = item?.imageUrls?.[0] || item?.profile_image;

    const title = item?.address || item?.name;
    const description = item?.description;
    const detail1 = item?.address ? `₹${item?.rent}` : `₹${Math.floor(item?.budget || 0)}`;
    const detail1Label = item?.address ? "Rent" : "Budget";
    const detail2 = item?.address ? item?.preferred_gender : item?.gender;
    const detail2Label = item?.address ? "Preferred Gender" : "Gender";

    console.log(item)

    return (
        <Link href={route('content.show', { type: item.type, id: item.id })}>
            <div className="relative transition duration-200 transform bg-white border border-gray-200 rounded-lg cursor-pointer content-card hover:shadow-lg transition-all duration-200 hover:scale-105">
                {/* ... resto del código de la tarjeta ... */}
                <div className="flex">
                    <div className="image-container relative  w-1/2 bg-slate-100" style={{ borderRadius: '5px 0px 0px', overflow: 'hidden' }}>
                        <div className="relative image-wrapper h-full" style={{ paddingBottom: '100%' }}>
                            {firstImageUrl ? (
                                <img
                                    alt={title}
                                    src={firstImageUrl}
                                    className="absolute inset-0 object-cover w-full h-full"
                                    style={{ borderRadius: '0px 0px 0px 5px' }}
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="text-wrapper py-3 px-5 relative h-full flex flex-col justify-start items-start gap-0.5 w-full">
                        <div className="flex items-center space-x-1 user-info">
                            <p className="text-base truncate max-w-[170px] md:text-lg text-gray-600 font-medium">
                                {user?.name ?? user?.username ?? 'Unknown User'}
                            </p>
                        </div>

                        <div className="flex items-start gap-1 pb-4 -ml-1 text-xs text-gray-500 location lg:text-sm">
                            <p className="w-40 p-[3px] text-xs truncate sm:w-80 md:w-40 lg:w-80">
                                {title}
                            </p>
                        </div>

                        <div className="flex flex-col details-container gap-2">
                            <div className='flex items-start flex-col'>
                                <span className='text-xs text-gray-500 detail-label'>{detail1Label}</span>
                                <span>{detail1}</span>
                            </div>

                            {
                                detail2 && (
                                    <div className='flex items-start flex-col'>
                                        <span className='text-xs text-gray-500 detail-label'>{detail2Label}</span>
                                        <span>{detail2}</span>
                                    </div>
                                )
                            }
                        </div>

                        <div className="mt-2 text-xs text-gray-700 description-container" style={{ maxWidth: '100%' }}>
                            <p className="break-words line-clamp-2">{description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ContentCard;