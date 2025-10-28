import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginDialogProps {
  onLogin: (firstName: string, psNumber: string) => void;
}

export default function LoginDialog({ onLogin }: LoginDialogProps) {
  const [firstName, setFirstName] = useState('');
  const [psNumber, setPsNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      setError('Voornaam is verplicht');
      return;
    }

    if (!psNumber.trim()) {
      setError('PS-nummer is verplicht');
      return;
    }

    onLogin(firstName.trim(), psNumber.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Muisbehendigheid Test
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Voornaam *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Voer je voornaam in"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="psNumber" className="block text-sm font-medium text-gray-700 mb-1">
              PS-nummer *
            </label>
            <input
              id="psNumber"
              type="text"
              value={psNumber}
              onChange={(e) => {
                setPsNumber(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Voer je PS-nummer in"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 text-sm"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Verder
          </button>
        </form>
      </motion.div>
    </div>
  );
}
