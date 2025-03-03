// resources/js/Pages/Content/components/SearchWithCustomFilter.jsx
'use client'
import './SearchWithCustomFilter.css';

// Components
import Dropdown from '@/Components/Dropdown';

import IconArrow from '@svgs/IconArrow';
import IconListing from '@svgs/IconListing';
import IconRooms from '@svgs/IconRooms';
import IconPg from '@svgs/IconPg';
import IconRoommates from '@svgs/IconRoommates';
import { useState } from 'react';

export default function SearchWithCustomFilter() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(1);

    const categories = [
        { id: 1, name: 'All Listing', icon: 'listing' },
        { id: 2, name: 'Rooms', icon: 'rooms' },
        { id: 3, name: 'Roommates', icon: 'roommates' },
        { id: 4, name: 'PG', icon: 'pg' },
    ];

    const handleSelectCategory = ({ icon }) => {
        if (icon === 'listing') {
            return <IconListing />;
        }

        if (icon === 'rooms') { 
            return <IconRooms />;
        }

        if (icon === 'roommates') {
            return <IconRoommates />;
        }

        if (icon === 'pg') {
            return <IconPg />;
        }
    }

    return (
        <div className="s-custom-filter">
            <div className="all-filters">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className={`s-custom-container ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        {handleSelectCategory({ icon: category.icon })}
                        <p>{category.name}</p>
                    </div>
                ))}
            </div>

            <Dropdown>
                <Dropdown.Trigger>
                    <div
                        className="s-filter-dropdown"
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}>
                        <div
                            className={`s-filter-trigger ${isOpen ? 'open' : ''}`}
                        >
                            <p>{categories[0].name}</p>
                            <IconArrow />
                        </div>
                    </div>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    {categories.map((category) => (
                        <Dropdown.Link key={category.id}>
                            {category.name}
                        </Dropdown.Link>
                    ))}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
