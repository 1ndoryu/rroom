// resources/js/Components/MyRoomCard.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import './prev-css/MyRoomCard.css';

// Components
import DeleteRoom from '@/Layouts/portals/DeleteRoom';

function MyRoomCard({ room }) {
    const firstImageUrl = room.imageUrls?.[0];

    // Estados para controlar el estado del modal de opciones
    const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);

    const goToRoom = (id, e) => {
        e.preventDefault()
        const url = route('content.show', { type: 'room', id: id })
        console.log(url);
        window.location.href = url
    }

    const handleOpenOptions = (e) => {
        e.stopPropagation()
        e.preventDefault()

        setIsOptionsOpen(!isOptionsOpen)
        console.log('tu mama me llama xddd')
    }

    return (
        <div className="relative transition-all duration-200 transform bg-white border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg max-w-[750px]">
                {/* Image Container */}
            <Link onClick={(e) => goToRoom(room.id, e)}>
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
                        <div className="flex items-center justify-between w-full user-info" onClick={(e) => {handleOpenOptions(e)}}>
                            <p className="text-base truncate max-w-[170px] md:text-lg text-gray-600 font-medium">
                                {room.address}
                            </p>

                            {/* Modal para las opciones */}
                            <div className='w-6 h-6 hover:bg-[#f0f0f0] flex items-center justify-center rounded-full relative'>
                                <i className='fa-solid fa-ellipsis'></i>

                                <ul className={`options-menu ${isOptionsOpen ? 'active' : ''}`}
                                    onClick={(e) => e.stopPropagation()}
                                    >
                                    <li className='w-full text-start px-3 py-1.5 border-b-[1px] border-b-[#dbdbdb] text-[.9rem] text-[#ff5353] hover:bg-[#f0f0f0]'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(room.id)
                                    }}
                                    >Delete</li>
                                    <li className='w-full text-start px-3 py-1.5 text-[.9rem] hover:bg-[#f0f0f0]'
                                    onClick={(e) => {
                                        e.preventDefault();
                                    }}
                                    >Edit</li>
                                </ul>
                            </div>
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
            <DeleteRoom room={room} isOpen={isOptionsOpen} setIsOpen={setIsOptionsOpen} handleDelete={handleDelete}/>
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