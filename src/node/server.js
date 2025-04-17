const http = require('http');
const cluster = require('cluster');
const os = require('os');

const PORT = process.env.PORT || 3000;
const THREAD_COUNT = parseInt(process.env.THREAD_COUNT) || 1;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // ワーカープロセスを起動
  for (let i = 0; i < THREAD_COUNT; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const server = http.createServer((req, res) => {
    // リクエストの処理をシミュレート（100ms）
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        message: 'Hello from Node.js',
        pid: process.pid,
        thread: cluster.worker.id
      }));
    }, 100);
  });

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
  });
} 