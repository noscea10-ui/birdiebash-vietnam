/**
 * Birdie Bash Vietnam - Skin Studio (vợt + trang phục cosplay)
 * Loaded synchronously BEFORE the game bundle. The bundle calls:
 *   __birdieSkins.skinDef(def)       -> recolored character definition (local player only)
 *   __birdieSkins.frameOpts(def)     -> racket frame material options
 *   __birdieSkins.stringColor(def)   -> racket string color
 *   __birdieSkins.decorate(model, def, helpers) -> adds extra meshes (hats, capes, gems...)
 */
(function () {
  'use strict';

  var LS_KEY = 'birdie-skins:v1';

  // ------------------------------------------------------------------
  // RACKET SKINS
  // ------------------------------------------------------------------
  var RACKETS = [
    { id: 'classic', name: 'Mặc định', emoji: '🏸', frame: null },
    { id: 'sakura', name: 'Hoa Anh Đào', emoji: '🌸', frame: '#ff8fb8', str: '#ffe3ee', strOp: 0.6, gem: { c: '#ffd1e3', n: 10, r: 0.016, flat: true } },
    { id: 'neon', name: 'Neon Cyber', emoji: '💠', frame: '#00e5ff', emissive: '#00bcd4', ei: 0.9, str: '#7df9ff', strOp: 0.55, glow: { c: '#00e5ff', op: 0.45 } },
    { id: 'fire', name: 'Lửa Địa Ngục', emoji: '🔥', frame: '#ff4500', emissive: '#ff2200', ei: 0.8, str: '#ffb347', strOp: 0.5, gem: { c: '#ffa200', n: 12, r: 0.017, emissive: '#ff6a00' } },
    { id: 'ice', name: 'Băng Giá', emoji: '❄️', frame: '#a5e6ff', emissive: '#69c9ff', ei: 0.35, metal: 0.4, str: '#e9fbff', strOp: 0.6, gem: { c: '#ffffff', n: 8, r: 0.015, emissive: '#bdeaff' } },
    { id: 'gold', name: 'Hoàng Kim', emoji: '👑', frame: '#ffcf33', metal: 0.95, rough: 0.2, emissive: '#7a5a00', ei: 0.25, str: '#fff2b0', strOp: 0.5, gem: { c: '#ff3b5c', n: 6, r: 0.018 } },
    { id: 'galaxy', name: 'Dải Ngân Hà', emoji: '🌌', frame: '#6a3df0', emissive: '#3b1fb8', ei: 0.7, str: '#c8b6ff', strOp: 0.5, gem: { c: '#fff27a', n: 14, r: 0.012, emissive: '#fff27a' } },
    { id: 'rainbow', name: 'Cầu Vồng', emoji: '🌈', frame: '#ffffff', str: '#ffffff', strOp: 0.5, rainbow: true },
    { id: 'matcha', name: 'Trà Xanh', emoji: '🍵', frame: '#7cc576', str: '#eaffd9', strOp: 0.55, gem: { c: '#4f9d4a', n: 8, r: 0.014 } },
    { id: 'vampire', name: 'Ma Cà Rồng', emoji: '🦇', frame: '#1b1b24', emissive: '#7a0019', ei: 0.5, metal: 0.6, str: '#ff4d6d', strOp: 0.4, gem: { c: '#b3002d', n: 6, r: 0.016, emissive: '#b3002d' } },
    { id: 'candy', name: 'Kẹo Bông', emoji: '🍭', frame: '#ff9ad5', str: '#bff0ff', strOp: 0.6, gem: { c: '#9be7ff', n: 10, r: 0.015 } },
    { id: 'thunder', name: 'Sấm Sét', emoji: '⚡', frame: '#ffe600', emissive: '#ffd000', ei: 0.85, str: '#fffbb0', strOp: 0.55, glow: { c: '#fff176', op: 0.5 } }
  ];

  // ------------------------------------------------------------------
  // OUTFIT (COSPLAY) SKINS
  // ------------------------------------------------------------------
  function star(H, parent, pos, size, color, emissive) {
    var mat = H.lC(color, emissive ? { emissive: emissive, key: 'star|' + color } : { key: 'star|' + color });
    for (var i = 0; i < 5; i++) {
      var th = (i * 2 * Math.PI) / 5;
      var dx = -Math.sin(th), dy = Math.cos(th);
      H.lN(H.lF(size * 0.34, size, 8), mat, {
        pos: [pos[0] + dx * size * 0.5, pos[1] + dy * size * 0.5, pos[2]],
        rot: [0, 0, th], scale: [1, 1, 0.3], parent: parent
      });
    }
    H.lN(H.lU(size * 0.38, 10), mat, { pos: pos, scale: [1, 1, 0.3], parent: parent });
  }

  function mat(H, color, o) {
    o = o || {};
    o.key = 'sk|' + color + '|' + (o.emissive || '') + '|' + (o.metalness || '') + '|' + (o.opacity || '');
    return H.lC(color, o);
  }

  function hideEars(m) { try { m.ears.forEach(function (g) { g.visible = false; }); } catch (e) {} }

  var OUTFITS = [
    { id: 'default', name: 'Mặc định', emoji: '👕' },
    { id: 'hero', name: 'Siêu Nhân', emoji: '🦸', shirt: '#e11d48', shorts: '#1d4ed8', accent: '#facc15',
      build: function (m, H) {
        H.lN(H.lD(0.36, 0.46, 0.03), mat(H, '#dc2626'), { pos: [0, 0.14, -0.21], rot: [0.16, 0, 0], cast: true, parent: m.torso });
        H.lN(H.lD(0.38, 0.05, 0.035), mat(H, '#facc15'), { pos: [0, 0.36, -0.2], parent: m.torso });
        star(H, m.torso, [0, 0.24, 0.2], 0.075, '#facc15', '#a16207');
      } },
    { id: 'wizard', name: 'Phù Thủy', emoji: '🧙', shirt: '#6d28d9', shorts: '#4c1d95', accent: '#fbbf24',
      build: function (m, H) {
        hideEars(m);
        H.lN(H.lk(0.3, 0.3, 0.025, 28), mat(H, '#4c1d95'), { pos: [0, 0.26, 0], cast: true, parent: m.head });
        H.lN(H.lF(0.2, 0.42, 24), mat(H, '#5b21b6'), { pos: [0, 0.48, -0.01], rot: [-0.12, 0, 0], cast: true, parent: m.head });
        H.lN(H.lz(0.19, 0.022), mat(H, '#fbbf24'), { pos: [0, 0.3, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        star(H, m.head, [0, 0.45, 0.17], 0.06, '#fde047', '#ca8a04');
      } },
    { id: 'chef', name: 'Đầu Bếp', emoji: '👨‍🍳', shirt: '#ffffff', shorts: '#1f2937', accent: '#ef4444',
      build: function (m, H) {
        hideEars(m);
        var w = mat(H, '#ffffff');
        H.lN(H.lk(0.2, 0.21, 0.2, 24), w, { pos: [0, 0.36, 0], cast: true, parent: m.head });
        H.lN(H.lU(0.16, 18), w, { pos: [0, 0.52, 0], scale: [1.25, 0.85, 1.25], cast: true, parent: m.head });
        H.lN(H.lz(0.2, 0.022), mat(H, '#ef4444'), { pos: [0, 0.28, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        H.lN(H.lz(0.14, 0.03), mat(H, '#ef4444'), { pos: [0, 0.37, 0], rot: [Math.PI / 2, 0, 0], parent: m.torso });
      } },
    { id: 'santa', name: 'Ông Già Noel', emoji: '🎅', shirt: '#dc2626', shorts: '#991b1b', accent: '#ffffff',
      build: function (m, H) {
        hideEars(m);
        H.lN(H.lF(0.2, 0.32, 20), mat(H, '#dc2626'), { pos: [0, 0.42, -0.04], rot: [-0.35, 0, 0], cast: true, parent: m.head });
        H.lN(H.lz(0.2, 0.045), mat(H, '#ffffff'), { pos: [0, 0.27, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        H.lN(H.lU(0.055, 12), mat(H, '#ffffff'), { pos: [0, 0.54, -0.13], parent: m.head });
        H.lN(H.lD(0.07, 0.4, 0.03), mat(H, '#ffffff'), { pos: [0, 0.2, 0.2], parent: m.torso });
      } },
    { id: 'pirate', name: 'Cướp Biển', emoji: '🏴‍☠️', shirt: '#f1f5f9', shorts: '#111827', accent: '#dc2626',
      build: function (m, H) {
        hideEars(m);
        H.lN(H.lU(0.31, 24), mat(H, '#111827'), { pos: [0, 0.27, 0], scale: [1.15, 0.38, 0.95], cast: true, parent: m.head });
        H.lN(H.lU(0.04, 10), mat(H, '#ffffff'), { pos: [0, 0.3, 0.3], scale: [1, 1, 0.3], parent: m.head });
        H.lN(H.lD(0.46, 0.06, 0.03), mat(H, '#dc2626'), { pos: [0, 0.2, 0.19], parent: m.torso });
        H.lN(H.lD(0.46, 0.06, 0.03), mat(H, '#dc2626'), { pos: [0, 0.1, 0.2], parent: m.torso });
      } },
    { id: 'crown', name: 'Hoàng Tử', emoji: '🤴', shirt: '#2563eb', shorts: '#1e3a8a', accent: '#fbbf24',
      build: function (m, H) {
        hideEars(m);
        var g = mat(H, '#fbbf24', { metalness: 0.9, roughness: 0.25 });
        H.lN(H.lk(0.15, 0.17, 0.09, 20), g, { pos: [0, 0.31, 0], cast: true, parent: m.head });
        for (var i = 0; i < 5; i++) {
          var a = (i * 2 * Math.PI) / 5;
          H.lN(H.lF(0.032, 0.1, 6), g, { pos: [Math.sin(a) * 0.15, 0.4, Math.cos(a) * 0.15], parent: m.head });
          H.lN(H.lU(0.016, 8), mat(H, '#ef4444'), { pos: [Math.sin(a) * 0.165, 0.33, Math.cos(a) * 0.165], parent: m.head });
        }
        H.lN(H.lD(0.36, 0.44, 0.03), mat(H, '#7c3aed'), { pos: [0, 0.13, -0.21], rot: [0.14, 0, 0], parent: m.torso });
      } },
    { id: 'ninja', name: 'Ninja', emoji: '🥷', shirt: '#1f2937', shorts: '#111827', accent: '#ef4444',
      build: function (m, H) {
        var r = mat(H, '#ef4444');
        H.lN(H.lz(0.285, 0.028), r, { pos: [0, 0.11, 0], rot: [Math.PI / 2, 0, 0], cast: true, parent: m.head });
        H.lN(H.lD(0.045, 0.2, 0.02), r, { pos: [0.05, 0.05, -0.3], rot: [0.3, 0, 0.2], parent: m.head });
        H.lN(H.lD(0.045, 0.22, 0.02), r, { pos: [-0.05, 0.03, -0.3], rot: [0.3, 0, -0.25], parent: m.head });
        H.lN(H.lz(0.15, 0.045), r, { pos: [0, 0.37, 0], rot: [Math.PI / 2, 0, 0], parent: m.torso });
      } },
    { id: 'astro', name: 'Phi Hành Gia', emoji: '🧑‍🚀', shirt: '#f8fafc', shorts: '#e2e8f0', accent: '#f97316',
      build: function (m, H) {
        hideEars(m);
        H.lN(H.lU(0.37, 28), mat(H, '#bfe9ff', { transparent: true, opacity: 0.22, roughness: 0.1, metalness: 0.2 }), { scale: [1, 0.97, 1], parent: m.head });
        H.lN(H.lz(0.21, 0.035), mat(H, '#e2e8f0', { metalness: 0.5 }), { pos: [0, -0.27, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        H.lN(H.lD(0.24, 0.3, 0.12), mat(H, '#cbd5e1', { metalness: 0.4 }), { pos: [0, 0.2, -0.24], cast: true, parent: m.torso });
        H.lN(H.lU(0.03, 8), mat(H, '#f97316', { emissive: '#c2410c' }), { pos: [-0.08, 0.26, 0.2], parent: m.torso });
        H.lN(H.lU(0.03, 8), mat(H, '#22c55e', { emissive: '#15803d' }), { pos: [0.08, 0.26, 0.2], parent: m.torso });
      } },
    { id: 'dj', name: 'DJ Idol', emoji: '🎧', shirt: '#7e22ce', shorts: '#be185d', accent: '#22d3ee',
      build: function (m, H) {
        var n = mat(H, '#22d3ee', { emissive: '#0891b2', emissiveIntensity: 0.8 });
        H.lN(H.lz(0.3, 0.024, Math.PI), n, { pos: [0, 0.03, 0], cast: true, parent: m.head });
        H.lN(H.lU(0.075, 14), mat(H, '#ec4899', { emissive: '#be185d' }), { pos: [0.3, 0.03, 0], scale: [0.55, 1, 1], parent: m.head });
        H.lN(H.lU(0.075, 14), mat(H, '#ec4899', { emissive: '#be185d' }), { pos: [-0.3, 0.03, 0], scale: [0.55, 1, 1], parent: m.head });
        H.lN(H.lz(0.14, 0.02), n, { pos: [0, 0.24, 0.2], parent: m.torso });
      } },
    { id: 'vietnam', name: 'Tuyển Việt Nam', emoji: '🇻🇳', shirt: '#da251d', shorts: '#ffcd00', accent: '#ffcd00',
      build: function (m, H) {
        star(H, m.torso, [0, 0.24, 0.205], 0.12, '#ffcd00', '#b38f00');
        H.lN(H.lz(0.285, 0.026), mat(H, '#da251d'), { pos: [0, 0.11, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        star(H, m.head, [0, 0.11, 0.285], 0.07, '#ffcd00', '#b38f00');
      } },
    { id: 'shaolin', name: 'Thiếu Lâm', emoji: '🥋', shirt: '#f59e0b', shorts: '#b45309', accent: '#7c2d12',
      build: function (m, H) {
        var b = mat(H, '#7c2d12');
        for (var i = 0; i < 12; i++) {
          var a = (i * 2 * Math.PI) / 12;
          H.lN(H.lU(0.026, 8), b, { pos: [Math.sin(a) * 0.15, 0.36 - Math.cos(a) * 0.03 - 0.02, Math.cos(a) * 0.15], parent: m.torso });
        }
        H.lN(H.lD(0.5, 0.05, 0.04), mat(H, '#1f2937'), { pos: [0, 0.02, 0.17], parent: m.torso });
        H.lN(H.lz(0.285, 0.022), mat(H, '#fde68a'), { pos: [0, 0.1, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
      } },
    { id: 'cowboy', name: 'Cao Bồi', emoji: '🤠', shirt: '#c2410c', shorts: '#1e3a8a', accent: '#fef3c7',
      build: function (m, H) {
        hideEars(m);
        var br = mat(H, '#92400e');
        H.lN(H.lk(0.4, 0.4, 0.025, 28), br, { pos: [0, 0.26, 0], cast: true, parent: m.head });
        H.lN(H.lk(0.2, 0.22, 0.2, 22), br, { pos: [0, 0.37, 0], cast: true, parent: m.head });
        H.lN(H.lz(0.215, 0.025), mat(H, '#451a03'), { pos: [0, 0.31, 0], rot: [Math.PI / 2, 0, 0], parent: m.head });
        H.lN(H.lz(0.15, 0.035), mat(H, '#dc2626'), { pos: [0, 0.37, 0], rot: [Math.PI / 2, 0, 0], parent: m.torso });
      } }
  ];

  // ------------------------------------------------------------------
  // STATE
  // ------------------------------------------------------------------
  function load() {
    try { var s = JSON.parse(localStorage.getItem(LS_KEY)); if (s && typeof s === 'object') return s; } catch (e) {}
    return { racket: 'classic', outfit: 'default' };
  }
  var state = load();
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return list[0]; }
  function curRacket() { return byId(RACKETS, state.racket); }
  function curOutfit() { return byId(OUTFITS, state.outfit); }

  // ------------------------------------------------------------------
  // API USED BY THE GAME BUNDLE
  // ------------------------------------------------------------------
  var API = {
    state: state,
    skinDef: function (def) {
      var r = curRacket(), o = curOutfit();
      if (r.id === 'classic' && o.id === 'default') return def;
      var d = {};
      for (var k in def) d[k] = def[k];
      if (o.shirt) { d.shirt = o.shirt; d.shorts = o.shorts; d.accent = o.accent; }
      if (r.frame) d.racket = r.frame;
      d.__sk = true;
      d.__rk = r.id;
      d.__of = o.id;
      return d;
    },
    frameOpts: function (def) {
      if (!def || !def.__sk) return { roughness: 0.4 };
      var r = byId(RACKETS, def.__rk);
      var o = { key: 'rk|' + r.id + '|' + def.racket, roughness: r.rough != null ? r.rough : 0.4 };
      if (r.metal) o.metalness = r.metal;
      if (r.emissive) { o.emissive = r.emissive; o.emissiveIntensity = r.ei || 0.5; }
      return o;
    },
    stringColor: function (def) {
      if (!def || !def.__sk) return '#ffffff';
      var r = byId(RACKETS, def.__rk);
      return r.str || '#ffffff';
    },
    stringOpacity: function (def) {
      if (!def || !def.__sk) return 0.45;
      var r = byId(RACKETS, def.__rk);
      return r.strOp != null ? r.strOp : 0.45;
    },
    decorate: function (m, def, H) {
      try {
        var r = byId(RACKETS, def.__rk), o = byId(OUTFITS, def.__of);
        if (r && m.racketHead) buildRacketExtras(m, r, H);
        if (o && o.build) o.build(m, H);
      } catch (e) { if (window.console) console.warn('[BirdieSkins] decorate failed', e); }
    }
  };

  function ringPos(a, k) { k = k || 1; return [0, Math.cos(a) * 0.108 * k, Math.sin(a) * 0.082 * k]; }

  function buildRacketExtras(m, r, H) {
    var rh = m.racketHead;
    if (r.glow) {
      H.lN(H.lz(0.108, 0.007), H.lC(r.glow.c, { key: 'rg|' + r.id, transparent: true, opacity: r.glow.op, emissive: r.glow.c, emissiveIntensity: 1 }),
        { scale: [0.82, 1.08, 1], rot: [0, Math.PI / 2, 0], parent: rh });
    }
    if (r.gem) {
      for (var i = 0; i < r.gem.n; i++) {
        var a = (i / r.gem.n) * Math.PI * 2;
        var o = { key: 'rgem|' + r.id };
        if (r.gem.emissive) { o.emissive = r.gem.emissive; o.emissiveIntensity = 0.9; }
        H.lN(H.lU(r.gem.r, 8), H.lC(r.gem.c, o), { pos: ringPos(a), scale: r.gem.flat ? [0.6, 1.3, 1.3] : 1, parent: rh });
      }
    }
    if (r.rainbow) {
      var cols = ['#ef4444', '#f97316', '#facc15', '#22c55e', '#38bdf8', '#6366f1', '#a855f7'];
      for (var j = 0; j < cols.length; j++) {
        var rr = 0.1 + j * 0.0035;
        H.lN(H.lz(rr, 0.0045), H.lC(cols[j], { key: 'rb|' + cols[j], emissive: cols[j], emissiveIntensity: 0.5 }),
          { scale: [0.82, 1.08, 1], rot: [0, Math.PI / 2, 0], parent: rh });
      }
    }
  }

  window.__birdieSkins = API;

  // ------------------------------------------------------------------
  // UI (floating button + panel). Pure DOM so it does not touch React.
  // ------------------------------------------------------------------
  function hex2css(c) { return c || '#e5e7eb'; }

  function css() {
    if (document.getElementById('bsk-css')) return;
    var s = document.createElement('style');
    s.id = 'bsk-css';
    s.textContent =
      '#bsk-btn{position:fixed;top:56px;right:14px;z-index:99998;width:42px;height:42px;border-radius:50%;border:2px solid #f0abfc;background:linear-gradient(135deg,#fdf4ff,#fce7f3);box-shadow:0 4px 14px rgba(190,24,93,.25);font-size:21px;line-height:38px;text-align:center;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;padding:0}' +
      '#bsk-btn:active{transform:scale(.93)}' +
      '#bsk-ov{position:fixed;inset:0;z-index:99999;background:rgba(30,16,40,.55);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
      '#bsk-ov.on{display:flex}' +
      '#bsk-pn{width:min(94vw,520px);max-height:88vh;background:#fffaf7;border:3px solid #f5d0e6;border-radius:22px;box-shadow:0 18px 50px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;color:#2b1f2b}' +
      '#bsk-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(90deg,#fbcfe8,#e9d5ff);font-weight:800;font-size:17px}' +
      '#bsk-x{border:0;background:rgba(255,255,255,.7);border-radius:50%;width:32px;height:32px;font-size:16px;font-weight:800;cursor:pointer}' +
      '#bsk-tabs{display:flex;gap:8px;padding:10px 14px 4px}' +
      '.bsk-tab{flex:1;padding:9px 6px;border-radius:12px;border:2px solid #ecdcd5;background:#fff;font-weight:700;font-size:14px;cursor:pointer}' +
      '.bsk-tab.on{background:#be185d;color:#fff;border-color:#be185d}' +
      '#bsk-grid{padding:10px 14px 6px;overflow-y:auto;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}' +
      '.bsk-card{position:relative;border:2.5px solid #ecdcd5;background:#fff;border-radius:14px;padding:10px 4px 8px;text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
      '.bsk-card.on{border-color:#be185d;background:#fdf2f8;box-shadow:0 0 0 2px #fbcfe8}' +
      '.bsk-card .e{font-size:28px;line-height:32px}' +
      '.bsk-card .n{font-size:12px;font-weight:700;margin-top:4px}' +
      '.bsk-card .d{display:flex;justify-content:center;gap:3px;margin-top:5px;min-height:10px}' +
      '.bsk-card .d i{width:10px;height:10px;border-radius:50%;border:1px solid rgba(0,0,0,.15)}' +
      '.bsk-card .ck{position:absolute;top:4px;right:6px;font-size:13px;color:#be185d;font-weight:900;display:none}' +
      '.bsk-card.on .ck{display:block}' +
      '#bsk-ft{padding:9px 16px 13px;font-size:12px;color:#7a5c6e;text-align:center}' +
      '#bsk-ft b{color:#be185d}';
    document.head.appendChild(s);
  }

  var tab = 'racket';
  function render() {
    var grid = document.getElementById('bsk-grid');
    if (!grid) return;
    var list = tab === 'racket' ? RACKETS : OUTFITS;
    var cur = tab === 'racket' ? state.racket : state.outfit;
    grid.innerHTML = '';
    list.forEach(function (it) {
      var c = document.createElement('div');
      c.className = 'bsk-card' + (it.id === cur ? ' on' : '');
      var dots = '';
      var cols = tab === 'racket' ? [it.frame, it.str] : [it.shirt, it.shorts, it.accent];
      cols.forEach(function (x) { if (x) dots += '<i style="background:' + hex2css(x) + '"></i>'; });
      if (it.rainbow) dots = '<i style="background:#ef4444"></i><i style="background:#facc15"></i><i style="background:#22c55e"></i><i style="background:#6366f1"></i>';
      c.innerHTML = '<span class="ck">✓</span><div class="e">' + it.emoji + '</div><div class="n">' + it.name + '</div><div class="d">' + dots + '</div>';
      c.onclick = function () {
        if (tab === 'racket') state.racket = it.id; else state.outfit = it.id;
        save(); render(); toast();
      };
      grid.appendChild(c);
    });
    document.querySelectorAll('.bsk-tab').forEach(function (t) { t.classList.toggle('on', t.dataset.t === tab); });
  }

  var toastT = null;
  function toast() {
    var f = document.getElementById('bsk-ft');
    if (!f) return;
    f.innerHTML = '✅ Đã lưu! Skin hiện ra ở <b>trận đấu mới</b> (vào lại trận / chọn lại nhân vật).';
    clearTimeout(toastT);
    toastT = setTimeout(function () { f.innerHTML = 'Skin chỉ hiển thị trên <b>nhân vật của bạn</b>.'; }, 3500);
  }

  function buildUI() {
    if (document.getElementById('bsk-btn')) return;
    css();
    var b = document.createElement('button');
    b.id = 'bsk-btn'; b.type = 'button'; b.title = 'Skin vợt & trang phục'; b.textContent = '🎨';
    var ov = document.createElement('div');
    ov.id = 'bsk-ov';
    ov.innerHTML =
      '<div id="bsk-pn"><div id="bsk-hd"><span>🎨 Skin Studio</span><button id="bsk-x" type="button">✕</button></div>' +
      '<div id="bsk-tabs"><button class="bsk-tab on" data-t="racket" type="button">🏸 Skin Vợt</button><button class="bsk-tab" data-t="outfit" type="button">🎭 Cosplay</button></div>' +
      '<div id="bsk-grid"></div><div id="bsk-ft">Skin chỉ hiển thị trên <b>nhân vật của bạn</b>.</div></div>';
    document.body.appendChild(b);
    document.body.appendChild(ov);
    function open() { ov.classList.add('on'); render(); }
    function close() { ov.classList.remove('on'); }
    b.addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.getElementById('bsk-x').addEventListener('click', close);
    document.querySelectorAll('.bsk-tab').forEach(function (t) {
      t.addEventListener('click', function () { tab = t.dataset.t; render(); });
    });
    ['touchstart', 'pointerdown', 'mousedown'].forEach(function (ev) {
      ov.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
      b.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
  setInterval(function () {
    if (!document.getElementById('bsk-btn') && document.body) {
      buildUI();
    }
  }, 500);
})();
