import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ContactsTable from './components/ContactsTable';
import ContactForm from './components/ContactForm';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-4 md:p-8 font-sans text-foreground">
        <div className="max-w-5xl mx-auto bg-card rounded-xl shadow-lg ring-1 ring-black/5 overflow-hidden">
          <header className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Contact Management</h1>
              <p className="text-blue-100 text-sm mt-2 max-w-md">Manage your professional network efficiently with our intuitive interface.</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold shadow-sm backdrop-blur-sm border border-white/10"
            >
              <PlusCircle size={20} />
              Add Contact
            </button>
          </header>

          <main className="p-4 md:p-8 bg-white dark:bg-gray-800">
            <ContactsTable />
          </main>
        </div>

        {isFormOpen && (
          <ContactForm onClose={() => setIsFormOpen(false)} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
