// resources/js/Components/RoomCard.jsx
import React from 'react';

function RoomCard({ room }) {
    const user = room.user;
    const firstImageUrl = room.imageUrls?.[0];

    return (
        <div key={room.id} className="relative transition duration-200 transform bg-white border border-gray-200 rounded-lg cursor-pointer room-card ">
            <div className="flex">
                <div className="image-container relative w-[300px] bg-slate-100" style={{ borderRadius: '5px 0px 0px', overflow: 'hidden' }}>
                    <div className="relative image-wrapper" style={{ paddingBottom: '100%' }}>
                        {firstImageUrl ? (
                            <img
                                alt={room.address}
                                src={firstImageUrl}
                                className="absolute inset-0 object-cover w-full h-full"
                            />
                        ) : null}
                    </div>
                </div>

                <div className="text-wrapper py-3 px-5 relative h-full flex flex-col justify-start items-start gap-0.5 w-full">
                    <div className="flex items-center space-x-1 user-info">
                        <p className="text-base truncate max-w-[170px] md:text-lg text-gray-600 font-medium">
                            {user ? (user.name ? user.name : user.username) : 'Unknown User'}
                        </p>
                    </div>

                    <div className="flex items-start gap-1 pb-4 -ml-1 text-xs text-gray-500 location lg:text-sm">
                        <p className="w-40 p-[3px] text-xs truncate sm:w-80 md:w-40 lg:w-80">
                            {room.address}
                        </p>
                    </div>

                    <div className="flex details-container">
                        <div className="rent-container flex flex-col lg:flex-row items-start gap-1.5 lg:gap-0 text-xs lg:text-sm text-gray-600 font-medium lg:pb-2 w-full w-max">
                            <p className="flex w-full gap-1 lg:w-auto lg:pr-6 xl:pr-10 lg:flex-col">
                                <span className="flex items-center space-x-1 text-sm font-medium lg:order-2 whitespace-nowrap">
                                    <span>₹{room.rent}</span>
                                    <span className="text-xs font-light text-gray-500 lg:hidden">Rent</span>
                                </span>
                                <span className="hidden text-xs font-light text-gray-500 lg:block">Rent</span>
                            </p>
                        </div>

                        <div className="gender-container flex flex-col lg:flex-row items-start gap-1.5 lg:gap-0 text-xs lg:text-sm text-gray-600 font-medium lg:pb-2 w-max">
                            <p className="flex w-full gap-1 lg:w-auto lg:pr-6 xl:pr-10 lg:flex-col">
                                <span className="flex items-center space-x-1 text-sm font-medium lg:order-2 whitespace-nowrap">
                                    <span>{room.preferred_gender}</span>
                                    <span className="text-xs font-light text-gray-500 lg:hidden">Preferred Gender</span>
                                </span>
                                <span className="hidden text-xs font-light text-gray-500 lg:block">Preferred Gender</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-700 description-container"
                        style={{ maxWidth: '100%' }}>
                        <p className="break-words line-clamp-2">{room.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomCard;