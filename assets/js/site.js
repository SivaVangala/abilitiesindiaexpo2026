/* Abilities India Expo — site behaviour (no framework). Progressive enhancement: every page works without JS. */
(function () {
  'use strict';
  var root = document.documentElement;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function announce(msg) { var l = $('#live'); if (!l) return; l.textContent = ''; setTimeout(function () { l.textContent = msg; }, 60); }
  var desktop = window.matchMedia('(min-width: 1141px)');

  if (window.lucide) window.lucide.createIcons({ attrs: { 'aria-hidden': 'true', focusable: 'false' } });

  /* ---------------- Display & reading preferences ---------------- */
  var TOGGLES = ['contrast', 'spacing', 'links', 'simple', 'motion'];
  function setText(v) {
    v = v || '0';
    if (v === '0') root.removeAttribute('data-a11y-text'); else root.setAttribute('data-a11y-text', v);
    $$('[data-text]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-text') === v)); });
    store('aie-text', v === '0' ? null : v);
  }
  function setToggle(name, on) {
    if (on) root.setAttribute('data-a11y-' + name, ''); else root.removeAttribute('data-a11y-' + name);
    $$('[data-toggle="' + name + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(on)); });
    store('aie-' + name, on ? '1' : null);
  }
  $$('[data-text]').forEach(function (b) { b.addEventListener('click', function () { setText(b.getAttribute('data-text')); announce('Text size changed'); }); });
  $$('[data-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      setToggle(b.getAttribute('data-toggle'), on);
      announce(b.textContent.replace(/\s+/g, ' ').trim() + (on ? ': on' : ': off'));
    });
  });
  setText(load('aie-text'));
  TOGGLES.forEach(function (t) { setToggle(t, load('aie-' + t) === '1'); });
  var resetBtn = $('[data-a11y-reset]');
  if (resetBtn) resetBtn.addEventListener('click', function () { setText('0'); TOGGLES.forEach(function (t) { setToggle(t, false); }); stopSpeech(); announce('All display options reset'); });

  /* ---------------- Modal panels: display options + mobile menu ---------------- */
  var scrim = $('.scrim');
  function focusables(el) { return $$('a[href],button:not([disabled]),select,input,textarea,[tabindex]:not([tabindex="-1"])', el).filter(function (x) { return x.offsetParent !== null; }); }
  function modal(el, openers, closeBtn, opts) {
    var last = null, isOpen = false;
    function open() {
      last = document.activeElement; isOpen = true;
      if (opts.useHidden) el.hidden = false;
      requestAnimationFrame(function () { el.classList.add('is-open'); });
      scrim.hidden = false; document.body.style.overflow = 'hidden';
      openers.forEach(function (o) { o.setAttribute('aria-expanded', 'true'); });
      setTimeout(function () { (closeBtn || focusables(el)[0]).focus(); }, 50);
    }
    function close() {
      if (!isOpen) return; isOpen = false;
      el.classList.remove('is-open'); scrim.hidden = true; document.body.style.overflow = '';
      openers.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
      if (opts.useHidden) setTimeout(function () { if (!isOpen) el.hidden = true; }, 300);
      if (last && last.focus) last.focus();
    }
    el.addEventListener('keydown', function (e) {
      if (!isOpen) return; // trap only while open — on desktop the nav is inline and must never trap focus
      if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(el); if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    openers.forEach(function (o) { o.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    scrim.addEventListener('click', close);
    return { open: open, close: close, isOpen: function () { return isOpen; } };
  }
  var panel = $('#a11y');
  if (panel) {
    var a11y = modal(panel, $$('[data-a11y-open]'), $('[data-a11y-close]'), { useHidden: true });
    document.addEventListener('keydown', function (e) { if (e.altKey && (e.key === 'a' || e.key === 'A')) { e.preventDefault(); a11y.isOpen() ? a11y.close() : a11y.open(); } });
  }
  var nav = $('#site-nav');
  var navModal = null;
  if (nav) {
    navModal = modal(nav, $$('.menu-btn'), $('.nav__close'), { useHidden: false });
    nav.addEventListener('click', function (e) { if (e.target.closest('a') && !desktop.matches) navModal.close(); });
    desktop.addEventListener && desktop.addEventListener('change', function () { if (desktop.matches && navModal.isOpen()) navModal.close(); });
  }

  /* ---------------- Disclosures: mega menu, About, language ---------------- */
  var discs = $$('.nav__toggle, .lang__btn');
  function closeAll(except) { discs.forEach(function (b) { if (b !== except && b.getAttribute('aria-expanded') === 'true') { b.setAttribute('aria-expanded', 'false'); document.getElementById(b.getAttribute('aria-controls')).hidden = true; } }); }
  discs.forEach(function (btn) {
    var p = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(btn); btn.setAttribute('aria-expanded', String(open)); p.hidden = !open;
    });
    p.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); btn.setAttribute('aria-expanded', 'false'); p.hidden = true; btn.focus(); } });
    btn.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { e.stopPropagation(); btn.setAttribute('aria-expanded', 'false'); p.hidden = true; } });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav li, .lang, .dock__lang')) closeAll(); });
  document.addEventListener('focusin', function (e) { if (desktop.matches && !e.target.closest('.nav li, .lang, .dock__lang, .a11y')) closeAll(); });

  /* ---------------- Read aloud (optional; native screen readers come first) ---------------- */
  var synth = window.speechSynthesis, speaking = false, paused = false;
  if (synth) { synth.getVoices(); synth.onvoiceschanged = function () { synth.getVoices(); }; }
  if (synth && 'SpeechSynthesisUtterance' in window) $$('[data-speech]').forEach(function (el) { el.hidden = false; });
  function labelSpeech() {
    /* VERSION B speech: welcome first, then read section by section from where the visitor is;
     stopping remembers the section so the next press resumes there. */
  var WELCOME = 'Welcome to Abilities India Expo 2026, the second edition. 20 to 22 December 2026, at the KTPO International Exhibition and Convention Centre, Bengaluru.';
  var queue = [], qi = 0;
  function voiceFor(lg) { var vs = synth ? synth.getVoices().filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lg) === 0; }) : []; return vs.filter(function (v) { return /IN/i.test(v.lang); })[0] || vs[0] || null; }
  function sectionText(sec) {
    var c = sec.cloneNode(true);
    $$('[aria-hidden="true"], .sr-only, script, style, [data-speech], .flag', c).forEach(function (n) { n.remove(); });
    return (c.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function sections() { return $$('main > section').filter(function (x) { return sectionText(x).length > 0; }); }
  function sectionInView() { var list = sections(); for (var i = 0; i < list.length; i++) { var r = list[i].getBoundingClientRect(); if (r.bottom > 120) return i; } return 0; }
  function speakNext() {
    if (!speaking) return;
    if (qi >= queue.length) { try { sessionStorage.removeItem('aie-speak'); } catch (e) {} stopSpeech(); return; }
    var item = queue[qi], lg = (root.lang || 'en').slice(0, 2);
    var u = new SpeechSynthesisUtterance(item.text);
    u.lang = lg + '-IN'; u.rate = 0.95; var v = voiceFor(lg); if (v) u.voice = v;
    u.onstart = function () { if (item.idx != null) { try { sessionStorage.setItem('aie-speak', location.pathname + '|' + item.idx); } catch (e) {} } };
    u.onend = function () { qi++; speakNext(); };
    synth.speak(u);
  }
  window.aieSpeak = function (text) { if (!synth) return null; synth.cancel(); speaking = false; labelSpeech(); var u = new SpeechSynthesisUtterance(text); var lg = (root.lang || 'en').slice(0, 2); u.lang = lg + '-IN'; var v = voiceFor(lg); if (v) u.voice = v; synth.speak(u); return u; };
  $$('[data-speak]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (speaking) { stopSpeech(); announce('Reading stopped. Press again to continue from here.'); return; }
      var list = sections(), start = sectionInView(), saved = null;
      try { saved = (sessionStorage.getItem('aie-speak') || '').split('|'); } catch (e) {}
      var resumed = !!(saved && saved[0] === location.pathname && saved[1]);
      if (resumed) start = Math.min(+saved[1], list.length - 1);
      queue = [{ text: resumed ? 'Continuing where you stopped.' : WELCOME, idx: null }];
      for (var i = start; i < list.length; i++) queue.push({ text: sectionText(list[i]), idx: i });
      qi = 0; synth.cancel(); speaking = true; paused = false; labelSpeech(); speakNext();
      if (root.lang !== 'en' && !voiceFor(root.lang.slice(0, 2))) announce('No voice for this language is installed on this device; your device may use its default voice.');
    });
  });
  $$('[data-speak-pause]').forEach(function (b) { b.hidden = !speaking; var l = $('.speak-pause-label', b); if (l) l.textContent = paused ? 'Resume' : 'Pause'; });
  }
  function stopSpeech() { if (synth) synth.cancel(); speaking = false; paused = false; labelSpeech(); }
  $$('[data-speak]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (speaking) { stopSpeech(); announce('Reading stopped'); return; }
      var target = $(b.getAttribute('data-speak')) || $('main');
      var clone = target.cloneNode(true);
      $$('[aria-hidden="true"], .sr-only, script, style, [data-speech]', clone).forEach(function (n) { n.remove(); });
      var text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      var u = new SpeechSynthesisUtterance(text);
      var lg = (root.lang || 'en').slice(0, 2); u.lang = lg + '-IN'; u.rate = 0.95;
      var vs = synth.getVoices().filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(lg) === 0; });
      if (vs.length) u.voice = vs.filter(function (v) { return /IN/i.test(v.lang); })[0] || vs[0];
      else if (lg !== 'en') announce('No ' + lg + ' voice is installed on this device. Your device may read with its default voice.');
      u.onend = function () { speaking = false; paused = false; labelSpeech(); };
      synth.cancel(); synth.speak(u); speaking = true; paused = false; labelSpeech();
    });
  });
  $$('[data-speak-pause]').forEach(function (b) {
    b.addEventListener('click', function () { if (!speaking) return; if (paused) synth.resume(); else synth.pause(); paused = !paused; labelSpeech(); announce(paused ? 'Reading paused' : 'Reading resumed'); });
  });
  window.addEventListener('pagehide', stopSpeech);

  /* ---------------- Programs: search + category filter (state kept in the URL) ---------------- */
  var q = $('#q');
  if (q) {
    var chips = $$('[data-filter]'), cards = $$('.tcard[data-cat]', $('main')), groups = $$('.tgroup[data-group]');
    var results = $('#results'), empty = $('#empty'), total = cards.length;
    var params = new URLSearchParams(location.search);
    var cat = params.get('cat') || 'all';
    if (!chips.some(function (c) { return c.getAttribute('data-filter') === cat; })) cat = 'all';
    q.value = params.get('q') || '';
    var apply = function (fromUser) {
      var term = q.value.trim().toLowerCase(), shown = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-filter') === cat)); });
      cards.forEach(function (card) {
        if (!card.closest('.tgroup')) return;
        var ok = (cat === 'all' || card.getAttribute('data-cat') === cat) && (!term || card.getAttribute('data-search').indexOf(term) > -1);
        card.hidden = !ok; if (ok) shown++;
      });
      total = $$('.tgroup .tcard').length;
      groups.forEach(function (g) { g.hidden = !$$('.tcard:not([hidden])', g).length; });
      empty.hidden = shown > 0;
      results.textContent = shown === total ? 'Showing all ' + total + ' categories' : 'Showing ' + shown + ' of ' + total + ' categories';
      if (fromUser) {
        var p = new URLSearchParams(); if (cat !== 'all') p.set('cat', cat); if (term) p.set('q', term);
        history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : ''));
      }
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { cat = c.getAttribute('data-filter'); apply(true); }); });
    var tmr; q.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(function () { apply(true); }, 250); });
    var clr = $('[data-clear]'); if (clr) clr.addEventListener('click', function () { q.value = ''; cat = 'all'; apply(true); q.focus(); });
    apply(false);
  }

  /* ---------------- Contact form: accessible validation, then mailto handoff ---------------- */
  var form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errs = [];
      [['f-name', 'Enter your name'], ['f-email', 'Enter an email address, like name@example.com'], ['f-msg', 'Enter your message']].forEach(function (r) {
        var f = document.getElementById(r[0]), m = document.getElementById('e-' + r[0].slice(2));
        var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.setAttribute('aria-invalid', String(bad)); m.hidden = !bad; m.textContent = bad ? r[1] : '';
        if (bad) errs.push([r[0], r[1]]);
      });
      var box = $('#form-errors');
      if (errs.length) {
        box.innerHTML = '<h3>There ' + (errs.length > 1 ? 'are ' + errs.length + ' problems' : 'is a problem') + '</h3><ul>' + errs.map(function (x) { return '<li><a href="#' + x[0] + '">' + x[1] + '</a></li>'; }).join('') + '</ul>';
        box.hidden = false; box.focus(); return;
      }
      box.hidden = true;
      var v = function (id) { return document.getElementById(id).value.trim(); };
      var body = 'Name: ' + v('f-name') + '\nPhone: ' + v('f-phone') + '\nEmail: ' + v('f-email') + '\nAddress: ' + v('f-address') + '\nTopic: ' + v('f-topic') + '\n\n' + v('f-msg');
      location.href = 'mailto:' + form.getAttribute('data-mailto') + '?subject=' + encodeURIComponent('Website enquiry: ' + v('f-topic')) + '&body=' + encodeURIComponent(body);
      announce('Your email app is opening with your message.');
    });
  }

  /* ---------------- Tickets99 embedded checkout (only when configured; never simulates success) ---------------- */
  var t99 = $('#t99');
  if (t99) {
    var slug = new URLSearchParams(location.search).get('t');
    var list = JSON.parse(t99.getAttribute('data-tickets') || '[]');
    var tk = list.filter(function (x) { return x.slug === slug; })[0];
    var buy = t99.getAttribute('data-buy'), origin = t99.getAttribute('data-origin');
    if (tk && tk.ti && buy) {
      var src = buy + '?ti=' + encodeURIComponent(tk.ti) + '&autoselect=1';
      t99.innerHTML = '<p>Registering for <strong></strong>. If the form below does not load, <a rel="noopener">open registration on Tickets99</a>.</p>' +
        '<iframe title="Tickets99 registration for Abilities India Expo" style="width:100%;min-height:900px;border:0;border-radius:18px" allow="payment"></iframe>';
      $('strong', t99).textContent = tk.name; $('a', t99).href = src; $('iframe', t99).src = src;
      window.addEventListener('message', function (e) {
        if (!origin || e.origin !== origin || !e.data || typeof e.data !== 'object') return;
        var fr = $('iframe', t99);
        if (e.data.type === 'tickets99-resize' && +e.data.height > 0) fr.style.height = Math.min(+e.data.height, 20000) + 'px';
        if (e.data.type === 'tickets99-scrolltop') fr.scrollIntoView({ block: 'start' });
      });
    } else if (slug) {
      t99.innerHTML = '<p class="status status--soon">Online registration for this category is not open yet. Please <a href="/contact/">contact us</a> to register your interest.</p>';
    }
  }

  if (/[?&]clean\b/.test(location.search)) root.setAttribute('data-hide-todo', '');
})();

/* ===================== VERSION B additions ===================== */
(function () {
  'use strict';
  var root = document.documentElement;
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function say(m) { var l = document.getElementById('live'); if (l) { l.textContent = ''; setTimeout(function () { l.textContent = m; }, 60); } }

  /* Colour-vision modes */
  function setCv(v) {
    if (v) root.setAttribute('data-cv', v); else root.removeAttribute('data-cv');
    $$('[data-cv]').forEach(function (b) { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.getAttribute('data-cv') === (v || ''))); });
    store('aie-cv', v || null);
  }
  var cvSaved = null; try { cvSaved = localStorage.getItem('aie-cv'); } catch (e) {}
  setCv(cvSaved);
  $$('button[data-cv]').forEach(function (b) { b.addEventListener('click', function () { setCv(b.getAttribute('data-cv')); say('Colour vision: ' + b.textContent.replace(/\s+/g, ' ').trim()); }); });
  var reset = document.querySelector('[data-a11y-reset]'); if (reset) reset.addEventListener('click', function () { setCv(null); });

  /* Languages — DEMO: on-page translation with Google's website translator, loaded only after a visitor
     chooses a language. Production: reviewed, pre-built pages per language (tools/translate.js). */
  var NAMES = { en: 'English', hi: 'Hindi', kn: 'Kannada', ml: 'Malayalam', ta: 'Tamil', te: 'Telugu' };
  var m = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/);
  var cur = m ? m[1] : 'en';
  var NATIVE = { en: 'English', hi: 'हिन्दी', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', ta: 'தமிழ்', te: 'తెలుగు' };
  function mark() { $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === cur)); }); $$('.lang__cur').forEach(function (s) { s.textContent = NATIVE[cur]; s.setAttribute('translate', 'no'); }); }
  mark();
  if (cur !== 'en') {
    root.lang = cur;
    window.aieGtInit = function () { new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'gt-el'); };
    var sc = document.createElement('script'); sc.src = 'https://translate.google.com/translate_a/element.js?cb=aieGtInit'; document.head.appendChild(sc);
  }
  function setCookie(v) {
    var exp = v ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=' + (v || '') + ';path=/' + exp;
    if (location.hostname.indexOf('.') > -1) document.cookie = 'googtrans=' + (v || '') + ';path=/;domain=.' + location.hostname.replace(/^www\./, '') + exp;
  }
  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var code = b.getAttribute('data-lang'); if (code === cur) return;
      setCookie(code === 'en' ? null : '/en/' + code);
      say('Changing language to ' + NAMES[code]);
      location.reload();
    });
  });

  /* Back to top */
  var top = document.querySelector('.totop');
  if (top) {
    var onScroll = function () { top.hidden = window.scrollY < 600; };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    top.addEventListener('click', function () { window.scrollTo(0, 0); var s = document.querySelector('.skip'); (document.querySelector('.brand') || s).focus(); });
  }

  /* Header shadow once scrolled (sticky navbar) */
  var hdr = document.querySelector('.hdr');
  if (hdr) { var h = function () { hdr.classList.toggle('is-stuck', window.scrollY > 10); }; window.addEventListener('scroll', h, { passive: true }); h(); }

  /* Event countdown on the dates card */
  var dd = document.querySelector('[data-days]');
  if (dd) { var days = Math.ceil((new Date(dd.getAttribute('data-days')) - Date.now()) / 864e5); if (days > 0) dd.textContent = days + ' days to go'; }
})();


