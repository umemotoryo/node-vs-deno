const axios = require('axios');

const CONCURRENT_REQUESTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const TIMEOUT = 3000; // 3秒
const ITERATIONS = 5; // 各設定で5回実行

async function runBenchmark(url, concurrentRequests) {
  const startTime = Date.now();
  const requests = Array(concurrentRequests).fill().map(() => 
    axios.get(url, { timeout: TIMEOUT })
      .then(response => ({ success: true, time: Date.now() - startTime }))
      .catch(error => ({ success: false, error: error.message }))
  );

  const results = await Promise.all(requests);
  const endTime = Date.now();
  const totalTime = endTime - startTime;

  const successfulRequests = results.filter(r => r.success).length;
  const failedRequests = results.filter(r => !r.success).length;
  const latencies = results.filter(r => r.success).map(r => r.time);

  return {
    concurrentRequests,
    totalTime,
    successfulRequests,
    failedRequests,
    averageLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
    minLatency: Math.min(...latencies),
    maxLatency: Math.max(...latencies)
  };
}

async function runAllBenchmarks(serverUrl, serverName) {
  console.log(`\nRunning benchmarks for ${serverName}`);
  console.log('=====================================');

  for (const requests of CONCURRENT_REQUESTS) {
    console.log(`\nTesting with ${requests} concurrent requests:`);
    
    const results = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const result = await runBenchmark(serverUrl, requests);
      results.push(result);
      console.log(`Iteration ${i + 1}:`);
      console.log(`  Total Time: ${result.totalTime}ms`);
      console.log(`  Successful Requests: ${result.successfulRequests}`);
      console.log(`  Failed Requests: ${result.failedRequests}`);
      console.log(`  Average Latency: ${result.averageLatency.toFixed(2)}ms`);
      console.log(`  Min Latency: ${result.minLatency}ms`);
      console.log(`  Max Latency: ${result.maxLatency}ms`);
    }

    // 平均値を計算
    const avgTotalTime = results.reduce((sum, r) => sum + r.totalTime, 0) / ITERATIONS;
    const avgLatency = results.reduce((sum, r) => sum + r.averageLatency, 0) / ITERATIONS;
    
    console.log(`\nAverages for ${requests} concurrent requests:`);
    console.log(`  Average Total Time: ${avgTotalTime.toFixed(2)}ms`);
    console.log(`  Average Latency: ${avgLatency.toFixed(2)}ms`);
  }
}

// メイン実行関数
async function main() {
  const nodeUrl = 'http://localhost:3000';
  const denoUrl = 'http://localhost:3001';

  // Node.jsのベンチマーク
  await runAllBenchmarks(nodeUrl, 'Node.js');
  
  // Denoのベンチマーク
  await runAllBenchmarks(denoUrl, 'Deno');
}

main().catch(console.error); 