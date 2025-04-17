# Node.js vs Deno パフォーマンスベンチマーク

このプロジェクトは、Node.jsとDenoのパフォーマンスを比較するためのベンチマークツールです。異なる同時接続数とスレッド数での両ランタイムの性能を測定します。

## プロジェクト構成

```
.
├── src/
│   ├── node/         # Node.jsサーバー
│   │   └── server.js
│   └── deno/         # Denoサーバー
│       └── server.ts
├── benchmark.js      # ベンチマークスクリプト
├── Dockerfile        # Dockerコンテナ設定
└── package.json      # プロジェクト設定
```

## 前提条件

- Docker
- Node.js (v20以上)
- npm

## セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd node-deno-benchmark
```

2. 依存関係のインストール
```bash
npm install
```

## 検証方法

### Dockerを使用した検証

1. Dockerイメージのビルド
```bash
docker build -t node-deno-benchmark .
```

2. サーバーの起動
```bash
# Node.jsサーバー（シングルスレッド）とDenoサーバーを起動
docker run -d -p 3000:3000 -e SERVER_TYPE=node -e THREAD_COUNT=1 node-deno-benchmark
docker run -d -p 3001:3000 -e SERVER_TYPE=deno -e THREAD_COUNT=1 node-deno-benchmark

# または、Node.jsサーバーをマルチスレッドで起動
docker run -d -p 3000:3000 -e SERVER_TYPE=node -e THREAD_COUNT=2 node-deno-benchmark
docker run -d -p 3001:3000 -e SERVER_TYPE=deno -e THREAD_COUNT=2 node-deno-benchmark

# 3スレッドで起動する場合
docker run -d -p 3000:3000 -e SERVER_TYPE=node -e THREAD_COUNT=3 node-deno-benchmark
docker run -d -p 3001:3000 -e SERVER_TYPE=deno -e THREAD_COUNT=3 node-deno-benchmark
```

3. ベンチマークの実行
```bash
npm run benchmark
```

### ローカル環境での検証

1. Node.jsサーバーの起動
```bash
# シングルスレッド
node src/node/server.js

# マルチスレッド
THREAD_COUNT=2 node src/node/server.js

# 3スレッド
THREAD_COUNT=3 node src/node/server.js
```

2. Denoサーバーの起動
```bash
# シングルスレッド
deno run --allow-net --allow-env src/deno/server.ts

# マルチスレッド
THREAD_COUNT=2 deno run --allow-net --allow-env src/deno/server.ts

# 3スレッド
THREAD_COUNT=3 deno run --allow-net --allow-env src/deno/server.ts
```

3. ベンチマークの実行
```bash
npm run benchmark
```

## デバッグ方法

### ログの確認

1. Dockerコンテナのログを確認
```bash
# 実行中のコンテナを確認
docker ps

# 特定のコンテナのログを確認
docker logs <container-id>
```

2. サーバーの状態確認
```bash
# Node.jsサーバーの状態確認
curl http://localhost:3000

# Denoサーバーの状態確認
curl http://localhost:3001
```

### トラブルシューティング

1. サーバーが起動しない場合
   - ポートが既に使用されている可能性があります。別のポートを指定してください。
   - 環境変数が正しく設定されているか確認してください。

2. ベンチマークが失敗する場合
   - サーバーが正常に動作しているか確認してください。
   - ネットワーク接続を確認してください。
   - タイムアウト設定を調整してください（benchmark.jsの`timeout`パラメータ）。

## ベンチマーク結果の解釈

ベンチマーク結果には以下の情報が含まれます：

- **Total Time**: すべてのリクエストの合計実行時間（ミリ秒）
- **Successful Requests**: 成功したリクエスト数
- **Failed Requests**: 失敗したリクエスト数
- **Average Latency**: 平均レイテンシ（ミリ秒）
- **Min Latency**: 最小レイテンシ（ミリ秒）
- **Max Latency**: 最大レイテンシ（ミリ秒）

## カスタマイズ

### サーバーの設定変更

- `src/node/server.js`と`src/deno/server.ts`を編集して、サーバーの動作を変更できます。
- 現在、両サーバーは100msの遅延をシミュレートしています。この値を変更することで、異なる負荷条件でのテストが可能です。

### ベンチマークの設定変更

- `benchmark.js`を編集して、同時接続数、リクエスト数、タイムアウトなどのパラメータを調整できます。

## ライセンス

MIT 