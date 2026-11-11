import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageShellProps {
  readonly title: string;
  readonly intro?: ReactNode;
  readonly updated?: string;
  readonly breadcrumb?: { readonly href: string; readonly label: string };
  readonly children: ReactNode;
}

/** Layout for text pages (guides index, about, legal pages). */
export function PageShell({ title, intro, updated, breadcrumb, children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="pt-4">
        <ol className="flex flex-wrap items-center gap-x-1.5 text-sm text-slate-500">
          <li>
            <Link href="/" className="inline-flex min-h-12 items-center hover:text-brand-700 hover:underline">
              Home
            </Link>
          </li>
          {breadcrumb && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={breadcrumb.href}
                  className="inline-flex min-h-12 items-center hover:text-brand-700 hover:underline"
                >
                  {breadcrumb.label}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>
      <header className="pb-6 pt-2">
        <h1 className="text-balance text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
        {intro && <div className="mt-3 text-pretty text-lg text-slate-600">{intro}</div>}
        {updated && <p className="mt-3 text-sm text-slate-500">Last updated: {updated}</p>}
      </header>
      {children}
    </div>
  );
}
