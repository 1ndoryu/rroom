// resources/js/Components/MyRoomCard.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

function MyRoomCard({ room }) {
    const firstImageUrl = room.imageUrls?.[0];

    return (
        <div className="relative transition-all duration-200 transform bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 max-w-[750px]">
            <Link href={route('content.show', { type: 'room', id: room.id })}>
                {/* Image Container */}
                <div className="flex">
                    <div
                        className="relative w-1/2 image-container bg-slate-100"
                        style={{ borderRadius: '5px 0px 0px', overflow: 'hidden' }}
                    >
                        <div className="relative h-full image-wrapper" style={{ paddingBottom: '100%' }}>
                            {firstImageUrl ? (
                                <img
                                    alt={room.address}
                                    src={firstImageUrl}
                                    className="absolute inset-0 object-cover w-full h-full"
                                    style={{ borderRadius: '0px 0px 0px 5px' }}
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* Info Container */}
                    <div className="text-wrapper py-3 px-5 relative h-full flex flex-col justify-start items-start gap-0.5 w-full">
                        {/* Line 1 */}
                        <div className="flex items-center justify-between w-full user-info">
                            <p className="text-base truncate max-w-[170px] md:text-lg text-gray-600 font-medium">
                                {room.address}
                            </p>
                        </div>

                        {/* Line 2 */}
                         <div className="flex items-start gap-1 pb-4 -ml-1 text-xs text-gray-500 location lg:text-sm">
                            <p className="w-40 p-[3px] text-xs truncate sm:w-80 md:w-40 lg:w-80">
                                 {room.user?.name ?? room.user?.username ?? 'Unknown User'}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="flex flex-row gap-4 details-container">
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500 detail-label">Rent</span>
                                <span className="flex items-center pt-1 space-x-1 text-sm font-medium text-gray-600 lg:order-2 whitespace-nowrap">
                                    ₹{room.rent}
                                </span>
                            </div>
                            {room.preferred_gender && (
                                <div className="flex flex-col items-start">
                                    <span className="text-xs text-gray-500 detail-label">Preferred Gender</span>
                                    <span className="flex items-center pt-1 space-x-1 text-sm font-medium text-gray-600 lg:order-2 whitespace-nowrap">
                                        {room.preferred_gender}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-2 text-xs text-gray-700 description-container" style={{ maxWidth: '100%' }}>
                            <p className="break-words line-clamp-2">{room.description}</p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="absolute flex space-x-2 bottom-2 right-2">
                <Link href={route('rooms.edit', room.id)} className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
                    Edit
                </Link>
                <button onClick={() => handleDelete(room.id)} className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600">
                    Delete
                </button>
            </div>
        </div>
    );

    function handleDelete(roomId) {
        if (confirm('Are you sure you want to delete this room?')) {
            // Inertia visit for DELETE request
            Inertia.delete(route('rooms.destroy', roomId), {
                onSuccess: () => {
                    console.log("MyRoomCard - handleDelete - Room deleted successfully");
                },
                onError: (errors) => {
                    console.error("MyRoomCard - handleDelete - Error deleting room:", errors);
                },
            });
        }
    }
}

export default MyRoomCard;