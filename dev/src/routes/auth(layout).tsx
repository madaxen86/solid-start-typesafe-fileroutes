import { ParentProps } from 'solid-js';
//ads
export default function AboutLayout(props: ParentProps) {
  return (
    <main>
      <h1>Auth Layout</h1>
      {props.children}
    </main>
  );
}
