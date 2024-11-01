import { ParentProps } from 'solid-js';

export default function SomeLayout(p: ParentProps) {
  return (
    <main>
      <h1>HEADER OOO</h1>
      {p.children}
    </main>
  );
}
