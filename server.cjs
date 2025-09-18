const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('config/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// GET /api/raffle-status?userId=123
server.get('/api/raffle-status', (req, res) => {
  const userId = Number(req.query.userId);
  const user = router.db.get('raffle').find({ userId }).value();
  res.json({ tickets: user ? user.tickets : 0 });
});

// POST /api/raffle-entry
server.post('/api/raffle-entry', (req, res) => {
  const userId = req.body.userId;
  let user = router.db.get('raffle').find({ userId }).value();
  if (user) {
    user.tickets += 1;
    router.db.get('raffle').find({ userId }).assign({ tickets: user.tickets }).write();
    res.json({ success: true, tickets: user.tickets });
  } else {
    router.db.get('raffle').push({ userId, tickets: 1 }).write();
    res.json({ success: true, tickets: 1 });
  }
});

server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});