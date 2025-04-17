import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

const PORT = parseInt(Deno.env.get("PORT") || "3000");
const THREAD_COUNT = parseInt(Deno.env.get("THREAD_COUNT") || "1");

async function handler(req: Request): Promise<Response> {
  // リクエストの処理をシミュレート（100ms）
  await new Promise(resolve => setTimeout(resolve, 100));

  return new Response(
    JSON.stringify({
      message: "Hello from Deno",
      pid: Deno.pid,
      thread: THREAD_COUNT
    }),
    {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    },
  );
}

console.log(`Server running on http://localhost:${PORT}`);
await serve(handler, { port: PORT, hostname: "0.0.0.0" }); 