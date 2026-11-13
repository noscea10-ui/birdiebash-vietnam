const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
};

// In-memory data store
let leaderboard = [
  { id: 'a258c451948a', name: 'Kim Ngân', char: 'pomu', wins: 185 },
  { id: '33b7defe4cc1', name: 'Eris', char: 'panko', wins: 142 },
  { id: 'a1e9ae3ad2ea', name: 'Lam Anh', char: 'pipi', wins: 128 },
  { id: '5f91b72e1c90', name: 'Cu Tý', char: 'ribbi', wins: 95 },
  { id: 'e48d3c2a11b3', name: 'Cu Tèo', char: 'bao', wins: 84 },
  { id: '90ab81ef45cd', name: 'Bảo Long', char: 'kina', wins: 62 },
  { id: '12ef45ab78cd', name: 'Minh Thư', char: 'momo', wins: 49 },
  { id: '43dcba9876ef', name: 'Tuấn Kiệt', char: 'goma', wins: 37 }
];

let sponsors = [
  { brand: 'Light', site: null },
  { brand: 'BirdieBash Community', site: null }
];

let accounts = new Map(); // token -> user data

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API Routes ---
  
  if (pathname === '/vi') {
    const viPath = path.join(ROOT, 'vi.html');
    if (fs.existsSync(viPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(viPath).pipe(res);
      return;
    }
  }

  if (pathname === '/api/account') {
    if (req.method === 'GET') {
      const auth = req.headers.authorization;
      const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
      const user = token && accounts.get(token) ? accounts.get(token) : null;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user }));
      return;
    }
    if (req.method === 'PATCH') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
  }

  if (pathname === '/api/account/signin') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const token = 'guest_token_' + Date.now();
        const user = {
          id: 'user_' + Math.floor(Math.random() * 100000),
          email: data.email || 'player@birdiebash.pro.vn',
          name: data.email ? data.email.split('@')[0] : 'Player',
          char: 'pomu',
          unlocked: ['pomu', 'churro', 'goma', 'kuri'],
          settings: {}
        };
        accounts.set(token, user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ user, token, ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid_request' }));
      }
    });
    return;
  }

  if (pathname === '/api/account/signup') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const token = 'user_token_' + Date.now();
        const user = {
          id: 'user_' + Math.floor(Math.random() * 100000),
          email: data.email,
          name: data.name || (data.email ? data.email.split('@')[0] : 'Player'),
          char: 'pomu',
          unlocked: ['pomu', 'churro', 'goma', 'kuri'],
          settings: {}
        };
        accounts.set(token, user);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ user, token, ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'invalid_request' }));
      }
    });
    return;
  }

  if (pathname === '/api/account/signout') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (pathname === '/api/account/email') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ registered: false }));
    return;
  }

  if (pathname === '/api/sponsor') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sponsors }));
      return;
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.brand) {
            sponsors.push({ brand: data.brand, site: data.website || null });
          }
        } catch (e) {}
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      });
      return;
    }
  }

  
  if (pathname === '/api/news') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      news: [
        {
          id: 10,
          title: "Đấu rank mở lúc 9h sáng thứ Bảy 14/11 🏆",
          body: "Chế độ đấu rank sắp ra mắt: thắng để lên bậc từ Bronze tới Legend và ghi tên lên bảng xếp hạng.\n\nTham gia group Facebook của Birdie Bash để theo dõi tin mới nhất!",
          link: "https://www.facebook.com/groups/1177262041630943",
          personal: false,
          at: "2026-11-13T02:25:36.346Z"
        },
        {
          id: 6,
          title: "Mới: đối thủ thoát trận vẫn được tính thắng 🏆",
          body: "Đối thủ thoát giữa trận online: nếu bạn đang dẫn và đã ghi ít nhất nửa số điểm cần thắng (6 điểm ở trận 11, 11 điểm ở trận 21), trận đó được tính là thắng. Người thoát vẫn bị tính thua.\n\nĐổi tên: người chơi đã đăng nhập đổi tên trong Profile rồi bấm Save, và mỗi 7 ngày chỉ đổi được một lần. Ai cũng còn một lần đổi ngay từ bây giờ, nên hãy chọn tên cho kỹ nhé!",
          link: null,
          personal: false,
          at: "2026-11-12T03:27:28.327Z"
        },
        {
          id: 4,
          title: "Luật mới: Dive, phông lao, smash mạnh hơn 🏸",
          body: "Theo góp ý của các bạn top bảng xếp hạng:\n\nBay người (Dive): chỉ cứu được cầu lúc đang lao. Bay liên tiếp thì nằm sân lâu hơn (1,5 giây, rồi 2 giây); nghỉ 6 giây là trở lại bình thường.\n\nPhông lao (mới): nhảy rồi bấm Clear, cầu bay thấp, nhanh, sâu tận cuối sân.\n\nSmash: đánh Perfect, giữ lực và nhảy đập đều mạnh hơn trước.",
          link: "/vi#cach-choi",
          personal: false,
          at: "2026-11-12T02:26:45.337Z"
        },
        {
          id: 3,
          title: "Mới: report, kết bạn sau trận, lịch sử đấu đầy đủ",
          body: "Report và kết bạn ngay ở màn kết quả sau mỗi trận online.\n\nẢnh đại diện của bạn hiện trên bảng điểm trong trận.\n\nProfile mới: xem toàn bộ lịch sử đấu bằng nút Show more. Từ nay game giữ lại mọi trận của bạn.\n\nMở Online match nhanh hơn, chơi nhiều trận liên tục đỡ nóng máy; bảng emote không còn bị che khi cầm ngang điện thoại.",
          link: null,
          personal: false,
          at: "2026-11-12T02:26:45.330Z"
        },
        {
          id: 2,
          title: "04:30 Sáng mai sẽ có bản cập nhật mới nha !!!",
          body: "Thông tin cập nhật chi tiết mọi người theo dõi trên group FB nhé. Thanks all!",
          link: "https://www.facebook.com/groups/1177262041630943",
          personal: false,
          at: "2026-11-11T16:26:04.675Z"
        },
        {
          id: 1,
          title: "Mới: Voice chat và 2v2 đấu bot cùng bạn bè 🎤",
          body: "Vào phòng là nghe được nhau ngay, bấm nút mic cạnh nút chat để nói (2v2 chọn Everyone hoặc My team). Rủ bạn đấu 2 bot: Play vs bot → Mode → 2v2 → Copy invite link. Nên đeo tai nghe nhé!",
          link: "/",
          personal: false,
          at: "2026-11-11T02:20:41.846Z"
        }
      ],
      seen: null
    }));
    return;
  }

  
  if (pathname === '/api/friends') {
    const auth = req.headers.authorization;
    const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const user = token && accounts.get(token) ? accounts.get(token) : null;
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'not_signed_in' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ friends: [], pending: [] }));
    return;
  }

  if (pathname === '/api/leaderboard') {
    const page = parseInt(parsedUrl.searchParams.get('page') || '1', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      top: leaderboard,
      page,
      totalPages: 1,
      totalPlayers: leaderboard.length
    }));
    return;
  }

  if (pathname === '/api/match') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, achievements: [] }));
    });
    return;
  }

  // --- Static Files ---
  if (pathname === '/') {
    pathname = '/index.html';
  }

  let filePath = path.join(ROOT, pathname);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (pathname.startsWith('/_next/')) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      filePath = path.join(ROOT, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const stream = fs.createReadStream(filePath);
    const isDynamic = ext === '.html' || ext === '.js' || ext === '.css' || ext === '.json' || ext === '.webmanifest';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isDynamic ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400'
    });
    stream.pipe(res);
  });
});

