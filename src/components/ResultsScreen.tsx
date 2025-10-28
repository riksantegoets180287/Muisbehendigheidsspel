import { motion } from 'framer-motion';
import { Trophy, RefreshCw, UserPlus, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResultsScreenProps {
  firstName: string;
  psNumber: string;
  totalScore: number;
  playTimeSeconds: number;
  completedAt: string;
  onRestart: () => void;
  onNewPerson: () => void;
}

export default function ResultsScreen({
  firstName,
  psNumber,
  totalScore,
  playTimeSeconds,
  completedAt,
  onRestart,
  onNewPerson,
}: ResultsScreenProps) {
  const maxScore = 200;
  const percentage = (totalScore / maxScore) * 100;
  const passed = percentage >= 55;

  useEffect(() => {
    if (passed) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [passed]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadPDF = async () => {
    const element = document.getElementById('results-card');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 20, imgWidth, imgHeight);
    pdf.save(`Muisbehendigheid_${firstName}_${psNumber}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        id="results-card"
      >
        <div className="text-center mb-8">
          {passed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="inline-block mb-4"
            >
              <Trophy className="w-20 h-20 text-yellow-500" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              😞
            </motion.div>
          )}

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {passed ? 'Gefeliciteerd!' : 'Helaas...'}
          </h1>
          <p className="text-xl text-gray-600">
            {passed
              ? 'Je hebt de test succesvol afgerond!'
              : 'Je hebt de slaaggrens niet gehaald.'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Naam:</span>
            <span className="text-gray-900 font-bold">{firstName}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">PS-nummer:</span>
            <span className="text-gray-900 font-bold">{psNumber}</span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Totaal:</span>
            <span className="text-gray-900 font-bold text-2xl">
              {totalScore} / {maxScore}
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Percentage:</span>
              <span
                className={`font-bold text-2xl ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-4 rounded-full ${
                  passed ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Slaaggrens: 55% (110 punten)
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Speeltijd:</span>
            <span className="text-gray-900 font-bold">
              {formatTime(playTimeSeconds)}
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Datum/tijd:</span>
            <span className="text-gray-900 font-bold">
              {new Date(completedAt).toLocaleString('nl-NL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {passed && (
            <button
              onClick={downloadPDF}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Resultaat downloaden (PDF)
            </button>
          )}

          {!passed && (
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Opnieuw spelen
            </button>
          )}

          <button
            onClick={onNewPerson}
            className="w-full bg-slate-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-slate-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Nieuw persoon
          </button>
        </div>
      </motion.div>
    </div>
  );
}
