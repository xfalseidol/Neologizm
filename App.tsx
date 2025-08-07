import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductSection } from './components/ProductSection';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Chemical, Synchronicity } from './types';
import { generateChemicals } from './services/geminiService';

// --- Component: SynchronicityLog ---
interface SynchronicityLogProps {
  id: string;
  synchronicities: Synchronicity[];
}
const SynchronicityLog: React.FC<SynchronicityLogProps> = ({ id, synchronicities }) => {
  return (
    <section id={id} className="container mx-auto px-4 md:px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold font-roboto-mono text-center mb-12 md:mb-16 text-green-400">
        // Synchronicity Log
      </h2>
      {synchronicities.length > 0 ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          {synchronicities.map((sync) => (
            <div key={sync.id} className="border border-gray-800 bg-gray-900/30 p-6 rounded-lg">
              <h3 className="font-roboto-mono text-xl text-green-300">{sync.title}</h3>
              <p className="mt-4 whitespace-pre-wrap text-gray-300">{sync.story}</p>
              {sync.submitter && <p className="mt-4 text-right text-sm text-gray-500">- {sync.submitter}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
            <p className="text-lg">Log is empty. No anomalies reported yet.</p>
            <p>Be the first to contribute to the archive.</p>
        </div>
      )}
    </section>
  );
};

// --- Component: SynchronicityForm ---
interface SynchronicityFormProps {
  id: string;
  onSubmit: (synchronicity: Omit<Synchronicity, 'id'>) => void;
}
const SynchronicityForm: React.FC<SynchronicityFormProps> = ({ id, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !story) return;

    setIsSubmitting(true);
    // Simulate network delay
    setTimeout(() => {
      onSubmit({ title, story, submitter });
      setTitle('');
      setStory('');
      setSubmitter('');
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000); // Reset submitted message
    }, 1000);
  };

  return (
    <section id={id} className="container mx-auto px-4 md:px-6 py-16 bg-gray-950/50 border-t border-b border-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-roboto-mono text-center mb-8 text-green-400">
          // Report Anomalous Synchronicity
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-roboto-mono text-gray-400 mb-2">Event Title / Subject</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="e.g., The Recurring Number"
            />
          </div>
          <div>
            <label htmlFor="story" className="block text-sm font-roboto-mono text-gray-400 mb-2">Describe the Anomaly</label>
            <textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              required
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="Detail the sequence of events, perceived connections, and context..."
            ></textarea>
          </div>
           <div>
            <label htmlFor="submitter" className="block text-sm font-roboto-mono text-gray-400 mb-2">Handle / Alias (Optional)</label>
            <input
              type="text"
              id="submitter"
              value={submitter}
              onChange={(e) => setSubmitter(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="e.g., Observer_734"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="font-roboto-mono uppercase tracking-widest py-3 px-12 border border-green-400 text-green-400 rounded-sm hover:bg-green-400 hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : submitted ? 'Log Entry Received' : 'Submit to Archive'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const sampleSynchronicities: Synchronicity[] = [
    {
        id: 'sync-1',
        title: 'The Bookstore Echo',
        story: 'I was thinking intensely about a very obscure 17th-century philosopher for a research paper. I took a break and walked into a used bookstore I had never visited before. The first book I saw, placed spine-up on a table by the door, was a rare edition of a book by that same philosopher. It felt like the universe was answering my thoughts.',
        submitter: 'Observer_42'
    },
    {
        id: 'sync-2',
        title: 'Streetlight Manifestation',
        story: 'My friend and I were joking about having minor superpowers. For fun, I pointed at a streetlight ahead and said "I can turn that off with my mind". The instant my finger was fully extended, the light flickered and went out. We both stood there in stunned silence. It came back on a minute later.',
        submitter: 'J.P.'
    }
];

const App: React.FC = () => {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [synchronicities, setSynchronicities] = useState<Synchronicity[]>(sampleSynchronicities);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChemicals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const chemicalResults = await generateChemicals(6);
      setChemicals(chemicalResults);
    } catch (err) {
      console.error("Failed to generate chemicals:", err);
      setError("Failed to connect with the neuro-fabrication unit. Please check your API key and refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChemicals();
  }, [fetchChemicals]);

  const handleSynchronicitySubmit = (newSynchronicity: Omit<Synchronicity, 'id'>) => {
    const submission: Synchronicity = {
      ...newSynchronicity,
      id: `sync-${Date.now()}`
    };
    setSynchronicities(prev => [submission, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow pt-20"> {/* Add padding top for fixed header */}
        <Hero />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-green-300 font-roboto-mono">Calibrating Neuro-Fabricators...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 px-4">
            <p className="text-2xl text-red-400 font-roboto-mono">Connection Error</p>
            <p className="mt-2 text-gray-300">{error}</p>
          </div>
        ) : (
          <ProductSection id="chem-lab" title="Compound Catalog" chemicals={chemicals} />
        )}

        <SynchronicityLog id="synchro-log" synchronicities={synchronicities} />
        <SynchronicityForm id="submit" onSubmit={handleSynchronicitySubmit} />

      </main>
      <Footer />
    </div>
  );
};

export default App;