// libraWorker.ts - Service Worker for Libra WASM

// @ts-ignore
importScripts("/libra-chess-ui/wasm_exec.js");

// Declare the Libra WASM functions (will be set after WASM loads)
let libraFromFEN: ((fen: string) => void) | undefined;
let libraToFEN: (() => string) | undefined;
let libraMove: ((move: string) => boolean) | undefined;
let libraLoadInitial: (() => void) | undefined;
let libraIterativeDeepeningSearch: ((ms: number) => string) | undefined;

// Helper to load WASM and bind functions
async function initWasmLibra() {
  // @ts-ignore
  const go = new (self as any).Go();
  const wasm = await fetch("/libra-chess-ui/libra.wasm?v4");
  const wasmBuffer = await wasm.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(
    wasmBuffer,
    go.importObject
  );
  go.run(instance);
  // Bind global functions
  libraFromFEN = (self as any).libraFromFEN;
  libraToFEN = (self as any).libraToFEN;
  libraMove = (self as any).libraMove;
  libraLoadInitial = (self as any).libraLoadInitial;
  libraIterativeDeepeningSearch = (self as any).libraIterativeDeepeningSearch;
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;
  if (!libraFromFEN) await initWasmLibra();
  let result: any = undefined;
  try {
    switch (type) {
      case "libraFromFEN":
        libraFromFEN!(payload.fen);
        result = null;
        break;
      case "libraToFEN":
        result = libraToFEN!();
        break;
      case "libraMove":
        result = libraMove!(payload.move);
        break;
      case "libraLoadInitial":
        libraLoadInitial!();
        result = null;
        break;
      case "libraIterativeDeepeningSearch":
        result = libraIterativeDeepeningSearch!(payload.ms);
        break;
      default:
        throw new Error("Unknown message type: " + type);
    }
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({
      id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
