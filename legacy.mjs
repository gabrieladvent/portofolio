const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const p = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { const { r, j } = p.get(m.id); p.delete(m.id); m.error ? j(new Error(JSON.stringify(m.error))) : r(m.result); } });
const send = (method, params = {}) => new Promise((r, j) => { const n = ++id; p.set(n, { r, j }); ws.send(JSON.stringify({ id: n, method, params })); });
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = async (e) => { const r = await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0,300)); return r.result.value; };
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
for (const path of ["/v3-old", "/", "/about", "/work"]) {
  await send("Page.navigate", { url: "http://localhost:5178" + path });
  await sleep(2200);
  console.log(path.padEnd(10), JSON.stringify(await ev(`({
    title: document.title,
    navs: document.querySelectorAll('header').length,
    sections: document.querySelectorAll('main section, main > *').length,
    heroText: (document.querySelector('h1')?.textContent || '').slice(0, 42),
  })`)));
}
ws.close(); process.exit(0);
