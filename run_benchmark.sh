#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# エラーハンドリング
set -e

echo -e "${GREEN}=== Node.js vs Deno ベンチマーク実行 ===${NC}"

# 既存のコンテナを停止・削除
echo -e "\n${GREEN}既存のコンテナを停止・削除中...${NC}"
docker ps -q | xargs -r docker stop
docker ps -aq | xargs -r docker rm

# Dockerイメージのビルド
echo -e "\n${GREEN}Dockerイメージをビルド中...${NC}"
docker build -t node-deno-benchmark .

# スレッド数とCPU数の設定
THREAD_COUNT=${1:-1}
CPU_COUNT=${1:-1}

echo -e "\n${GREEN}設定: ${THREAD_COUNT}スレッド, ${CPU_COUNT}CPU${NC}"

# Node.jsサーバーの起動
echo -e "\n${GREEN}Node.jsサーバーを起動中...${NC}"
NODE_CONTAINER=$(docker run -d --rm -p 3000:3000 --cpus=$CPU_COUNT -e SERVER_TYPE=node -e THREAD_COUNT=$THREAD_COUNT node-deno-benchmark)
echo "Node.jsコンテナID: $NODE_CONTAINER"

# Denoサーバーの起動
echo -e "\n${GREEN}Denoサーバーを起動中...${NC}"
DENO_CONTAINER=$(docker run -d --rm -p 3001:3000 --cpus=$CPU_COUNT -e SERVER_TYPE=deno -e THREAD_COUNT=$THREAD_COUNT node-deno-benchmark)
echo "DenoコンテナID: $DENO_CONTAINER"

# サーバーの起動を待機
echo -e "\n${GREEN}サーバーの起動を待機中...${NC}"
sleep 5

# ベンチマークの実行
echo -e "\n${GREEN}ベンチマークを実行中...${NC}"
npm run benchmark

# コンテナの停止
echo -e "\n${GREEN}コンテナを停止中...${NC}"
docker stop $NODE_CONTAINER $DENO_CONTAINER

echo -e "\n${GREEN}ベンチマーク完了${NC}" 