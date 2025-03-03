import './SearchWithCustomFilter.css'

// Svgs

export default function SearchWithCustomFilter() {
    const categories = [
        { id: 1, name: 'All Listing', icon: ''},
        { id: 2, name: 'Rooms', icon: ''},
        { id: 3, name: 'Roommates', icon: ''},
        { id: 4, name: 'PG', icon: ''},
    ]

    return (
        <div className='s-custom-filter'>
            <div>
                <div>
                    Listing & demas
                </div>
            </div>

            <div>
                    aqui otro algo
            </div>
        </div>
    )
}