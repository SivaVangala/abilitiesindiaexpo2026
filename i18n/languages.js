/*
 * Launch languages (proposed — confirm with the organiser).
 *  published: pages for this language are built (/hi/…). Set by tools/translate.js once a translation cache exists.
 *  reviewed:  organiser has approved the translation. Only reviewed languages get hreflang tags and are indexable.
 */
module.exports = [
  { code: 'en', native: 'English', english: 'English', published: true, reviewed: true },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', published: true, reviewed: false },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', published: true, reviewed: false },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', published: true, reviewed: false },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', published: true, reviewed: false },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', published: true, reviewed: false },
];