// --- WebSocket Match & Lobby Engine ---
const wss = new WebSocketServer({ noServer: true });

const activeClients = new Set();
const matchQueue = [];
const activeRooms = new Map();

function broadcastRooms() {
  const roomList = [];
  const liveList = [];
  for (const [code, r] of activeRooms.entries()) {
    if (r.playing) {
      liveList.push({
        id: code,
        format: r.format,
        venue: r.venue,
        score: r.score || [0, 0],
        players: r.players.map(p => ({ name: p.name, char: p.char }))
      });
    } else {
      roomList.push({
        id: code,
        code,
        format: r.format,
        venue: r.venue,
        points: r.points,
        players: r.players.filter(Boolean).length,
        maxPlayers: r.format === 'doubles' ? 4 : 2
      });
    }
  }

  const payload = JSON.stringify({
    t: 'rooms',
    rooms: roomList,
    live: liveList,
    roomsTotal: roomList.length,
    liveTotal: liveList.length
  });

  for (const client of activeClients) {
    if (client.browsing && client.readyState === 1) {
      client.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  if (ws._socket) {
    ws._socket.setNoDelay(true);
  }
  activeClients.add(ws);
  ws.profile = { name: 'Kim Ngân', char: 'pomu' };
  ws.room = null;
  ws.seat = -1;
  ws.browsing = false;

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      switch (data.t) {
        case 'hello':
          ws.profile = {
            name: data.name || 'Kim Ngân',
            char: data.char || 'pomu'
          };
          ws.send(JSON.stringify({
            t: 'welcome',
            online: activeClients.size,
            updating: false,
            version: 'dev'
          }));
          break;

        case 'ping':
          ws.send(JSON.stringify({
            t: 'pong',
            c: data.c,
            s: Date.now()
          }));
          break;

        case 'browse':
          ws.browsing = !!data.on;
          if (ws.browsing) {
            broadcastRooms();
          }
          break;

        case 'queue': {
          // Remove if already in queue
          const qIdx = matchQueue.indexOf(ws);
          if (qIdx !== -1) matchQueue.splice(qIdx, 1);

          if (matchQueue.length > 0) {
            const opponent = matchQueue.shift();
            if (opponent.readyState === 1) {
              // Start a match!
              const venue = 'gym';
              const points = 5;
              const startAt = Date.now() + 1000;
              const players = [opponent.profile, ws.profile];

              const roomObj = {
                code: 'Q_' + Math.random().toString(36).substring(2, 7).toUpperCase(),
                format: 'singles',
                venue,
                points,
                playing: true,
                score: [0, 0],
                players: [opponent, ws],
                startAt,
                lastLandedFlightId: null,
                lastHit: null
              };
              opponent.room = roomObj;
              ws.room = roomObj;
              opponent.seat = 0;
              ws.seat = 1;

              opponent.send(JSON.stringify({
                t: 'start',
                format: 'singles',
                venue,
                points,
                seat: 0,
                startAt,
                players,
                serve: { k: 0, server: 0, receiver: 1, courts: [0, 1], wind: [0, 0] },
                score: [0, 0]
              }));

              ws.send(JSON.stringify({
                t: 'start',
                format: 'singles',
                venue,
                points,
                seat: 1,
                startAt,
                players,
                serve: { k: 0, server: 0, receiver: 1, courts: [0, 1], wind: [0, 0] },
                score: [0, 0]
              }));
              broadcastRooms();
              break;
            }
          }

          matchQueue.push(ws);
          ws.send(JSON.stringify({
            t: 'queued',
            players: activeClients.size
          }));
          break;
        }

        case 'party': {
          const code = Math.random().toString(36).substring(2, 6).toUpperCase();
          const format = data.format || 'singles';
          const maxPlayers = format === 'quads' ? 8 : format === 'triples' ? 6 : format === 'doubles' ? 4 : 2;
          const players = new Array(maxPlayers).fill(null);
          players[0] = ws;

          const roomObj = {
            code,
            format,
            venue: data.venue || 'gym',
            points: data.points || 5,
            playing: false,
            score: [0, 0],
            players
          };
          activeRooms.set(code, roomObj);
          ws.room = roomObj;
          ws.seat = 0;
          ws.send(JSON.stringify({
            t: 'party',
            code,
            format
          }));
          broadcastRooms();
          break;
        }

        case 'join': {
          const code = (data.code || '').toUpperCase();
          const r = activeRooms.get(code);
          if (!r || r.playing) {
            ws.send(JSON.stringify({ t: 'error', msg: 'Room not found or game already started.' }));
            break;
          }

          const emptySlot = r.players.indexOf(null);
          if (emptySlot === -1) {
            ws.send(JSON.stringify({ t: 'error', msg: 'Phòng đã đủ người chơi!' }));
            break;
          }

          r.players[emptySlot] = ws;
          ws.room = r;
          ws.seat = emptySlot;

          const activeCount = r.players.filter(Boolean).length;
          const maxCount = r.format === 'quads' ? 8 : r.format === 'triples' ? 6 : r.format === 'doubles' ? 4 : 2;

          if (activeCount === maxCount || (r.format === 'singles' && activeCount >= 2)) {
            r.playing = true;
            const startAt = Date.now() + 1000;
            r.startAt = startAt;
            r.score = [0, 0];
            r.lastLandedFlightId = null;
            r.lastHit = null;
            const players = r.players.filter(Boolean).map(p => p.profile);

            r.players.forEach((p, idx) => {
              if (p && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'start',
                  format: r.format,
                  venue: r.venue,
                  points: r.points,
                  seat: idx,
                  startAt,
                  players,
                  serve: { k: 0, server: 0, receiver: 1, courts: [0, 1], wind: [0, 0] },
                  score: [0, 0]
                }));
              }
            });
          }
          broadcastRooms();
          break;
        }

        case 'cancel': {
          const qIdx = matchQueue.indexOf(ws);
          if (qIdx !== -1) matchQueue.splice(qIdx, 1);
          if (ws.room) {
            activeRooms.delete(ws.room.code);
            ws.room = null;
          }
          broadcastRooms();
          break;
        }

        case 'leave': {
          if (ws.room) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({ t: 'left' }));
              }
            }
            activeRooms.delete(ws.room.code);
            ws.room = null;
          }
          broadcastRooms();
          break;
        }

        case 'state': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'state',
                  seat: ws.seat,
                  k: data.k,
                  s: data.s
                }));
              }
            }
          }
          break;
        }

        case 'hit': {
          if (ws.room && ws.room.players) {
            ws.room.lastHit = {
              seat: ws.seat,
              id: data.id,
              k: data.k,
              p: data.p,
              v: data.v,
              kind: data.kind,
              q: data.q,
              serve: data.serve
            };
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'launch',
                  seat: ws.seat,
                  id: data.id,
                  k: data.k,
                  p: data.p,
                  v: data.v,
                  kind: data.kind,
                  q: data.q,
                  serve: data.serve
                }));
              }
            }
          }
          break;
        }

        case 'landed': {
          if (!ws.room || !ws.room.playing) break;
          const room = ws.room;

          // Prevent processing same landing multiple times
          if (room.lastLandedFlightId === data.id && data.id !== undefined) {
            break;
          }
          room.lastLandedFlightId = data.id;

          let winner = 0;
          let call = 'in';
          let at = [0, 3];

          if (data.call && typeof data.winner === 'number') {
            winner = data.winner;
            call = data.call;
            at = Array.isArray(data.at) ? data.at : [0, 3];
          } else {
            // Default server fallback: hitter scores if no info
            const hitter = room.lastHit ? room.lastHit.seat : 0;
            winner = hitter;
          }

          room.score = room.score || [0, 0];
          room.score[winner] = (room.score[winner] || 0) + 1;

          const scoreA = room.score[0];
          const scoreB = room.score[1];
          const target = room.points || 5;

          const winA = (scoreA >= target && scoreA - scoreB >= 2) || (scoreA >= target + 9);
          const winB = (scoreB >= target && scoreB - scoreA >= 2) || (scoreB >= target + 9);

          let over = null;
          if (winA) over = 0;
          else if (winB) over = 1;

          let next = null;
          if (over === null) {
            const nextServer = winner;
            const nextReceiver = 1 - nextServer;
            const currentTick = Math.floor((Date.now() - (room.startAt || Date.now())) * 120 / 1000);
            const nextTick = Math.max(0, currentTick) + 150; // Schedule next serve ~1.25s ahead

            next = {
              k: nextTick,
              server: nextServer,
              receiver: nextReceiver,
              courts: [0, 1],
              wind: [0, 0]
            };
          } else {
            room.playing = false;
          }

          const pointPayload = JSON.stringify({
            t: 'point',
            winner,
            call,
            at,
            score: [room.score[0], room.score[1]],
            over,
            next
          });

          for (const p of room.players) {
            if (p && p.readyState === 1) {
              p.send(pointPayload);
            }
          }

          broadcastRooms();
          break;
        }

        case 'rematch': {
          if (!ws.room) break;
          const room = ws.room;
          ws.rematchRequested = true;

          // Notify opponent that rematch was requested
          for (const p of room.players) {
            if (p && p !== ws && p.readyState === 1) {
              p.send(JSON.stringify({ t: 'rematch' }));
            }
          }

          // If both requested rematch, start fresh match!
          const allRematch = room.players.every(p => p && p.rematchRequested);
          if (allRematch && room.players.length >= 2) {
            room.players.forEach(p => { if (p) p.rematchRequested = false; });
            room.playing = true;
            room.score = [0, 0];
            room.lastLandedFlightId = null;
            room.lastHit = null;
            const startAt = Date.now() + 1000;
            room.startAt = startAt;
            const players = room.players.map(p => p.profile);

            room.players.forEach((p, idx) => {
              if (p && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'start',
                  format: room.format,
                  venue: room.venue,
                  points: room.points,
                  seat: idx,
                  startAt,
                  players,
                  serve: { k: 0, server: 0, receiver: 1, courts: [0, 1], wind: [0, 0] },
                  score: [0, 0]
                }));
              }
            });
            broadcastRooms();
          }
          break;
        }

        case 'chat': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'chat',
                  seat: ws.seat,
                  text: data.text
                }));
              }
            }
          }
          break;
        }

        case 'voice': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'voice',
                  seat: ws.seat,
                  signal: data.signal
                }));
              }
            }
          }
          break;
        }

        case 'p2p_sig': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1 && (data.to === undefined || p.seat === data.to)) {
                p.send(JSON.stringify({
                  t: 'p2p_sig',
                  from: ws.seat,
                  signal: data.signal
                }));
              }
            }
          }
          break;
        }

        case 'voice_pcm':
        case 'voice_audio': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'voice_pcm',
                  seat: ws.seat,
                  pcm: data.pcm || data.chunk
                }));
              }
            }
          }
          break;
        }

        case 'emote': {
          if (ws.room && ws.room.players) {
            for (const p of ws.room.players) {
              if (p && p !== ws && p.readyState === 1) {
                p.send(JSON.stringify({
                  t: 'emote',
                  seat: ws.seat,
                  id: data.id
                }));
              }
            }
          }
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('[WS ERROR]', err);
    }
  });

  ws.on('close', () => {
    activeClients.delete(ws);
    const qIdx = matchQueue.indexOf(ws);
    if (qIdx !== -1) matchQueue.splice(qIdx, 1);
    if (ws.room) {
      for (const p of ws.room.players) {
        if (p && p !== ws && p.readyState === 1) {
          p.send(JSON.stringify({ t: 'left' }));
        }
      }
      activeRooms.delete(ws.room.code);
      ws.room = null;
    }
    broadcastRooms();
  });
});

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`Birdie Bash Clone server running at http://localhost:${PORT}`);
});
