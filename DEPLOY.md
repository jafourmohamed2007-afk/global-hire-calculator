# Putting the site online (Vercel + Namecheap + Google Search Console)

The code is on GitHub in `jafourmohamed2007-afk/global-hire-calculator`, branch `ccr-41710c6e-jb9dfb`.

## 1. Vercel (hosting)

1. Go to vercel.com and sign up with your GitHub account.
2. **Add New → Project**, pick `global-hire-calculator`, press **Deploy**. Vercel detects Next.js by itself.
3. In the project, open **Settings → Git** and check that **Production Branch** is `ccr-41710c6e-jb9dfb`
   (it is the only branch, so it should already be selected).
4. **Storage → Create → Upstash for Redis** (free), then **Connect** it to this project. This is where reviews are saved.
5. **Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
   | `NEXT_PUBLIC_CONTACT_EMAIL` | `contact@yourdomain.com` |
   | `REVIEWS_ADMIN_TOKEN` | a long password (16+ characters) for `/admin/reviews` |
   | `REVIEWS_HASH_SALT` | any random text |

6. **Deployments → ⋯ → Redeploy** so the settings take effect.

> Vercel's free **Hobby** plan is for non-commercial use only. A site with ads is commercial, so switch to **Pro**
> before turning ads on (or host on a provider whose free plan allows commercial use).

## 2. Namecheap (domain + email)

1. Buy your domain. Make sure **Domain Privacy** is **on** (free) so your name and address are hidden from the public.
2. In Vercel: **Settings → Domains → Add** `yourdomain.com` (accept adding `www` too). Vercel shows the DNS records to add.
3. In Namecheap: **Domain List → Manage → Advanced DNS**. Delete the parking records, then add exactly what Vercel shows
   (usually an **A record** for `@` and a **CNAME** for `www`). It can take from minutes to a few hours to work.
4. Free contact email: in Namecheap **Domain List → Manage → Redirect Email** (email forwarding), forward
   `contact@yourdomain.com` to your personal inbox. Your personal address is never shown on the site.

## 3. Google Search Console (getting into Google)

1. Go to search.google.com/search-console → **Add property** → **Domain** → type `yourdomain.com`.
2. Google shows a **TXT record**. In Namecheap **Advanced DNS** add a **TXT Record**, Host `@`, Value = that text. Save.
3. Back in Search Console press **Verify** (if it fails, wait an hour and try again).
4. **Sitemaps** → type `sitemap.xml` → **Submit**.
5. **URL inspection** → paste your homepage address → **Request indexing**. Repeat for `/blog` and a few guides.
6. Indexing takes days to a few weeks. When your pages appear in Google, apply for AdSense (see README).

## After AdSense approval

1. Add `NEXT_PUBLIC_ADSENSE_CLIENT` = your `ca-pub-…` ID in Vercel and redeploy.
2. In AdSense → **Privacy & messaging**, turn on Google's consent message for Europe/UK, then add
   `NEXT_PUBLIC_USE_GOOGLE_CMP` = `true` in Vercel and redeploy.
