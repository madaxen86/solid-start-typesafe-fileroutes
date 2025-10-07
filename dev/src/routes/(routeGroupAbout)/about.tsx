import { A, createAsync } from '@solidjs/router';
import { onMount, Suspense } from 'solid-js';
import Counter from '~/components/Counter';

export const getTime = async () => {
  'use server';
  return new Date().toLocaleTimeString();
};

export default function About() {
  const time = createAsync(() => getTime());
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">About Page</h1>
      <p>
        Time:
        <Suspense>{time()}</Suspense>
      </p>
    </main>
  );
}
