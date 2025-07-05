
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-womens-health-article.ts';
import '@/ai/flows/answer-womens-health-questions.ts';
import '@/ai/flows/submit-qna-review-flow.ts';
import '@/ai/flows/get-reviews-flow.ts';

