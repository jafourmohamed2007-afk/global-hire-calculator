/** Shared consent helpers used by the inline head script and the cookie banner. */

export const CONSENT_STORAGE_KEY = 'ghc-consent';
export const CONSENT_OPEN_EVENT = 'ghc:open-consent';

export type ConsentChoice = 'granted' | 'denied';

/**
 * Inline script for <head>. Runs before any ad script so Google receives consent defaults first:
 * - Google Consent Mode v2 defaults to "denied" for every storage type.
 * - AdSense requests are paused until the visitor chooses (unless Google's own CMP handles consent).
 * - A stored "denied" choice requests non-personalized ads only.
 * - The AdSense library is injected last, so it can never load before the consent defaults
 *   (React hoists plain async <script> tags above inline scripts).
 */
export function consentBootstrapScript(useGoogleCmp: boolean, adsenseClient: string): string {
  const safeClient = /^ca-pub-\d{10,20}$/.test(adsenseClient) ? adsenseClient : '';
  return `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
var c=null;try{c=localStorage.getItem('${CONSENT_STORAGE_KEY}');}catch(e){}
var a=window.adsbygoogle=window.adsbygoogle||[];
if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}
if(c==='denied'){a.requestNonPersonalizedAds=1;}
if(!c&&!${useGoogleCmp ? 'true' : 'false'}){a.pauseAdRequests=1;}
${safeClient ? `var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${safeClient}';document.head.appendChild(s);` : ''}
})();`;
}

type AdsQueue = unknown[] & { requestNonPersonalizedAds?: 0 | 1; pauseAdRequests?: 0 | 1 };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: AdsQueue;
  }
}

/** Applies a visitor's choice to Consent Mode and AdSense, and remembers it. */
export function applyConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked (private mode): the choice still applies for this page view.
  }
  const state = choice === 'granted' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  const ads = (window.adsbygoogle = window.adsbygoogle ?? ([] as AdsQueue));
  ads.requestNonPersonalizedAds = choice === 'granted' ? 0 : 1;
  ads.pauseAdRequests = 0;
}

export function readConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}
