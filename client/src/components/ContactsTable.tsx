import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Contact, PaginatedResponse } from '../types';
import { Search, Trash2, Phone, Mail, Building, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationModal from './ConfirmationModal';

export default function ContactsTable() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(window.innerWidth < 768 ? 2 : 5); 

    useEffect(() => {
        const handleResize = () => {
            setLimit(window.innerWidth < 768 ? 2 : 5);
            setPage(1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    // Fetch Contacts with Pagination
    const { data, isLoading, error } = useQuery({
        queryKey: ['contacts', search, page, limit], 
        queryFn: async () => {
            const response = await api.get<PaginatedResponse<Contact>>(`/contacts?search=${search}&page=${page}&limit=${limit}`);
            return response.data;
        },
        placeholderData: keepPreviousData,
    });

    const contacts = data?.data || [];
    const pagination = data?.pagination;

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/contacts/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            toast.success('Contact deleted successfully');
            setDeleteId(null);
        },
        onError: () => {
            toast.error('Failed to delete contact');
            setDeleteId(null);
        }
    });

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        if (deleteId) {
            deleteMutation.mutate(deleteId);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); 
    };

    const renderContent = () => {
        if (isLoading) return (
            <div className="flex justify-center items-center py-20 bg-card rounded-lg border border-border mt-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );

        if (error) return (
            <div className="text-destructive p-4 text-center bg-destructive/10 rounded-md mt-6 border border-destructive/20">
                <p>Error loading contacts. Please try again later.</p>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['contacts'] })}
                    className="mt-2 text-sm underline hover:text-destructive/80"
                >
                    Retry
                </button>
            </div>
        );

        return (
            <div className="mt-6 space-y-6">
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-hidden rounded-lg border border-border shadow-sm">
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
                            {contacts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        No contacts found. Add one to get started.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
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
                                                        <Mail className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                        {contact.email}
                                                    </div>
                                                )}
                                                {contact.phone && (
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Phone className="h-3.5 w-3.5 mr-2 opacity-70" />
                                                        {contact.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Building className="h-4 w-4 mr-2 opacity-70" />
                                                {contact.company || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDeleteClick(contact.id)}
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

                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4">
                    {contacts.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg bg-card/50">
                            No contacts found. Add one to get started.
                        </div>
                    ) : (
                        contacts.map((contact) => (
                            <div key={contact.id} className="bg-card rounded-lg border border-border shadow-sm p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-card-foreground">{contact.name}</h3>
                                            <p className="text-xs text-muted-foreground">{contact.company || 'No Company'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClick(contact.id)}
                                        className="text-destructive hover:text-destructive/80 p-2 -mr-2 -mt-2"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="border-t border-border pt-3 space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2 opacity-70" />
                                            {contact.email}
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="h-4 w-4 mr-2 opacity-70" />
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

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-border pt-4 px-1">
                        <div className="text-sm text-white">
                            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center bg-background text-foreground shadow-sm"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center bg-background text-foreground shadow-sm"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
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
                    onChange={handleSearchChange}
                    autoFocus
                />
            </div>

            {renderContent()}

            <ConfirmationModal
                isOpen={!!deleteId}
                title="Delete Contact"
                message="Are you sure you want to delete this contact? This action cannot be undone."
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteId(null)}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
