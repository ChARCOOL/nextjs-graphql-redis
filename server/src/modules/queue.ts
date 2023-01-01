import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import ModGenerate from './generate';

const QUEUE_NAME = 'default';

if (!process.env.REDIS_URL) {
  console.warn('Missing REDIS_URL');
}
const connection = new Redis(process.env.REDIS_URL as string);

export const queue = new Queue(QUEUE_NAME, { connection });

new Worker(
  QUEUE_NAME,
  async (job) => {
    if (job.name === 'generateSubmissions') {
      const submission = await ModGenerate.submission();
      console.log('Generated submission', submission);
    }
  },
  { connection }
);

type JobName = 'generateSubmissions';

export const enqueue = async (name: JobName, data?: any) => {
  await queue.add(name, data);
};
