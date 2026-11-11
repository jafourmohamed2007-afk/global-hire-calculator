import type { Metadata } from 'next';
import Link from 'next/link';
import { ReviewsSection } from '@/components/ReviewsSection';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Reviews',
  description: `Real reviews of ${SITE_NAME} from founders, HR teams and hiring managers — and a form to add your own.`,
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
  return (
    <div className="pb-4">
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <Link href="/" className="inline-flex min-h-12 items-center text-sm text-slate-500 hover:text-brand-700 hover:underline">
          ← Home
        </Link>
      </nav>
      <div className="-mt-8">
        <ReviewsSection headingLevel="h1" formOpen />
      </div>
      <p className="mx-auto mt-8 w-full max-w-6xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6">
        Every review comes from a real visitor and is published with their permission. We publish all ratings, positive
        and negative. Reviews containing links, contact details or offensive language are checked by hand before they
        appear. We never pay for or write reviews.
      </p>
    </div>
  );
}
