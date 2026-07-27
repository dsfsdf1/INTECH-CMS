import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";

type VinextHandler = {
  fetch(request: Request): Promise<Response>;
};

function requestUrl(request: IncomingMessage) {
  const host = request.headers.host ?? "localhost";
  const rewrittenUrl = new URL(request.url ?? "/", `https://${host}`);
  const pathname = rewrittenUrl.searchParams.get("path") ?? "";

  rewrittenUrl.searchParams.delete("path");
  rewrittenUrl.pathname = `/${pathname}`.replace(/\/{2,}/g, "/");

  return rewrittenUrl;
}

export default async function handler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  const { default: app } = (await import(
    "../dist/server/index.js"
  )) as { default: VinextHandler };
  const method = request.method ?? "GET";
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : (Readable.toWeb(request) as unknown as BodyInit);
  const requestInit: RequestInit & { duplex?: "half" } = {
    method,
    headers: request.headers as HeadersInit,
    body,
    duplex: body ? "half" : undefined,
  };
  const rendered = await app.fetch(
    new Request(requestUrl(request), requestInit),
  );

  response.statusCode = rendered.status;
  rendered.headers.forEach((value, key) => response.setHeader(key, value));
  response.end(Buffer.from(await rendered.arrayBuffer()));
}
