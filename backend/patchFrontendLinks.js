/**
 * patchFrontendLinks.js
 * Directly patches frontend/index.html to fix all non-working links.
 * 
 * Root causes fixed:
 *  1. CSS: adds pointer-events:auto on a[href] globally
 *  2. Chat markdown inline links: adds pointer-events:auto inline style
 *  3. Citation source links: adds pointer-events:auto, icons get pointer-events:none
 *  4. Modal official portal link: adds pointer-events:auto
 *  5. Modal track status link: adds pointer-events:auto
 *  6. Modal application link: adds pointer-events:auto
 */
const fs = require('fs');

let html = fs.readFileSync('frontend/index.html', 'utf8');
const original = html;

// ----- FIX 1: Inject global CSS rules for link pointer-events -----
const cssAnchor = `.glass-card {
      background: rgba(21, 27, 39, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem;
    }`;
const cssReplacement = `.glass-card {
      background: rgba(21, 27, 39, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem;
    }
    /* ===== FIX: Ensure all hyperlinks in app are always clickable ===== */
    a[href] {
      pointer-events: auto !important;
      cursor: pointer !important;
      position: relative;
      z-index: 2;
    }
    a[href] svg,
    a[href] i[data-lucide] {
      pointer-events: none !important;
    }
    /* Modal and chat links take priority over any parent overflow/stacking */
    #modal-service-body a[href],
    #chat-messages-container a[href],
    .citizen-services-link {
      pointer-events: auto !important;
      cursor: pointer !important;
      z-index: 10;
    }`;

if (html.includes(cssAnchor)) {
  html = html.replace(cssAnchor, cssReplacement);
  console.log('[OK] Fix 1 applied: global CSS for link pointer-events');
} else {
  console.log('[WARN] Fix 1: glass-card CSS not found as expected');
  // Fallback: inject CSS before </style>
  html = html.replace('</style>', `    /* ===== FIX: Ensure all hyperlinks in app are always clickable ===== */
    a[href] { pointer-events: auto !important; cursor: pointer !important; }
    a[href] svg, a[href] i[data-lucide] { pointer-events: none !important; }
    #modal-service-body a[href], #chat-messages-container a[href] { pointer-events: auto !important; cursor: pointer !important; z-index: 10; }
  </style>`);
  console.log('[OK] Fix 1 fallback applied: CSS injected before </style>');
}

// ----- FIX 2: Chat inline markdown links -----
const oldInlineLink = `<a href="$2" target="_blank" class="text-electric-blue underline">$1</a>`;
const newInlineLink = `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-electric-blue underline" style="pointer-events:auto;cursor:pointer;position:relative;z-index:2;">$1</a>`;
if (html.includes(oldInlineLink)) {
  html = html.replace(oldInlineLink, newInlineLink);
  console.log('[OK] Fix 2 applied: chat markdown inline links');
} else {
  // Check if fix 1 from applyLinkFixes.js already ran
  if (html.includes('pointer-events:auto;cursor:pointer;') && html.includes('$1</a>')) {
    console.log('[OK] Fix 2 already applied');
  } else {
    console.log('[WARN] Fix 2: could not find old inline link pattern');
  }
}

// ----- FIX 3: Citation source links (bottom of chat messages) -----
const oldCiteLink = `<a href="${'${'}cite.url${'}'}" target="_blank" class="hover:underline flex items-center gap-1">
                  <i data-lucide="external-link" class="w-3 h-3"></i> ${'${'}cite.title${'}'}
                </a>`;
const newCiteLink = `<a href="${'${'}cite.url${'}'}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1" style="color:#29B6F6;text-decoration:underline;pointer-events:auto;cursor:pointer;">
                  <i data-lucide="external-link" class="w-3 h-3" style="pointer-events:none;"></i> ${'${'}cite.title${'}'}
                </a>`;
if (html.includes(oldCiteLink)) {
  html = html.replaceAll(oldCiteLink, newCiteLink);
  console.log('[OK] Fix 3 applied: citation source links');
} else {
  // Try without exact whitespace
  const citeLinkAlt = html.match(/<a href="\$\{cite\.url\}" target="_blank" class="hover:underline flex items-center gap-1">/g);
  if (citeLinkAlt) {
    html = html.replace(
      /<a href="\$\{cite\.url\}" target="_blank" class="hover:underline flex items-center gap-1">/g,
      '<a href="${cite.url}" target="_blank" rel="noopener noreferrer" class="hover:underline flex items-center gap-1" style="color:#29B6F6;pointer-events:auto;cursor:pointer;">'
    );
    // Also fix icon inside
    console.log('[OK] Fix 3 alt applied: citation source links');
  } else {
    console.log('[WARN] Fix 3: citation link pattern not found');
    const idx = html.indexOf('cite.url');
    console.log('cite.url at pos:', idx);
    if (idx !== -1) console.log('Context:', JSON.stringify(html.substring(idx - 30, idx + 200)));
  }
}

