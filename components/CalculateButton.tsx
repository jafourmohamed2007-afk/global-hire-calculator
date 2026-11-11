'use client';

import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';

/**
 * Header call-to-action. Scrolls to the calculator on the current page (homepage selector or
 * corridor calculator); on pages without one it opens the homepage calculator.
 */
export function CalculateButton() {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById('calculator');
    if (!target) {
      event.preventDefault();
      router.push('/#calculator');
      return;
    }
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    const firstControl = target.querySelector<HTMLElement>('select, input');
    firstControl?.focus({ preventScroll: true });
    history.replaceState(null, '', '#calculator');
  }

  return (
    <a
      href="/#calculator"
      onClick={handleClick}
      className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
    >
      Calculate cost
    </a>
  );
}
