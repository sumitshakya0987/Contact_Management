import { Router } from 'express';
import { db } from '../db';
import { savedContacts } from '../db/schema';
import { eq, ilike, or, desc } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Zod Schema for validation
const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().optional(),
});

// GET /api/contacts - List all contacts (with search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;

        let query = db.select().from(savedContacts).orderBy(desc(savedContacts.created_at));

        if (search && typeof search === 'string') {
            const searchTerm = `%${search}%`;
            // @ts-ignore
            query = db.select().from(savedContacts).where(
                or(
                    ilike(savedContacts.name, searchTerm),
                    ilike(savedContacts.company, searchTerm)
                )
            ).orderBy(desc(savedContacts.created_at));
        }

        const contacts = await query;
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// POST /api/contacts - Add a new contact
router.post('/', async (req, res) => {
    try {
        const validatedData = contactSchema.parse(req.body);

        const newContact = await db.insert(savedContacts).values(validatedData).returning();
        res.status(201).json(newContact[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.issues });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Failed to create contact' });
        }
    }
});

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        await db.delete(savedContacts).where(eq(savedContacts.id, Number(id)));
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

export default router;
