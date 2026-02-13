import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const savedContacts = pgTable('saved_contacts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone').notNull(),
    company: text('company'),
    created_at: timestamp('created_at').defaultNow(),
});
