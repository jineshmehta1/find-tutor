"use client";

import { useState } from "react";
import {
    BookOpen, Check, X, Award, Loader2, Sparkles, HelpCircle,
    ChevronRight, ArrowRight, Play, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

const MATH_QUIZ: QuizQuestion[] = [];

export default function StudentPracticePage() {
    const [quiz, setQuiz] = useState<QuizQuestion[]>(MATH_QUIZ);
    const [started, setStarted] = useState(false);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const handleAnswer = (idx: number) => {
        setSelected(idx);
    };

    const handleNext = () => {
        if (selected === null) return;
        if (selected === quiz[current].correctAnswer) {
            setScore(prev => prev + 1);
        }
        if (current + 1 < quiz.length) {
            setCurrent(prev => prev + 1);
            setSelected(null);
        } else {
            setFinished(true);
        }
    };

    const handleReset = () => {
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setFinished(false);
        setStarted(false);
    };

    return (
        <div className="space-y-8 pb-12 p-6 sm:p-8 bg-slate-50 min-h-[calc(100vh-70px)] font-sans">
            {/* Header */}
            <div className="bg-[#ffb800] p-6 sm:p-10 rounded-3xl text-slate-950 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/10 text-slate-900 text-xs font-bold rounded-full border border-slate-950/10">
                        <Award className="w-3.5 h-3.5" />
                        <span>Self Assessment</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Mock Test & Practice Hub</h1>
                    <p className="text-xs sm:text-sm text-slate-900/85 font-medium max-w-xl">
                        Assess your skills with interactive chapter-wise mini quizzes across science and mathematics.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
                {quiz.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        No practice tests uploaded yet
                    </div>
                ) : !started ? (
                    <div className="text-center py-8 space-y-6">
                        <div className="text-5xl">📝</div>
                        <div className="space-y-2">
                            <h3 className="text-base font-black text-slate-800">Quick Practice Test: Mathematics Basics</h3>
                            <p className="text-xs text-slate-400 font-medium">{quiz.length} Multiple Choice Questions · Syllabus: Algebra & Logic</p>
                        </div>
                        <button onClick={() => setStarted(true)}
                            className="px-8 py-3 bg-[#ffb800] hover:bg-[#ffa000] text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 mx-auto shadow-sm">
                            <Play className="w-4 h-4 text-amber-300 fill-current" /> Start Quiz
                        </button>
                    </div>
                ) : finished ? (
                    <div className="text-center py-8 space-y-6">
                        <div className="text-5xl">🏆</div>
                        <div className="space-y-2">
                            <h3 className="text-base font-black text-slate-800">Quiz Completed!</h3>
                            <p className="text-xs text-slate-500 font-bold">Your Score: <span className="text-[#ffb800] font-black">{score} / {quiz.length}</span></p>
                        </div>
                        <button onClick={handleReset}
                            className="px-6 py-2.5 bg-[#ffb800] hover:bg-[#ffa000] text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 mx-auto shadow-sm">
                            <RefreshCw className="w-4 h-4" /> Reset Practice
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
                            <span>Question {current + 1} of {quiz.length}</span>
                            <span>Score: {score}</span>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-slate-850 leading-relaxed">{quiz[current].question}</h4>
                            <div className="grid grid-cols-1 gap-2.5">
                                {quiz[current].options.map((opt, idx) => (
                                    <button key={opt} onClick={() => handleAnswer(idx)}
                                        className={`w-full text-left p-4 rounded-2xl border text-xs font-bold transition-all ${
                                            selected === idx
                                                ? "bg-[#ffb800] text-white border-transparent"
                                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100/50"
                                        }`}>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={handleNext} disabled={selected === null}
                            className="w-full py-3.5 bg-[#ffb800] hover:bg-[#ffa000] disabled:opacity-50 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md mt-4">
                            <span>Next Question</span> <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
