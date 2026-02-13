export interface Contact {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    created_at: string;
}

export type CreateContactDTO = Omit<Contact, 'id' | 'created_at'>;

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}