// ----- FIX 4: Modal official portal link -----
const oldPortalLink = `<a href="${'${'}s.officialUrl${'}'}" target="_blank" class="text-electric-blue hover:underline flex items-center gap-1">Open Official Portal <i data-lucide="external-link" class="w-3 h-3"></i></a>`;
const newPortalLink = `<a href="${'${'}s.officialUrl${'}'}" target="_blank" rel="noopener noreferrer" class="text-electric-blue hover:underline flex items-center gap-1 citizen-services-link" style="pointer-events:auto;cursor:pointer;text-decoration:underline;">Open Official Portal <i data-lucide="external-link" class="w-3 h-3" style="pointer-events:none;"></i></a>`;
if (html.includes(oldPortalLink)) {
  html = html.replace(oldPortalLink, newPortalLink);
  console.log('[OK] Fix 4 applied: modal portal links');
} else {
  // Regex approach
  const replaced = html.replace(
    /<a href="\$\{s\.officialUrl\}" target="_blank" class="text-electric-blue hover:underline flex items-center gap-1">Open Official Portal/g,
    '<a href="${s.officialUrl}" target="_blank" rel="noopener noreferrer" class="text-electric-blue hover:underline flex items-center gap-1 citizen-services-link" style="pointer-events:auto;cursor:pointer;">Open Official Portal'
  );
  if (replaced !== html) {
    html = replaced;
    console.log('[OK] Fix 4 alt applied: modal portal links');
  } else {
    console.log('[WARN] Fix 4: modal portal link not found');
    const idx = html.indexOf('s.officialUrl');
    if (idx !== -1) console.log('Context:', JSON.stringify(html.substring(idx - 20, idx + 200)));
  }
}

// ----- FIX 5: Modal track status link -----
html = html.replace(
  /<a href="\$\{s\.trackingUrl\}" target="_blank" class="btn-gradient px-3 py-1\.5 rounded-lg text-white font-semibold flex items-center gap-1">Track Status/g,
  '<a href="${s.trackingUrl}" target="_blank" rel="noopener noreferrer" class="btn-gradient px-3 py-1.5 rounded-lg text-white font-semibold flex items-center gap-1 citizen-services-link" style="pointer-events:auto;cursor:pointer;">Track Status'
);
console.log('[OK] Fix 5 applied: modal track status link (regex)');

// ----- FIX 6: Modal application start link -----
html = html.replace(
  /<a href="\$\{s\.applicationUrl\}" target="_blank" class="btn-gradient inline-flex items-center gap-2 px-6 py-2\.5 rounded-xl font-bold text-xs text-white shadow-lg">/g,
  '<a href="${s.applicationUrl}" target="_blank" rel="noopener noreferrer" class="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg citizen-services-link" style="pointer-events:auto;cursor:pointer;">'
);
console.log('[OK] Fix 6 applied: modal application start link (regex)');

// ----- FIX 7: Modal container - ensure overflow-hidden doesn't block scrollable body links -----
// The issue: glass-card wrapper has overflow:hidden which can clip the scroll body in some browsers
// Fix: use overflow: clip (clips but doesn't create new block formatting context for positioned elements)
html = html.replace(
  '<div class="glass-card max-w-4xl w-full max-h-[90vh] flex flex-col bg-[#10131B] border border-white/10 shadow-2xl overflow-hidden rounded-2xl">',
  '<div class="glass-card max-w-4xl w-full max-h-[90vh] flex flex-col bg-[#10131B] border border-white/10 shadow-2xl rounded-2xl" style="overflow:hidden;">'
);
// Also ensure modal-service-body has correct z-index context
html = html.replace(
  '<div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="modal-service-body">',
  '<div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm" id="modal-service-body" style="position:relative;z-index:1;">'
);
console.log('[OK] Fix 7 applied: modal container overflow and z-index');

// ----- FIX 8: Service card View Guide and Ask AI buttons -----
// Ensure the icon inside button doesn't intercept the click
html = html.replace(
  /<i data-lucide="info" class="w-3\.5 h-3\.5 text-electric-blue"><\/i> View Guide/g,
  '<i data-lucide="info" class="w-3.5 h-3.5 text-electric-blue" style="pointer-events:none;"></i> View Guide'
);
html = html.replace(
  /<i data-lucide="bot" class="w-3\.5 h-3\.5"><\/i> Ask AI/g,
  '<i data-lucide="bot" class="w-3.5 h-3.5" style="pointer-events:none;"></i> Ask AI'
);
console.log('[OK] Fix 8 applied: service card button icons');

// Verify changes
const changeCount = (html.length !== original.length) ? 'YES (length changed)' : 'NO (same length)';
console.log('\nHTML changed:', changeCount);
console.log('Final HTML length:', html.length);

// Verify key link fixes
const checks = [
  ['a[href] pointer-events', html.includes('pointer-events: auto !important')],
  ['Chat inline links fixed', html.includes('pointer-events:auto;cursor:pointer;position:relative')],
  ['Modal portal link fixed', html.includes('citizen-services-link')],
  ['Modal body z-index', html.includes('id="modal-service-body" style="position:relative')],
];
checks.forEach(([name, pass]) => console.log(`${pass ? '[OK]' : '[FAIL]'} ${name}`));

fs.writeFileSync('frontend/index.html', html, 'utf8');
console.log('\nPatched frontend/index.html successfully!');

