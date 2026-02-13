export interface Contact {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    created_at: string;
}

export type CreateContactDTO = Omit<Contact, 'id' | 'created_at'>;
