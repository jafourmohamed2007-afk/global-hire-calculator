import type { Metadata } from 'next';
import { ReviewAdmin } from '@/components/ReviewAdmin';

export const metadata: Metadata = {
  title: 'Review admin',
  robots: { index: false, follow: false },
};

export default function ReviewAdminPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-black tracking-tight text-ink">Review admin</h1>
      <p className="mt-1 text-sm text-slate-600">Approve, hide or delete reviews. Only you can see this page’s data.</p>
      <ReviewAdmin />
    </div>
  );
}