/* ===================== VERSION B: voice assistant (mic) =====================
   Opens a small panel: shows "Listening…", what was heard, and clear errors. Speech recognition uses the
   browser's service (Chrome / Edge). A "type instead" box runs the same commands, so it always works. Alt+M. */
(function () {
  'use strict';
  var btn = document.querySelector('[data-voice]');
  var panel = document.getElementById('voice-panel');
  if (!btn || !panel) return;
  btn.hidden = false;
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var stat = panel.querySelector('[data-vstatus]'), heard = panel.querySelector('[data-vheard]');
  var form = panel.querySelector('form'), input = panel.querySelector('input');
  function show(msg) { stat.textContent = msg; }
  function speak(msg) { try { return window.aieSpeak ? window.aieSpeak(msg) : null; } catch (e) { return null; } }
  function go(path, what) {
    show('Opening ' + what + '…');
    var u = speak('Opening ' + what), done = false;
    var fire = function () { if (!done) { done = true; location.href = path; } };
    if (u) u.onend = fire; setTimeout(fire, 2500);
  }
  /* Display commands: they press the same buttons as the Accessibility Tools panel, so choices are remembered */
  function press(sel) { var b = document.querySelector(sel); if (b) { b.click(); return true; } return false; }
  function textStep(dir) {
    var cur = +(document.documentElement.getAttribute('data-a11y-text') || 0), next = Math.max(0, Math.min(3, cur + dir));
    press('[data-text="' + next + '"]');
    return next === cur ? (dir > 0 ? 'Text is already at the largest size.' : 'Text is already at the standard size.') : (dir > 0 ? 'Text made bigger.' : 'Text made smaller.');
  }
  function toggleTo(name, on) { var b = document.querySelector('[data-toggle="' + name + '"]'); if (b && (b.getAttribute('aria-pressed') === 'true') !== on) b.click(); }
  function done(msg) { show(msg); speak(msg); }
  var DISPLAY_COMMANDS = [
    [/black (and|&|n) white|black ?& ?white|grey ?scale|gray ?scale|monochrome|no colou?rs?|colou?rless/i, function () { press('[data-cv="mono"]'); done('Black and white is on. Say “normal colours” to undo.'); }],
    [/red.?green|protan|deutan|colou?r ?blind/i, function () { press('[data-cv="rg"]'); done('Red–green safe colours are on.'); }],
    [/blue.?yellow|tritan/i, function () { press('[data-cv="by"]'); done('Blue–yellow safe colours are on.'); }],
    [/(normal|standard|original|default|full) colou?rs?|colou?rs? (back|on)|remove black/i, function () { press('[data-cv=""]'); done('Standard colours are back.'); }],
    [/(increase|bigger|larger|enlarge|zoom in|big|large).{0,12}(text|font|letters|size)|(text|font|letters).{0,12}(bigger|larger|increase|big|large)|zoom in/i, function () { done(textStep(1)); }],
    [/(decrease|smaller|reduce|zoom out|small).{0,12}(text|font|letters|size)|(text|font|letters).{0,12}(smaller|decrease|small)|zoom out/i, function () { done(textStep(-1)); }],
    [/(normal|standard|default|reset).{0,8}(text|font) ?size/i, function () { press('[data-text="0"]'); done('Text is back to the standard size.'); }],
    [/high contrast|more contrast|(increase|turn on).{0,10}contrast/i, function () { toggleTo('contrast', true); done('High contrast is on.'); }],
    [/(normal|less|turn off|remove|low).{0,10}contrast|contrast off/i, function () { toggleTo('contrast', false); done('High contrast is off.'); }],
    [/spacing|space between/i, function () { var on = !/(less|normal|remove|off)/i.test(lastSaid); toggleTo('spacing', on); done(on ? 'Extra spacing is on.' : 'Extra spacing is off.'); }],
    [/underline/i, function () { toggleTo('links', true); done('All links are underlined.'); }],
    [/(stop|reduce|no|less) (motion|animation)|animations? off/i, function () { toggleTo('motion', true); done('Animations are reduced.'); }],
    [/simpl(e|ified)|easy (view|read)/i, function () { toggleTo('simple', true); done('Simplified reading view is on.'); }],
    [/reset|undo all|default settings|back to normal/i, function () { press('[data-a11y-reset]'); press('[data-cv=""]'); done('All display settings are reset.'); }],
    [/accessibility (tools|options|settings|panel)|open (the )?tools/i, function () { press('[data-a11y-open]'); show('Accessibility Tools opened.'); }],
    [/(scroll|go|move) down|next section/i, function () { window.scrollBy({ top: innerHeight * 0.8 }); done('Scrolled down.'); }],
    [/(scroll|go|move) up|previous section/i, function () { window.scrollBy({ top: -innerHeight * 0.8 }); done('Scrolled up.'); }],
    [/(go to |back to )?(the )?top/i, function () { window.scrollTo(0, 0); done('At the top of the page.'); }],
    [/go back|previous page/i, function () { done('Going back.'); setTimeout(function () { history.back(); }, 600); }],
    [/(hindi|kannada|malayalam|tamil|telugu|english)/i, function () {
      var m = lastSaid.match(/(hindi|kannada|malayalam|tamil|telugu|english)/i)[1].toLowerCase();
      var code = { english: 'en', hindi: 'hi', kannada: 'kn', malayalam: 'ml', tamil: 'ta', telugu: 'te' }[m];
      done('Changing the language to ' + m + '.'); setTimeout(function () { press('[data-lang="' + code + '"]'); }, 900);
    }],
  ];
  var lastSaid = '';
  var COMMANDS = [
    [/visitor|visit|entry/i, function () { go('/programs/visitor/', 'visitor registration'); }],
    [/regist|ticket|book|sign ?up|पंजीकरण|रजिस्टर|ನೋಂದಣಿ|രജിസ്റ്റർ|பதிவு|నమోదు/i, function () { go('/programs/', 'registration'); }],
    [/exhibit|exibit|stall|प्रदर्शक/i, function () { go('/exhibitors/', 'exhibitors'); }],
    [/job|employ|career|opportunit|नौकरी/i, function () { go('/expo/job-fair/', 'the job fair'); }],
    [/elder|senior|old age/i, function () { go('/expo/elderly-services/', 'elderly services'); }],
    [/contact|call|phone|संपर्क/i, function () { go('/contact/', 'contact'); }],
    [/access|wheelchair|sign language|support|help desk|सहायता/i, function () { go('/accessibility/', 'accessibility'); }],
    [/about|founder|simon/i, function () { go('/about/', 'about us'); }],
    [/venue|where|direction|location|address|map/i, function () { show('KTPO, Bengaluru. Opening Google Maps…'); speak('The venue is KTPO International Exhibition and Convention Centre, Bengaluru.'); setTimeout(function () { window.open('https://www.google.com/maps/search/?api=1&query=KTPO+International+Exhibition+and+Convention+Centre+Bengaluru', '_blank'); }, 1500); }],
    [/when|date/i, function () { show('20 to 22 December 2026.'); speak('Abilities India Expo 2026 is on 20 to 22 December 2026.'); }],
    [/home|start/i, function () { go('/', 'the home page'); }],
    [/read|listen/i, function () { var b = document.querySelector('[data-speak]'); if (b) b.click(); show('Reading the page.'); }],
    [/stop|quiet/i, function () { if (window.speechSynthesis) speechSynthesis.cancel(); show('Stopped.'); }],
    [/help|what can/i, function () { var m = 'Try: I want to register · Open exhibitors · Where is the venue · Read the page · Make it black and white · Bigger text · High contrast · Change language to Hindi · Scroll down · Reset'; show(m); speak(m.replace(/·/g, ',')); }],
  ];
  function handle(text) {
    var said = String(text || '').trim();
    if (!said) return;
    heard.textContent = '“' + said + '”'; lastSaid = said;
    for (var d = 0; d < DISPLAY_COMMANDS.length; d++) { if (DISPLAY_COMMANDS[d][0].test(said)) { DISPLAY_COMMANDS[d][1](); return; } }
    for (var i = 0; i < COMMANDS.length; i++) { if (COMMANDS[i][0].test(said)) { COMMANDS[i][1](); return; } }
    // any page name from the menu: "open the visitors page", "gallery", "ambassadors"…
    var words = said.toLowerCase().split(/[^a-zऀ-ൿ]+/).filter(function (w) { return w.length > 3 && !/^(open|please|show|want|page|could|would|that|this|with|take|go)$/.test(w); });
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="/"], .ftr a[href^="/"]'));
    for (var j = 0; j < links.length; j++) {
      var t = links[j].textContent.toLowerCase();
      if (words.some(function (w) { return t.indexOf(w.replace(/s$/, '')) > -1; })) { go(links[j].getAttribute('href'), links[j].textContent.trim()); return; }
    }
    show('Sorry, I did not understand. Say or type “help”.');
    speak('Sorry, I did not understand. Say help to hear what you can ask.');
  }
  window.aieVoice = handle; // used by automated tests and the typed box

  var rec = null, on = false;
  if (SR) {
    rec = new SR(); rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
    rec.onstart = function () { on = true; btn.setAttribute('aria-pressed', 'true'); show('Listening… speak now.'); };
    rec.onresult = function (e) {
      var r = e.results[e.results.length - 1], text = r[0].transcript;
      heard.textContent = '“' + text + '”';
      if (r.isFinal) handle(text);
    };
    rec.onerror = function (e) {
      var m = { 'not-allowed': 'Microphone is off for this site. Turn it on from the icon at the left of the address bar.', 'service-not-allowed': 'Microphone is blocked for this site.',
        'no-speech': 'I did not hear anything. Press the mic and try again.', 'audio-capture': 'No microphone was found on this device.',
        'network': 'Voice service is not reachable right now. You can type instead.', 'aborted': 'Stopped listening.' }[e.error] || ('Voice error: ' + e.error + '. Please type your request below.');
      show(m);
    };
    rec.onend = function () { on = false; btn.setAttribute('aria-pressed', 'false'); if (/Listening/.test(stat.textContent)) show('Press the mic to speak again, or type below.'); };
  }
  function openPanel() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function closePanel() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (on && rec) rec.abort(); }
  btn.addEventListener('click', function () {
    openPanel();
    if (!rec) { show('Voice input is not supported in this browser. Type what you need below.'); input.focus(); return; }
    if (on) { rec.stop(); return; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    rec.lang = ((document.documentElement.lang || 'en').slice(0, 2)) + '-IN';
    heard.textContent = '';
    var begin = function () {
      try { rec.start(); clearTimeout(window.__aieRecT); window.__aieRecT = setTimeout(function () { try { rec.stop(); } catch (e) {} }, 9000); }
      catch (err) { show('Could not start the microphone. Please type below.'); }
    };
    // Ask for the microphone first: shows Chrome's permission prompt and detects a missing or blocked mic.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      show('Listening… speak now.');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); begin(); })
        .catch(function (err) { if (err && err.name === 'NotFoundError') show('No microphone found on this device.'); else begin(); /* let speech recognition ask for the mic itself */ });
    } else begin();
  });
  panel.querySelector('[data-vclose]').addEventListener('click', function () { closePanel(); btn.focus(); });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closePanel(); btn.focus(); } });
  form.addEventListener('submit', function (e) { e.preventDefault(); handle(input.value); });
  document.addEventListener('keydown', function (e) { if (e.altKey && (e.key === 'm' || e.key === 'M')) { e.preventDefault(); btn.click(); } });
})();


