
"use client";

import type { QuizQuestion } from '@/lib/quizData';
import { allQuizQuestions } from '@/lib/quizData';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type SelectedAnswers = Record<number, string>; // question.id -> selectedOptionKey ('a', 'b', 'c', 'd')
type QuizStatus = 'loading' | 'active' | 'submitted';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const QUESTIONS_PER_QUIZ = 20;

export function QuizSection() {
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('loading');
  const [score, setScore] = useState<number>(0);

  const loadNewQuiz = useCallback(() => {
    setQuizStatus('loading');
    setSelectedAnswers({});
    setScore(0);
    // Ensure this runs client-side
    const shuffled = shuffleArray(allQuizQuestions);
    setCurrentQuestions(shuffled.slice(0, QUESTIONS_PER_QUIZ));
    setQuizStatus('active');
  }, []);

  useEffect(() => {
    loadNewQuiz();
  }, [loadNewQuiz]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitQuiz = () => {
    let currentScore = 0;
    currentQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answer) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setQuizStatus('submitted');
  };

  if (quizStatus === 'loading' || currentQuestions.length === 0) {
    return (
      <Card className="w-full shadow-xl bg-card text-right" dir="rtl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <HelpCircle size={30}/>
            اختبري معلوماتكِ الصحية
          </CardTitle>
          <CardDescription>جاري تحميل الأسئلة...</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2 p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl bg-card text-right" dir="rtl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl sm:text-3xl font-bold text-primary flex items-center justify-center gap-2">
         <HelpCircle size={30}/>
          اختبري معلوماتكِ الصحية
        </CardTitle>
        <CardDescription>
          {quizStatus !== 'submitted' 
            ? `أجيبي على ${QUESTIONS_PER_QUIZ} سؤالاً لتقييم معرفتك.`
            : `نتيجتكِ في هذا الاختبار:`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {quizStatus === 'submitted' && (
          <Alert variant="default" className="mb-6 bg-primary/10 border-primary text-primary">
            <Trophy className="h-6 w-6 !text-primary ml-2" />
            <AlertTitle className="text-xl font-bold">النتيجة النهائية</AlertTitle>
            <AlertDescription className="text-lg">
              لقد حصلتِ على {score} من {QUESTIONS_PER_QUIZ} إجابات صحيحة!
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {currentQuestions.map((q, index) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.answer;
            const optionKeys = Object.keys(q.options) as (keyof QuizQuestion['options'])[];

            return (
              <Card key={q.id} className={`p-4 border rounded-lg ${quizStatus === 'submitted' ? (isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-border'}`}>
                <p className="font-semibold text-lg mb-3">
                  السؤال {index + 1}: {q.question}
                </p>
                <RadioGroup
                  value={userAnswer}
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                  disabled={quizStatus === 'submitted'}
                  className="space-y-2"
                >
                  {optionKeys.map((key) => {
                    const optionText = q.options[key];
                    let labelClassName = "text-foreground/90";
                    let indicatorIcon = null;

                    if (quizStatus === 'submitted') {
                      if (key === q.answer) { // Correct option
                        labelClassName = "font-bold text-green-700 dark:text-green-400";
                        indicatorIcon = <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2" />;
                      } else if (key === userAnswer && !isCorrect) { // User's incorrect choice
                        labelClassName = "font-bold text-red-700 dark:text-red-400 line-through";
                        indicatorIcon = <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 mr-2" />;
                      }
                    }

                    return (
                      <div key={key} className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value={key} id={`${q.id}-${key}`} />
                        <Label htmlFor={`${q.id}-${key}`} className={`flex-1 cursor-pointer ${labelClassName} flex items-center`}>
                          {indicatorIcon}
                          <span className="mr-1 font-medium">{key.toUpperCase()}:</span> <span className="mr-1">{optionText}</span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
                {quizStatus === 'submitted' && !isCorrect && userAnswer && (
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-500 font-medium">
                    الإجابة الصحيحة: {q.options[q.answer]}
                  </p>
                )}
                 {quizStatus === 'submitted' && !userAnswer && (
                  <p className="mt-2 text-sm text-orange-600 dark:text-orange-400 font-medium">
                    لم يتم اختيار إجابة لهذا السؤال. الإجابة الصحيحة: {q.options[q.answer]}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {quizStatus !== 'submitted' ? (
            <Button 
              onClick={handleSubmitQuiz} 
              className="font-bold text-lg py-3 px-6 h-auto"
              disabled={Object.keys(selectedAnswers).length !== currentQuestions.length}
            >
              إرسال الإجابات
            </Button>
          ) : (
            <Button onClick={loadNewQuiz} variant="outline" className="font-bold text-lg py-3 px-6 h-auto border-primary text-primary hover:bg-primary/10">
              <RotateCcw className="ml-2 h-5 w-5" />
              ابدئي اختبارًا جديدًا
            </Button>
          )}
        </div>
        {quizStatus !== 'submitted' && Object.keys(selectedAnswers).length !== currentQuestions.length && (
            <p className="text-center text-sm text-muted-foreground mt-3">
                الرجاء الإجابة على جميع الأسئلة قبل الإرسال.
            </p>
        )}
      </CardContent>
    </Card>
  );
}

    