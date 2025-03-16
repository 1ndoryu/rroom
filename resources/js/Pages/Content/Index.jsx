import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContentCard from '@/Components/ContentCard';
import SearchWithCustomFilter from './components/SearchWithCustomFilter';

export default function Index({ content, filterGender, filterCities, filterMinPrice, filterMaxPrice }) {
    const { auth, searchTerm, filterCategory } = usePage().props;

    console.log("Index - Props Received:", { content, filterGender, filterCities, filterMinPrice, filterMaxPrice, auth, searchTerm, filterCategory });

    return (
        <MainLayout auth={auth}>
            <Head title="Content List" />

            <SearchWithCustomFilter
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterGender={filterGender}
                filterCities={filterCities}
                filterMinPrice={filterMinPrice}
                filterMaxPrice={filterMaxPrice}
            />

            <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                {content?.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </MainLayout>
    );
}
