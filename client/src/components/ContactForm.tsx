import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { X, Save, AlertCircle } from 'lucide-react';

// Validation Schema
const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ContactFormProps {
    onClose: () => void;
}

export default function ContactForm({ onClose }: ContactFormProps) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            await api.post('/contacts', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contacts'] });
            onClose();
        },
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-card rounded-lg shadow-2xl border border-border animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                    <h2 className="text-xl font-semibold">Add New Contact</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name *</label>
                        <input
                            {...register('name')}
                            className={`flex h-10 w-full rounded-md border ${errors.name ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" /> {errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                        <input
                            {...register('email')}
                            className={`flex h-10 w-full rounded-md border ${errors.email ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" /> {errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone *</label>
                        <input
                            {...register('phone')}
                            className={`flex h-10 w-full rounded-md border ${errors.phone ? 'border-destructive' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                            placeholder="+1234567890"
                        />
                        {errors.phone && <p className="text-xs text-destructive flex items-center mt-1"><AlertCircle className="h-3 w-3 mr-1" /> {errors.phone.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Company</label>
                        <input
                            {...register('company')}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Acme Inc."
                        />
                    </div>

                    {mutation.isError && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Failed to save contact.
                        </div>
                    )}

                    <div className="flex justify-end pt-4 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        >
                            {mutation.isPending ? 'Saving...' : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Contact
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
