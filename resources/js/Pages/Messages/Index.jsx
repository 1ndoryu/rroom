import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ users }) {
    const { auth } = usePage().props;
    return (
        <MainLayout auth={auth}>
            <div className="container p-4 mx-auto">
                <h1 className="mb-4 text-2xl font-bold">Messages</h1>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className="py-2 border-b">
                            <Link href={route('messages.show', { user: user.id })} className="block hover:bg-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-semibold">{user.name}</span>
                                        {user.last_message && (
                                            <p className={`text-sm ${user.last_message.is_sender ? 'text-blue-500' : 'text-gray-600'}`}>
                                                {user.last_message.is_sender ? 'You: ' : ''}{user.last_message.content}
                                            </p>
                                        )}
                                    </div>
                                    {user.last_message && (
                                            <span className="text-xs text-gray-500">{user.last_message.created_at}</span>
                                    )}
                                </div>

                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </MainLayout>
    );
}