/* ===================== VERSION B: exhibitor zone explorer (search + zone filter) ===================== */
(function () {
  'use strict';
  var box = document.querySelector('[data-explorer]');
  if (!box) return;
  var q = box.querySelector('input[type=search]'), status = box.querySelector('[role=status]'), empty = box.querySelector('[data-empty]');
  var btns = Array.prototype.slice.call(box.querySelectorAll('[data-zone]'));
  var cards = Array.prototype.slice.call(box.querySelectorAll('[data-zid]'));
  var zone = 'all', t;
  function apply() {
    var term = q.value.trim().toLowerCase(), shown = 0, zones = 0;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-zone') === zone)); });
    cards.forEach(function (c) {
      var inZone = zone === 'all' || c.getAttribute('data-zid') === zone, n = 0;
      Array.prototype.forEach.call(c.querySelectorAll('.zchips li'), function (li) {
        var hit = inZone && (!term || li.textContent.toLowerCase().indexOf(term) > -1 || c.querySelector('h3').textContent.toLowerCase().indexOf(term) > -1);
        li.hidden = !hit; li.classList.toggle('is-hit', !!term && hit && li.textContent.toLowerCase().indexOf(term) > -1); if (hit) n++;
      });
      c.hidden = n === 0; c.querySelector('[data-count]').textContent = n; shown += n; if (n) zones++;
    });
    empty.hidden = shown > 0;
    status.textContent = shown ? 'Showing ' + shown + ' categories in ' + zones + (zones === 1 ? ' zone' : ' zones') : 'No categories match';
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { zone = b.getAttribute('data-zone'); apply(); }); });
  q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(apply, 200); });
})();

