import { motion } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <MousePointer2 className="w-16 h-16 text-blue-600" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Muisbehendigheid Test
        </h1>

        <div className="space-y-4 mb-8 text-gray-700">
          <p className="text-lg">
            <strong>Welkom!</strong> In deze test ga je je muisbehendigheid trainen door op een bewegende bal te klikken.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <h3 className="font-semibold mb-2 text-blue-900">Spelregels:</h3>
            <ul className="list-disc list-inside space-y-2 text-blue-800">
              <li>Klik <strong>snel</strong> op de bal binnen 10 seconden</li>
              <li>Hoe sneller je klikt, hoe meer punten je krijgt</li>
              <li>Je hebt <strong>5 levens</strong> (hartjes)</li>
              <li>Bij een verkeerde klik verlies je een leven</li>
            </ul>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
            <h3 className="font-semibold mb-2 text-orange-900">
              Vanaf level 5:
            </h3>
            <p className="text-orange-800">
              <span className="inline-block w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              <strong>Blauw</strong> = linksklik
            </p>
            <p className="text-orange-800 mt-1">
              <span className="inline-block w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
              <strong>Oranje</strong> = rechtsklik
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <h3 className="font-semibold mb-2 text-green-900">Slaaggrens:</h3>
            <p className="text-green-800">
              Je moet minimaal <strong>55%</strong> (110 van 200 punten) halen om te slagen
            </p>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Start level 1
        </button>
      </motion.div>
    </div>
  );
}
