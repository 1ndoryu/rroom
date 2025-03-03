import { createPortal } from "react-dom"

export default function SearchBarPortal({ children }) {
    return createPortal(
        children,
        document.getElementById('search-bar-portal')
    )
}