/* ===================== VERSION B: cards reveal one by one while scrolling ===================== */
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) { Array.prototype.forEach.call(els, function (e) { e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  Array.prototype.forEach.call(els, function (e) { io.observe(e); });
})();


/* ===================== VERSION B: cinematic scroll effects (not used in Version A) =====================
   Each section gets its own effect; cards stagger in. Count-up numbers. Light parallax on hero images.
   Everything is skipped when the visitor prefers reduced motion or picks "Reduce motion". */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-a11y-motion') || root.hasAttribute('data-a11y-simple');
  if (reduce || !('IntersectionObserver' in window)) return;
  var main = document.querySelector('main'); if (!main) return;

  var GROUPS = ['.iam > li', '.pgrid > *', '.tcards > li', '.partners > li', '.mosaic > li', '.acc__list > li', '.nband__list > li', '.frows > *',
    '.ptiles > *', '.svc > li', '.ask > *', '.ytl > li', '.trio > *', '.journey-b > li', '.regbtns > li', '.tgrid > *', '.xgrid > *', '.web-a11y li',
    '.facts4 > li', '.fly__grid > li', '.khl > li', '.ksteps > li', '.kdet > li', '.klist > li', '.policy > *', '.faq details', '.kgal > li', '.kout__list > li', '.kwho > li', '.about-c__pics > li', '.why-b > *', '.hl-b > li', '.vgroups > *', '.awards2 > *', '.steps > li'];
  var EFFECTS = ['flip', 'from-left', 'zoom', 'pop', 'curtain', 'from-right'];
  var targets = [];
  GROUPS.forEach(function (sel, gi) {
    var items = Array.prototype.slice.call(main.querySelectorAll(sel));
    if (!items.length) return;
    var fx = EFFECTS[gi % EFFECTS.length];
    items.forEach(function (el, i) {
      var f = fx;
      if (sel === '.frows > *' || sel === '.ytl > li') f = i % 2 ? 'from-right' : 'from-left';   // zig-zag rows
      if (sel === '.mosaic > li' || sel === '.fly__grid > li' || sel === '.about-c__pics > li') f = 'zoom';
      el.setAttribute('data-fx', f);
      el.style.setProperty('--fxd', Math.min(i, 8) * 110 + 'ms');
      targets.push(el);
    });
  });
  Array.prototype.forEach.call(main.querySelectorAll('.sec-head, .motto-c blockquote, .regcard > h2, .bio__text, .venue-b > div, .tech-b > div, .acc > div:first-child, .fly > div:first-child, .about-c > div'), function (el) {
    if (el.hasAttribute('data-fx')) return;
    el.setAttribute('data-fx', el.matches('.sec-head') ? 'wipe' : 'from-left'); targets.push(el);
  });
  Array.prototype.forEach.call(main.querySelectorAll('.venue-b__img, .bio__img, .amb-b figure, .frow__img'), function (el) {
    if (!el.hasAttribute('data-fx')) { el.setAttribute('data-fx', 'curtain'); targets.push(el); }
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('fx-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach(function (t) { io.observe(t); });

  /* Count-up numbers in the numbers band (final text stays exactly as written) */
  Array.prototype.forEach.call(document.querySelectorAll('.nband__list b'), function (b) {
    var finalText = b.textContent, n = parseInt(finalText.replace(/[^0-9]/g, ''), 10);
    if (!n) return;
    var obs = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; obs.disconnect();
      var t0 = performance.now(), dur = 1600;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur), v = Math.round(n * (1 - Math.pow(1 - p, 3)));
        b.textContent = p < 1 ? v.toLocaleString('en-IN') + '+' : finalText;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
    obs.observe(b);
  });

  /* Gentle parallax on hero images */
  var layers = Array.prototype.slice.call(document.querySelectorAll('.phhero__bg, .phero__pic'));
  if (layers.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { var y = window.scrollY; layers.forEach(function (l) { l.style.transform = 'translateY(' + Math.min(y * 0.25, 220) + 'px)'; }); ticking = false; });
    }, { passive: true });
  }
})();
