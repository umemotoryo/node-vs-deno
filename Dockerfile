# Node.jsのベースイメージ
FROM node:20-slim

# Denoのインストール
RUN apt-get update && apt-get install -y curl unzip
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV PATH="/root/.deno/bin:${PATH}"

# 作業ディレクトリの設定
WORKDIR /app

# アプリケーションのコピー
COPY . .

# Node.jsの依存関係のインストール
RUN npm install

# ポートの公開
EXPOSE 3000 3001

# 起動スクリプトの作成
COPY <<EOF /app/start.sh
#!/bin/bash
if [ "\$SERVER_TYPE" = "node" ]; then
  THREAD_COUNT=\$THREAD_COUNT node src/node/server.js
else
  THREAD_COUNT=\$THREAD_COUNT deno run --allow-net --allow-env src/deno/server.ts
fi
EOF

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"] 