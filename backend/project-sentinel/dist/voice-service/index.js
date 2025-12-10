globalThis.__RAINDROP_GIT_COMMIT_SHA = "039e70eb275b138cd26e10bd6a7d4a20d6ca5c17"; 

// node_modules/@liquidmetal-ai/raindrop-framework/dist/core/cors.js
var matchOrigin = (request, env, config) => {
  const requestOrigin = request.headers.get("origin");
  if (!requestOrigin) {
    return null;
  }
  const { origin } = config;
  if (origin === "*") {
    return "*";
  }
  if (typeof origin === "function") {
    return origin(request, env);
  }
  if (typeof origin === "string") {
    return requestOrigin === origin ? origin : null;
  }
  if (Array.isArray(origin)) {
    return origin.includes(requestOrigin) ? requestOrigin : null;
  }
  return null;
};
var addCorsHeaders = (response, request, env, config) => {
  const allowedOrigin = matchOrigin(request, env, config);
  if (!allowedOrigin) {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  if (config.credentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  if (config.exposeHeaders && config.exposeHeaders.length > 0) {
    headers.set("Access-Control-Expose-Headers", config.exposeHeaders.join(", "));
  }
  const vary = headers.get("Vary");
  if (vary) {
    if (!vary.includes("Origin")) {
      headers.set("Vary", `${vary}, Origin`);
    }
  } else {
    headers.set("Vary", "Origin");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};
var handlePreflight = (request, env, config) => {
  const allowedOrigin = matchOrigin(request, env, config);
  if (!allowedOrigin) {
    return new Response(null, { status: 403 });
  }
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  if (config.credentials) {
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  const allowMethods = config.allowMethods || ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];
  headers.set("Access-Control-Allow-Methods", allowMethods.join(", "));
  const allowHeaders = config.allowHeaders || ["Content-Type", "Authorization"];
  headers.set("Access-Control-Allow-Headers", allowHeaders.join(", "));
  const maxAge = config.maxAge ?? 86400;
  headers.set("Access-Control-Max-Age", maxAge.toString());
  headers.set("Vary", "Origin");
  return new Response(null, {
    status: 204,
    headers
  });
};
var createCorsHandler = (config) => {
  return (request, env, response) => {
    if (!response) {
      return handlePreflight(request, env, config);
    }
    return addCorsHeaders(response, request, env, config);
  };
};
var corsAllowAll = createCorsHandler({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
});

// src/_app/cors.ts
var cors = corsAllowAll;

// src/voice-service/index.ts
import { Service } from "./runtime.js";

// src/voice-service/utils.ts
var transcribeAudio = async (env, audio) => {
  const buffer = await audio.arrayBuffer();
  const audioData = Array.from(new Uint8Array(buffer));
  return await env.AI.run("whisper", {
    audio: audioData,
    contentType: "audio/wav"
  });
};
var analyzeTranscription = async (env, text) => {
  return await env.INTELLIGENCE_SERVICE.analyze({
    content: text
  });
};
async function analyzeVoice(env, request) {
  try {
    const transcriptionResult = await transcribeAudio(env, request.audio);
    const analysisResult = await analyzeTranscription(
      env,
      transcriptionResult.text
    );
    return {
      transcription: transcriptionResult.text,
      analysis: analysisResult
    };
  } catch {
    throw new Error("Failed to analyze voice");
  }
}

// src/voice-service/index.ts
var voice_service_default = class extends Service {
  async fetch() {
    return new Response("Not Implemented", { status: 501 });
  }
  async process(request) {
    return analyzeVoice(this.env, request);
  }
};

// <stdin>
var stdin_default = voice_service_default;
export {
  cors,
  stdin_default as default
};
