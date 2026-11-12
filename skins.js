// ============================================================
// BIRDIE BASH - MEME & TROLL SKIN STUDIO (BẢN ĐỘC QUYỀN)
// Cầm Ổ Bánh Mì, Bé Mèo, Chó Corgi, Chảo PUBG, Dép Tổ Ong...
// ============================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'birdie_meme_skins_v1';
  var state = { weapon: 'banhmi', costume: 'box_man' };

  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed.weapon) state.weapon = parsed.weapon;
      if (parsed.costume) state.costume = parsed.costume;
    }
  } catch (e) {}

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  // --- WEB AUDIO MEME SOUND SYNTHESIZER ---
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  function playMemeSound(weaponId) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    var w = weaponId || state.weapon;
    var t = ctx.currentTime;

    try {
      if (w === 'frying_pan') {
        // Metallic KEEENG!
        var osc1 = ctx.createOscillator();
        var osc2 = ctx.createOscillator();
        var gain = ctx.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1750, t);
        osc1.frequency.exponentialRampToValueAtTime(1200, t + 0.5);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(3200, t);
        osc2.frequency.exponentialRampToValueAtTime(1800, t + 0.35);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.6);
        osc2.stop(t + 0.6);
      } else if (w === 'banhmi') {
        // Crunchy Bánh Mì CRUNCH!
        var bufferSize = Math.floor(ctx.sampleRate * 0.25);
        var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
        }
        var noise = ctx.createBufferSource();
        noise.buffer = buffer;
        var filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, t);
        var ngain = ctx.createGain();
        ngain.gain.setValueAtTime(0.5, t);
        ngain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        noise.connect(filter);
        filter.connect(ngain);
        ngain.connect(ctx.destination);
        noise.start(t);
      } else if (w === 'fat_cat') {
        // MEOWW!
        var mOsc = ctx.createOscillator();
        var mGain = ctx.createGain();
        mOsc.type = 'sine';
        mOsc.frequency.setValueAtTime(850, t);
        mOsc.frequency.exponentialRampToValueAtTime(1350, t + 0.15);
        mOsc.frequency.exponentialRampToValueAtTime(950, t + 0.4);

        mGain.gain.setValueAtTime(0.05, t);
        mGain.gain.linearRampToValueAtTime(0.35, t + 0.08);
        mGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

        mOsc.connect(mGain);
        mGain.connect(ctx.destination);
        mOsc.start(t);
        mOsc.stop(t + 0.42);
      } else if (w === 'corgi') {
        // GÂU GÂU!
        var bOsc = ctx.createOscillator();
        var bGain = ctx.createGain();
        bOsc.type = 'sawtooth';
        bOsc.frequency.setValueAtTime(420, t);
        bOsc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
        bGain.gain.setValueAtTime(0.3, t);
        bGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        bOsc.connect(bGain);
        bGain.connect(ctx.destination);
        bOsc.start(t);
        bOsc.stop(t + 0.2);
      } else if (w === 'slippers') {
        // BẸT BẸT!
        var sOsc = ctx.createOscillator();
        var sGain = ctx.createGain();
        sOsc.type = 'triangle';
        sOsc.frequency.setValueAtTime(240, t);
        sOsc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
        sGain.gain.setValueAtTime(0.5, t);
        sGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        sOsc.connect(sGain);
        sGain.connect(ctx.destination);
        sOsc.start(t);
        sOsc.stop(t + 0.18);
      } else if (w === 'sword') {
        // XOẸT!
        var swOsc = ctx.createOscillator();
        var swGain = ctx.createGain();
        swOsc.type = 'sine';
        swOsc.frequency.setValueAtTime(2200, t);
        swOsc.frequency.exponentialRampToValueAtTime(400, t + 0.22);
        swGain.gain.setValueAtTime(0.35, t);
        swGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        swOsc.connect(swGain);
        swGain.connect(ctx.destination);
        swOsc.start(t);
        swOsc.stop(t + 0.22);
      } else if (w === 'fish') {
        // BÉP BÉP!
        var fOsc = ctx.createOscillator();
        var fGain = ctx.createGain();
        fOsc.type = 'sine';
        fOsc.frequency.setValueAtTime(480, t);
        fOsc.frequency.exponentialRampToValueAtTime(140, t + 0.18);
        fGain.gain.setValueAtTime(0.4, t);
        fGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        fOsc.connect(fGain);
        fGain.connect(ctx.destination);
        fOsc.start(t);
        fOsc.stop(t + 0.2);
      } else if (w === 'plunger') {
        // BỤP BỤP!
        var pOsc = ctx.createOscillator();
        var pGain = ctx.createGain();
        pOsc.type = 'sine';
        pOsc.frequency.setValueAtTime(160, t);
        pOsc.frequency.exponentialRampToValueAtTime(540, t + 0.1);
        pOsc.frequency.exponentialRampToValueAtTime(100, t + 0.22);
        pGain.gain.setValueAtTime(0.4, t);
        pGain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);
        pOsc.connect(pGain);
        pGain.connect(ctx.destination);
        pOsc.start(t);
        pOsc.stop(t + 0.22);
      }
    } catch (e) {}
  }

  // --- 3D DECORATE HOOK ---
  function decorate(model, def, H) {
    if (!model || !H) return;
    var lN = H.lN, lP = H.lP, lU = H.lU, lk = H.lk, lz = H.lz, lF = H.lF, lD = H.lD, lC = H.lC;
    if (!lN || !lP) return;

    var curW = state.weapon || 'banhmi';
    var curC = state.costume || 'box_man';

    // 1. ATTACH 3D MEME WEAPON
    if (model.racketHead && model.racketHead.parent && curW !== 'classic') {
      var rkRoot = model.racketHead.parent;
      // Hide standard racket children
      for (var i = 0; i < rkRoot.children.length; i++) {
        var ch = rkRoot.children[i];
        if (!ch.__isCustomWeapon) ch.visible = false;
      }

      var wGrp = lP(rkRoot, [0, -0.32, 0]);
      wGrp.__isCustomWeapon = true;

      if (curW === 'banhmi') {
        // 🥖 Ổ Bánh Mì
        lN(lk(0.065, 0.052, 0.44, 12), lC('#d97706', { roughness: 0.6 }), {
          pos: [0, 0, 0], scale: [0.75, 1, 0.65], cast: true, parent: wGrp
        });
        // 3 slits
        lN(lF(0.08, 0.015, 0.03), lC('#78350f'), { pos: [0, 0.1, 0.04], parent: wGrp });
        lN(lF(0.08, 0.015, 0.03), lC('#78350f'), { pos: [0, 0, 0.04], parent: wGrp });
        lN(lF(0.08, 0.015, 0.03), lC('#78350f'), { pos: [0, -0.1, 0.04], parent: wGrp });
        // Cucumber & chili
        lN(lU(0.024, 8), lC('#22c55e'), { pos: [0.03, 0.06, 0.04], parent: wGrp });
        lN(lU(0.018, 6), lC('#ef4444'), { pos: [-0.02, -0.04, 0.04], parent: wGrp });
        // Paper wrap handle
        lN(lk(0.048, 0.048, 0.12, 10), lC('#fef3c7'), { pos: [0, -0.2, 0], parent: wGrp });
        lN(lz(0.05, 0.008, 6, 12), lC('#dc2626'), { pos: [0, -0.18, 0], rot: [Math.PI / 2, 0, 0], parent: wGrp });
      } else if (curW === 'fat_cat') {
        // 🐱 Bé Mèo Béo
        lN(lU(0.14, 16), lC('#fb923c', { roughness: 0.7 }), { pos: [0, 0, 0], scale: [1, 1.25, 0.95], cast: true, parent: wGrp });
        lN(lU(0.1, 14), lC('#fff7ed'), { pos: [0, 0, 0.05], parent: wGrp });
        lN(lD(0.035, 0.07, 4), lC('#ea580c'), { pos: [-0.06, 0.14, 0], parent: wGrp });
        lN(lD(0.035, 0.07, 4), lC('#ea580c'), { pos: [0.06, 0.14, 0], parent: wGrp });
        lN(lU(0.016, 8), lC('#18181b'), { pos: [-0.038, 0.04, 0.12], parent: wGrp });
        lN(lU(0.016, 8), lC('#18181b'), { pos: [0.038, 0.04, 0.12], parent: wGrp });
        lN(lD(0.012, 0.016, 3), lC('#f43f5e'), { pos: [0, 0.015, 0.13], rot: [Math.PI, 0, 0], parent: wGrp });
        // Tail handle
        lN(lk(0.022, 0.018, 0.22, 8), lC('#ea580c'), { pos: [0, -0.22, 0], parent: wGrp });
      } else if (curW === 'corgi') {
        // 🐶 Chó Corgi Mông Tim
        lN(lU(0.1, 14), lC('#f59e0b', { roughness: 0.7 }), { pos: [-0.05, 0.02, 0], cast: true, parent: wGrp });
        lN(lU(0.1, 14), lC('#f59e0b', { roughness: 0.7 }), { pos: [0.05, 0.02, 0], cast: true, parent: wGrp });
        lN(lU(0.075, 12), lC('#ffffff'), { pos: [0, 0.02, 0.04], parent: wGrp });
        lN(lU(0.028, 8), lC('#fb7185'), { pos: [0, 0.03, 0.09], parent: wGrp });
        lN(lU(0.032, 8), lC('#f59e0b'), { pos: [0, 0.13, -0.02], parent: wGrp });
        // Handle
        lN(lk(0.022, 0.018, 0.2, 8), lC('#b45309'), { pos: [0, -0.2, 0], parent: wGrp });
      } else if (curW === 'frying_pan') {
        // 🍳 Chảo PUBG
        lN(lk(0.012, 0.012, 0.22, 8), lC('#18181b', { metalness: 0.8, roughness: 0.3 }), { pos: [0, 0.12, 0], parent: wGrp });
        lN(lk(0.16, 0.155, 0.025, 20), lC('#27272a', { metalness: 0.85, roughness: 0.3 }), { pos: [0, -0.1, 0], rot: [Math.PI / 2, 0, 0], cast: true, parent: wGrp });
        lN(lz(0.155, 0.016, 8, 20), lC('#09090b', { metalness: 0.9, roughness: 0.2 }), { pos: [0, -0.1, 0], rot: [Math.PI / 2, 0, 0], parent: wGrp });
        // Fried Egg
        lN(lU(0.055, 10), lC('#ffffff'), { pos: [0, -0.1, 0.015], scale: [1, 1, 0.2], parent: wGrp });
        lN(lU(0.025, 8), lC('#facc15'), { pos: [0.01, -0.1, 0.025], parent: wGrp });
      } else if (curW === 'slippers') {
        // 🩴 Dép Tổ Ong
        lN(lF(0.19, 0.38, 0.03), lC('#fef08a', { roughness: 0.8 }), { pos: [0, 0, 0], rot: [0, 0, -0.1], cast: true, parent: wGrp });
        lN(lz(0.085, 0.018, 6, 16), lC('#0284c7'), { pos: [0, 0.02, 0.03], rot: [0, Math.PI / 2, 0], parent: wGrp });
        // Holes dots
        for (var d = -0.12; d <= 0.12; d += 0.06) {
          lN(lU(0.008, 6), lC('#ca8a04'), { pos: [-0.04, d, 0.016], parent: wGrp });
          lN(lU(0.008, 6), lC('#ca8a04'), { pos: [0.04, d, 0.016], parent: wGrp });
        }
      } else if (curW === 'sword') {
        // 🗡️ Kiếm Pixel
        lN(lF(0.05, 0.44, 0.02), lC('#38bdf8', { metalness: 0.5, roughness: 0.2 }), { pos: [0, 0, 0], cast: true, parent: wGrp });
        lN(lF(0.065, 0.42, 0.015), lC('#0284c7'), { pos: [0, 0, 0], parent: wGrp });
        lN(lF(0.14, 0.035, 0.035), lC('#1e293b'), { pos: [0, -0.12, 0], parent: wGrp });
        lN(lk(0.014, 0.014, 0.14, 6), lC('#78350f'), { pos: [0, -0.21, 0], parent: wGrp });
      } else if (curW === 'fish') {
        // 🐟 Cá Muối Ươn
        lN(lU(0.12, 14), lC('#7dd3fc'), { pos: [0, -0.05, 0], scale: [0.55, 1.8, 0.4], cast: true, parent: wGrp });
        lN(lD(0.06, 0.12, 4), lC('#38bdf8'), { pos: [0, 0.12, 0], rot: [Math.PI, 0, 0], parent: wGrp });
        // Dead Eyes
        lN(lU(0.02, 6), lC('#ffffff'), { pos: [-0.03, -0.16, 0.04], parent: wGrp });
        lN(lU(0.02, 6), lC('#ffffff'), { pos: [0.03, -0.16, 0.04], parent: wGrp });
        lN(lU(0.01, 4), lC('#0f172a'), { pos: [-0.03, -0.16, 0.055], parent: wGrp });
        lN(lU(0.01, 4), lC('#0f172a'), { pos: [0.03, -0.16, 0.055], parent: wGrp });
      } else if (curW === 'plunger') {
        // 🪠 Cây Thụt Bồn Cầu
        lN(lk(0.014, 0.014, 0.34, 8), lC('#b45309'), { pos: [0, 0.05, 0], parent: wGrp });
        lN(lD(0.14, 0.11, 16), lC('#dc2626'), { pos: [0, -0.18, 0], rot: [Math.PI, 0, 0], cast: true, parent: wGrp });
      }
    }

    // 2. ATTACH 3D MEME COSTUME
    if (model.torso && curC !== 'default') {
      if (curC === 'box_man') {
        // 📦 Thùng Mì Hảo Hảo
        lN(lF(0.52, 0.58, 0.5), lC('#d97706', { roughness: 0.9 }), {
          pos: [0, 0.28, 0], cast: true, parent: model.torso
        });
        // Red stamp
        lN(lF(0.24, 0.1, 0.01), lC('#dc2626'), { pos: [0, 0.2, 0.252], parent: model.torso });
        // Eyeholes
        lN(lF(0.08, 0.05, 0.02), lC('#18181b'), { pos: [-0.1, 0.38, 0.252], parent: model.torso });
        lN(lF(0.08, 0.05, 0.02), lC('#18181b'), { pos: [0.1, 0.38, 0.252], parent: model.torso });
      } else if (curC === 'banana') {
        // 🍌 Quả Chuối Vàng
        lN(lU(0.3, 16), lC('#facc15', { roughness: 0.5 }), {
          pos: [0, 0.25, 0], scale: [0.92, 1.5, 0.88], cast: true, parent: model.torso
        });
        // Green stem on top
        lN(lk(0.03, 0.02, 0.14, 8), lC('#15803d'), { pos: [0, 0.65, -0.05], rot: [0.3, 0, 0], parent: model.torso });
      } else if (curC === 'dino') {
        // 🦖 Khủng Long Bơm Hơi
        lN(lU(0.28, 16), lC('#22c55e', { roughness: 0.6 }), {
          pos: [0, 0.22, 0], scale: [1.05, 1.22, 1.08], cast: true, parent: model.torso
        });
        // Tiny arms
        lN(lk(0.018, 0.012, 0.09, 6), lC('#15803d'), { pos: [-0.12, 0.25, 0.26], rot: [0.7, 0, 0.3], parent: model.torso });
        lN(lk(0.018, 0.012, 0.09, 6), lC('#15803d'), { pos: [0.12, 0.25, 0.26], rot: [0.7, 0, -0.3], parent: model.torso });
        // Tail
        lN(lD(0.1, 0.28, 8), lC('#16a34a'), { pos: [0, 0.1, -0.32], rot: [-1.2, 0, 0], parent: model.torso });
      } else if (curC === 'shark') {
        // 🦈 Cá Mập IKEA
        lN(lU(0.28, 16), lC('#0284c7', { roughness: 0.6 }), {
          pos: [0, 0.22, 0], scale: [1, 1.25, 1], cast: true, parent: model.torso
        });
        lN(lU(0.22, 12), lC('#f8fafc'), { pos: [0, 0.18, 0.12], parent: model.torso });
        // Fin on back
        lN(lD(0.07, 0.2, 4), lC('#0369a1'), { pos: [0, 0.32, -0.28], rot: [-1.2, 0, 0], parent: model.torso });
      } else if (curC === 'mummy') {
        // 🧻 Xác Ướp Cuộn Giấy
        for (var b = -0.06; b <= 0.36; b += 0.1) {
          lN(lz(0.22, 0.024, 6, 18), lC('#f8fafc', { roughness: 0.9 }), {
            pos: [0, b, 0], rot: [Math.PI / 2 + (Math.random() * 0.2 - 0.1), 0, (Math.random() * 0.2 - 0.1)], parent: model.torso
          });
        }
        // Trailing paper
        lN(lF(0.06, 0.28, 0.01), lC('#e2e8f0'), { pos: [0.1, 0.05, -0.24], rot: [0.4, 0, 0.2], parent: model.torso });
      } else if (curC === 'captain_sip') {
        // 🩲 Siêu Nhân Sịp Đỏ
        lN(lF(0.36, 0.48, 0.015), lC('#dc2626'), { pos: [0, 0.2, -0.22], rot: [0.25, 0, 0], parent: model.torso });
        // Red briefs outside!
        lN(lz(0.19, 0.035, 6, 20), lC('#ef4444'), { pos: [0, 0.06, 0], rot: [Math.PI / 2, 0, 0], parent: model.torso });
        lN(lz(0.2, 0.016, 6, 20), lC('#facc15'), { pos: [0, 0.1, 0], rot: [Math.PI / 2, 0, 0], parent: model.torso });
      }
    }
  }

  // --- WEAPONS & COSTUMES CATALOG ---
  var WEAPONS = [
    { id: 'banhmi', emoji: '🥖', name: 'Ổ Bánh Mì', sound: 'Rôm Rốp!', tier: '🔥 VIỆT NAM', desc: 'Bánh mì nóng giòn kẹp chả pate thơm phức. Khi smash văng ra vụn bánh rôm rốp!' },
    { id: 'fat_cat', emoji: '🐱', name: 'Bé Mèo Béo', sound: 'Meo Meo!', tier: '👑 HOÀNG THƯỢNG', desc: 'Cầm nguyên con mèo cam mập ú kêu Meo Meo ngơ ngác khi đỡ cầu!' },
    { id: 'corgi', emoji: '🐶', name: 'Corgi Mông Tim', sound: 'Gâu Gâu!', tier: '🍑 MÔNG TRÁI TIM', desc: 'Dùng chiếc mông trái tim huyền thoại của Corgi để bạt cầu siêu chuẩn!' },
    { id: 'frying_pan', emoji: '🍳', name: 'Chảo PUBG', sound: 'KEEENG!', tier: '🍳 HUYỀN THOẠI', desc: 'Đập cầu phát ra tiếng KENG vang dội khắp sân đấu, đỡ đạn cực đỉnh!' },
    { id: 'slippers', emoji: '🩴', name: 'Dép Tổ Ong', sound: 'BẸT BẸT!', tier: '⚡ MẪU THÂN', desc: 'Vũ khí tối thượng của mẹ: Dép cao su 1000 lỗ chém cầu siêu tốc!' },
    { id: 'sword', emoji: '🗡️', name: 'Kiếm Pixel', sound: 'Xoẹt Xoẹt!', tier: '⚔️ ANIME', desc: 'Thanh kiếm kim cương xanh chém đôi đường cầu lông đầy uy lực!' },
    { id: 'fish', emoji: '🐟', name: 'Cá Muối Ươn', sound: 'BÉP BÉP!', tier: '🌊 TẤU HÀI', desc: 'Con cá muối ươn mắt đờ đẫn quất vào quả cầu kêu Bép Bép cực vui tai!' },
    { id: 'plunger', emoji: '🪠', name: 'Thụt Cầu', sound: 'BỤP BỤP!', tier: '💩 BẤT BẠI', desc: 'Đầu cao su đỏ hút chân không mút dính quả cầu như nam châm!' },
    { id: 'classic', emoji: '🏸', name: 'Vợt Mặc Định', sound: 'Bốp!', tier: '⭐ CƠ BẢN', desc: 'Cây vợt thể thao tiêu chuẩn của hiệp hội cầu lông thế giới.' }
  ];

  var COSTUMES = [
    { id: 'box_man', emoji: '📦', name: 'Thùng Mì Hảo Hảo', sound: 'Sột Soạt!', tier: '🍜 ĐỈNH CAO BỰA', desc: 'Chui vào thùng các-tông mì tôm khoét 2 mắt ngơ ngác cực kỳ lầy lội!' },
    { id: 'banana', emoji: '🍌', name: 'Quả Chuối Vàng', sound: 'Tưng Tưng!', tier: '🍌 VIRAL', desc: 'Bộ đồ quả chuối vàng chói lọi nhún nhảy tưng tưng theo từng nhịp chân!' },
    { id: 'dino', emoji: '🦖', name: 'Khủng Long Bơm Hơi', sound: 'Gầm Mini!', tier: '🦖 NGÁO NGƠ', desc: 'Khủng long T-Rex bơm hơi lắc lư béo tròn với đôi tay ngắn cũn cỡn!' },
    { id: 'shark', emoji: '🦈', name: 'Cá Mập IKEA', sound: 'Doo Doo!', tier: '🦈 CUTE', desc: 'Hóa thân thành cá mập bông xanh ngơ ngác lướt trên sân cầu lông!' },
    { id: 'mummy', emoji: '🧻', name: 'Xác Ướp Giấy', sound: 'Xoẹt Giấy!', tier: '🧻 TIẾT KIỆM', desc: 'Quấn toàn thân bằng giấy vệ sinh 3 lớp vừa chạy vừa rơi giấy lả tả!' },
    { id: 'captain_sip', emoji: '🩲', name: 'Siêu Nhân Sịp Đỏ', sound: 'Piu Piu!', tier: '🦸 ANH HÙNG', desc: 'Mặc quần sịp đỏ chói lọi ra ngoài quần dài với áo choàng bay phấp phới!' },
    { id: 'default', emoji: '👕', name: 'Đồ Thể Thao', sound: 'Cơ bản', tier: '⭐ THỂ THAO', desc: 'Bộ quần áo thi đấu thể thao tiêu chuẩn thoáng mát.' }
  ];

  // --- UI CONSTRUCTION ---
  var tab = 'weapons';

  function injectCSS() {
    if (document.getElementById('bsk-meme-css')) return;
    var s = document.createElement('style');
    s.id = 'bsk-meme-css';
    s.textContent =
      '@keyframes bskWiggle{0%,100%{transform:rotate(-3deg) scale(1)}50%{transform:rotate(3deg) scale(1.06)}}' +
      '#bsk-meme-btn{position:fixed;top:54px;right:14px;z-index:99998;height:38px;padding:0 14px;border-radius:999px;border:2.5px solid #f59e0b;background:linear-gradient(135deg,#fffbeb,#fef3c7);box-shadow:0 4px 14px rgba(245,158,11,.4);color:#78350f;font-weight:900;font-size:12px;display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;transition:transform .15s ease;font-family:system-ui,-apple-system,sans-serif}' +
      '#bsk-meme-btn:hover{transform:scale(1.05)}#bsk-meme-btn:active{transform:scale(.95)}' +
      '#bsk-meme-btn .ico{font-size:18px;animation:bskWiggle 1.5s ease-in-out infinite}' +
      '#bsk-meme-ov{position:fixed;inset:0;z-index:99999;background:rgba(30,16,40,.6);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:none;align-items:center;justify-content:center;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:12px}' +
      '#bsk-meme-ov.on{display:flex}' +
      '#bsk-meme-pn{width:min(94vw,540px);max-height:90vh;background:#fffdfa;border:3.5px solid #f59e0b;border-radius:26px;box-shadow:0 20px 60px rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;color:#2b1f2b}' +
      '#bsk-meme-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:linear-gradient(90deg,#fef3c7,#fed7aa);border-bottom:2.5px solid #f59e0b}' +
      '#bsk-meme-hd h3{margin:0;font-size:16px;font-weight:900;color:#78350f;display:flex;align-items:center;gap:6px;flex:1}' +
      '#bsk-meme-x{background:rgba(255,255,255,.8);border:2px solid #f59e0b;color:#78350f;font-weight:900;width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
      '#bsk-meme-tabs{display:flex;gap:8px;padding:10px 14px;background:#fff7ed;border-bottom:1.5px solid #fed7aa}' +
      '.bsk-m-tab{flex:1;padding:8px;border-radius:12px;border:2px solid #fcd34d;background:#ffffff;color:#78350f;font-weight:800;font-size:12px;cursor:pointer;transition:all .15s ease}' +
      '.bsk-m-tab.on{background:linear-gradient(135deg,#f59e0b,#ea580c);color:#ffffff;border-color:#b45309;box-shadow:0 3px 10px rgba(234,88,12,.35)}' +
      '#bsk-meme-body{display:flex;flex-direction:column;gap:10px;padding:14px;overflow-y:auto;max-height:calc(90vh - 170px)}' +
      '#bsk-meme-preview{background:linear-gradient(135deg,#fef3c7,#fffbeb);border:2px solid #fde68a;border-radius:18px;padding:12px;display:flex;align-items:center;gap:14px}' +
      '#bsk-prev-ico{font-size:46px;width:70px;height:70px;background:#ffffff;border:2.5px solid #f59e0b;border-radius:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(245,158,11,.2);flex-shrink:0}' +
      '#bsk-prev-info{flex:1}' +
      '#bsk-prev-name{font-size:15px;font-weight:900;color:#78350f;margin-bottom:2px}' +
      '#bsk-prev-tier{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:900;background:#ea580c;color:#ffffff;margin-bottom:4px}' +
      '#bsk-prev-desc{font-size:11px;color:#451a03;line-height:1.4}' +
      '#bsk-meme-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:10px}' +
      '.bsk-m-card{position:relative;background:#ffffff;border:2.5px solid #fde68a;border-radius:16px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;cursor:pointer;transition:all .15s ease;text-align:center;min-height:96px}' +
      '.bsk-m-card:hover{border-color:#f59e0b;background:#fffbeb;transform:translateY(-2px)}' +
      '.bsk-m-card.on{border-color:#ea580c;background:#fff7ed;box-shadow:0 4px 14px rgba(234,88,12,.25);outline:2px solid #ea580c}' +
      '.bsk-m-card .ck{display:none;position:absolute;top:5px;right:6px;color:#ea580c;font-size:12px;font-weight:900}' +
      '.bsk-m-card.on .ck{display:block}' +
      '.bsk-m-card .e{font-size:32px;margin:2px 0}' +
      '.bsk-m-card .n{font-size:11px;font-weight:800;color:#2b1f2b;line-height:1.2;margin-top:2px}' +
      '.bsk-m-card .s{font-size:9px;font-weight:700;color:#ea580c;background:#fef3c7;padding:1px 6px;border-radius:999px;margin-top:4px}' +
      '#bsk-meme-ft{padding:10px 14px;background:#fef3c7;border-top:1.5px solid #fed7aa;font-size:11px;color:#78350f;text-align:center;font-weight:700}';
    document.head.appendChild(s);
  }

  function renderGrid() {
    var grid = document.getElementById('bsk-meme-grid');
    if (!grid) return;
    var list = tab === 'weapons' ? WEAPONS : COSTUMES;
    var cur = tab === 'weapons' ? state.weapon : state.costume;
    grid.innerHTML = '';

    list.forEach(function (item) {
      var card = document.createElement('div');
      card.className = 'bsk-m-card' + (item.id === cur ? ' on' : '');
      card.innerHTML =
        '<span class="ck">✓</span>' +
        '<div class="e">' + item.emoji + '</div>' +
        '<div class="n">' + item.name + '</div>' +
        '<div class="s">' + item.sound + '</div>';

      card.onclick = function () {
        if (tab === 'weapons') {
          state.weapon = item.id;
          playMemeSound(item.id);
        } else {
          state.costume = item.id;
        }
        save();
        updatePreview(item);
        renderGrid();
        showToast();
      };

      grid.appendChild(card);
    });

    document.querySelectorAll('.bsk-m-tab').forEach(function (t) {
      t.classList.toggle('on', t.dataset.t === tab);
    });

    // Update preview with active item
    var activeItem = list.find(function (x) { return x.id === cur; }) || list[0];
    updatePreview(activeItem);
  }

  function updatePreview(item) {
    var ico = document.getElementById('bsk-prev-ico');
    var name = document.getElementById('bsk-prev-name');
    var tier = document.getElementById('bsk-prev-tier');
    var desc = document.getElementById('bsk-prev-desc');
    if (!ico || !name || !tier || !desc) return;
    ico.textContent = item.emoji;
    name.textContent = item.name;
    tier.textContent = item.tier + ' · ' + item.sound;
    desc.textContent = item.desc;
  }

  var toastTimer = null;
  function showToast() {
    var ft = document.getElementById('bsk-meme-ft');
    if (!ft) return;
    ft.innerHTML = '🎉 <b>Đã Trang Bị!</b> Vào trận đấu mới để quẩy cùng vũ khí này!';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      ft.innerHTML = '💡 Skin & Vũ khí hiển thị trực tiếp trên <b>nhân vật của bạn</b> trong trận đấu!';
    }, 3500);
  }

  function buildUI() {
    if (document.getElementById('bsk-meme-btn')) return;
    injectCSS();

    var btn = document.createElement('button');
    btn.id = 'bsk-meme-btn';
    btn.type = 'button';
    btn.title = 'Mở Tủ Đồ Tấu Hài';
    btn.innerHTML = '<span class="ico">🤣</span><span>TỦ ĐỒ MEME</span>';

    var ov = document.createElement('div');
    ov.id = 'bsk-meme-ov';
    ov.innerHTML =
      '<div id="bsk-meme-pn">' +
        '<div id="bsk-meme-hd">' +
          '<h3><span>🤣</span> KHO ĐỒ TẤU HÀI (MEME STUDIO)</h3>' +
          '<button id="bsk-meme-x" type="button">✕</button>' +
        '</div>' +
        '<div id="bsk-meme-tabs">' +
          '<button class="bsk-m-tab on" data-t="weapons" type="button">🥖 Vũ Khí Bựa (8 Món)</button>' +
          '<button class="bsk-m-tab" data-t="costumes" type="button">📦 Trang Phục Lầy (6 Bộ)</button>' +
        '</div>' +
        '<div id="bsk-meme-body">' +
          '<div id="bsk-meme-preview">' +
            '<div id="bsk-prev-ico">🥖</div>' +
            '<div id="bsk-prev-info">' +
              '<div id="bsk-prev-name">Ổ Bánh Mì</div>' +
              '<span id="bsk-prev-tier">🔥 VIỆT NAM · Rôm Rốp!</span>' +
              '<div id="bsk-prev-desc">Bánh mì nóng giòn kẹp chả pate thơm phức.</div>' +
            '</div>' +
          '</div>' +
          '<div id="bsk-meme-grid"></div>' +
        '</div>' +
        '<div id="bsk-meme-ft">💡 Skin & Vũ khí hiển thị trực tiếp trên <b>nhân vật của bạn</b> trong trận đấu!</div>' +
      '</div>';

    document.body.appendChild(btn);
    document.body.appendChild(ov);

    function open() { ov.classList.add('on'); renderGrid(); }
    function close() { ov.classList.remove('on'); }

    btn.addEventListener('click', open);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.getElementById('bsk-meme-x').addEventListener('click', close);

    document.querySelectorAll('.bsk-m-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        tab = t.dataset.t;
        renderGrid();
      });
    });

    ['touchstart', 'pointerdown', 'mousedown'].forEach(function (ev) {
      ov.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
      btn.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
    });
  }

  // Guard loop to survive React 18 hydration
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
  setInterval(function () {
    if (!document.getElementById('bsk-meme-btn') && document.body) {
      buildUI();
    }
  }, 500);

  // Expose global API
  window.__birdieSkins = {
    state: state,
    skinDef: function (def) { return def; },
    frameOpts: function () { return { roughness: 0.4 }; },
    stringColor: function () { return '#ffffff'; },
    stringOpacity: function () { return 0.45; },
    decorate: decorate,
    playHitSound: function () { playMemeSound(); }
  };
})();
