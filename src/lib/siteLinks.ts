/** Public URLs the owner can adjust; prefer real social profiles when available. */
export const SITE_LINKS = {
  /** Use `tel:+1…` so phones and desktop apps (FaceTime, etc.) recognize the number reliably. */
  studioTelHref: 'tel:+15635570995',
  studioPhoneDisplay: '(563) 557-0995',
  maps:
    'https://www.google.com/maps/search/?api=1&query=Eyedeal+Optical+2644+Pennsylvania+Ave+Dubuque+IA+52001',
  /** Public Eyedeal Optical Dubuque page (not facebook.com homepage). */
  facebook: 'https://www.facebook.com/EyeDeal1997',
  instagram: 'https://www.instagram.com',
  /** Set when the virtual tour link is available (e.g. Matterport). Empty = hide tour button. */
  virtualTourUrl: '',
} as const
