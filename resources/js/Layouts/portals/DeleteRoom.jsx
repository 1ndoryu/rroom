import './DeleteRoom.css'
import { createPortal } from "react-dom";

export default function DeleteRoom({ room, isOpen, setIsOpen, handleDelete }) {
    return createPortal(
     <div className={`options-menu-mobile ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}>

        <div className={`options-menu-mobile-cn ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
            <li className='option-item'
                onClick={(e) => {
                    e.preventDefault();
                    handleDelete(room.id)
                }}
                >Delete</li>

                <li className='option-item'
                onClick={(e) => {
                    e.preventDefault();
                }}
                >
                Edit
            </li>
        </div>

     </div>   
   , document.body)
}