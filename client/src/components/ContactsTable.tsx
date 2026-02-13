import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Contact } from '../types';
import { Search, Trash2, Phone, Mail, Building } from 'lucide-react';

export default function ContactsTable() {
    const [search, setSearch] = useState('');
    const queryClient = useQueryClient();

    // Fetch Contacts
    const { data: contacts, isLoading, error } = useQuery({
        queryKey: ['contacts', search],
        queryFn: async () => {
            const response = await api.get<Contact[]>(`/contacts?search=${search}`);
            return response.data;
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/contacts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
        },
    });

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            deleteMutation.mutate(id);
        }
    };

    const renderContent = () => {
        if (isLoading) return (
            <div className="flex justify-center items-center py-20 bg-card rounded-lg border border-border mt-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );

        if (error) return (
            <div className="text-destructive p-4 text-center bg-destructive/10 rounded-md mt-6">
                Error loading contacts. Please try again later.
            </div>
        );

        return (
            <div className="mt-6">

                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto rounded-lg border border-border shadow-sm">
                    <table className="min-w-full divide-y divide-border bg-card">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                            {contacts?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No contacts found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                contacts?.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-card-foreground">{contact.name}</div>
                                                    <div className="text-xs text-muted-foreground">Added {new Date(contact.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-1">
                                                {contact.email && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Mail className="h-4 w-4 mr-2" />
                                                        {contact.email}
                                                    </div>
                                                )}
                                                {contact.phone && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        {contact.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Building className="h-4 w-4 mr-2" />
                                                {contact.company || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="text-destructive hover:text-destructive/80 p-2 rounded-full hover:bg-destructive/10 transition-colors"
                                                title="Delete Contact"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="md:hidden space-y-4">
                    {contacts?.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg bg-card/50">
                            No contacts found. Add one to get started.
                        </div>
                    ) : (
                        contacts?.map((contact) => (
                            <div key={contact.id} className="bg-card rounded-lg border border-border shadow-sm p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-card-foreground">{contact.name}</h3>
                                            <p className="text-xs text-muted-foreground">{contact.company || 'No Company'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(contact.id)}
                                        className="text-destructive hover:text-destructive/80 p-2 -mr-2 -mt-2"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="border-t border-border pt-3 space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {contact.email}
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4 mr-2" />
                                            {contact.phone}
                                        </div>
                                    )}
                                    <div className="text-xs text-muted-foreground pt-1">
                                        Added {new Date(contact.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search by name or company..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                />
            </div>

            {renderContent()}
        </div>
    );
}
