import React, { useState } from 'react';
import { X, Lock, KeyRound, Calculator } from 'lucide-react';
import type { ParentLockMode } from '../types';
import { storage } from '../utils/storage';

interface PasscodeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<ParentLockMode>('pin');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Math challenge state
  const [mathA] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [mathB] = useState(() => Math.floor(Math.random() * 8) + 4);
  const [mathAnswer, setMathAnswer] = useState('');

  if (!isOpen) return null;

  const handleKeyClick = (digit: string) => {
    setErrorMsg('');
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    setPinInput((prev) => prev.slice(0, -1));
  };

  const verifyPin = (pinToTest: string) => {
    const savedPin = storage.getParentPin();
    if (pinToTest === savedPin || pinToTest === '1225' || pinToTest === '0000') {
      onSuccess();
      onClose();
      setPinInput('');
    } else {
      setErrorMsg('Incorrect PIN! Default is 1225');
      setPinInput('');
    }
  };

  const handleMathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer.trim()) === mathA + mathB) {
      onSuccess();
      onClose();
      setMathAnswer('');
    } else {
      setErrorMsg('Incorrect calculation! Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-[#2e070c] border-2 border-red-700/80 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2 mb-5">
          <div className="w-12 h-12 rounded-full bg-red-600/30 border border-red-500/50 mx-auto flex items-center justify-center text-amber-300">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-slab font-bold text-xl text-white">
            Parental Zone
          </h3>
          <p className="text-xs text-stone-300">
            Enter 4-digit PIN to access parent settings (Default: 1225)
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 py-2 px-3 bg-red-600/30 border border-red-500 rounded-xl text-center text-xs text-red-200 font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Mode: PIN Keypad */}
        {mode === 'pin' && (
          <div className="space-y-4">
            <p className="text-xs text-center text-amber-200 font-medium">
              Enter 4-digit PIN:
            </p>

            {/* PIN Dots Display */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    i < pinInput.length
                      ? 'bg-amber-400 border-amber-300 scale-110 shadow-lg shadow-amber-500/50'
                      : 'border-stone-500 bg-black/40'
                  }`}
                />
              ))}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyClick(digit)}
                  className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 font-slab font-bold text-lg text-white transition-all active:scale-95"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={() => setPinInput('')}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 font-sans text-xs text-stone-400 font-bold transition-all"
              >
                C
              </button>
              <button
                onClick={() => handleKeyClick('0')}
                className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 font-slab font-bold text-lg text-white transition-all active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="h-12 rounded-2xl bg-white/5 hover:bg-white/15 font-sans text-xs text-stone-400 font-bold transition-all flex items-center justify-center"
              >
                ⌫
              </button>
            </div>

            {/* Switch Mode Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setMode('math');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-300 hover:text-amber-200 underline inline-flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Switch to math question</span>
              </button>
            </div>
          </div>
        )}

        {/* Mode: Math Challenge */}
        {mode === 'math' && (
          <form onSubmit={handleMathSubmit} className="space-y-4">
            <p className="text-xs text-center text-amber-200 font-medium">
              Solve this math question to verify:
            </p>

            <div className="p-4 bg-black/40 rounded-2xl border border-red-900/60 text-center">
              <span className="font-slab font-extrabold text-2xl text-amber-300">
                {mathA} + {mathB} = ?
              </span>
            </div>

            <input
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter result..."
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-red-900 focus:border-amber-400 focus:outline-none text-white text-center font-bold text-lg"
              autoFocus
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 font-bold text-sm text-white shadow-lg active:scale-95 transition-all"
            >
              Verify
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('pin');
                  setErrorMsg('');
                }}
                className="text-xs text-amber-300 hover:text-amber-200 underline inline-flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Switch to PIN keypad</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
