import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Stethoscope } from 'lucide-react';

interface Props {
  visible: boolean;
  isCorrect: boolean;
  explanation: string;
}

const CORRECT_MESSAGES = [
  "Excellent work, analyst!",
  "Well done! Sharp thinking!",
  "Perfect call! You nailed it!",
  "Outstanding! That's the right move!",
  "Spot on! Great analysis!",
];

const WRONG_MESSAGES = [
  "Not quite right. Let me explain...",
  "Close, but not the correct choice.",
  "That's incorrect. Here's why:",
  "Wrong call. Let's review:",
];

function getRandomMessage(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function InstructorFeedback({ visible, isCorrect, explanation }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-[90vw]"
        >
          <div className={`rounded-xl border p-4 bg-white shadow-lg flex items-start gap-4 ${
            isCorrect
              ? 'border-success/40'
              : 'border-destructive/40'
          }`}>
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
              className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${
                isCorrect ? 'bg-success/20' : 'bg-destructive/20'
              }`}
            >
              {isCorrect ? <Stethoscope size={24} className="text-success" /> : <Stethoscope size={24} className="text-destructive" />}
            </motion.div>

            <div className="flex-1 min-w-0">
              {/* Instructor label */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Dr. Claims — Senior Analyst</span>
                {isCorrect ? (
                  <CheckCircle size={14} className="text-success" />
                ) : (
                  <XCircle size={14} className="text-destructive" />
                )}
              </div>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className={`text-sm font-heading font-bold mb-1 ${
                  isCorrect ? 'text-success' : 'text-destructive'
                }`}
              >
                {getRandomMessage(isCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES)}
              </motion.p>

              {/* Explanation */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-xs font-mono text-foreground/80 leading-relaxed"
              >
                {explanation}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
