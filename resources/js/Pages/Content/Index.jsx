// resources/js/Pages/Content/Index.jsx
import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContentCard from '@/Components/ContentCard'; // Importa el componente generalizado

export default function Index({ content }) {
    const { auth } = usePage().props;

    return (
        <MainLayout auth={auth}>
            <div className="content-index">
                <Head title="Content List" />

                <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                    {content?.map(item => (
                        <ContentCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}