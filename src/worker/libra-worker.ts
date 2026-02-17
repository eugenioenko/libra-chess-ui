// @ts-ignore
importScripts("/libra-chess-ui/wasm_exec.js");

// Declare the Libra WASM functions (will be set after WASM loads)
interface LibraWasm {
  fromFEN: (fen: string) => void;
  toFEN: () => string;
  zobristHash: () => string;
  move: (move: string) => boolean;
  loadInitial: () => void;
  iterativeDeepeningSearch: (ms: number) => string;
}

declare let libra: LibraWasm;

// Helper to load WASM and bind functions
async function initWasmLibra() {
  const go = new (self as any).Go();
  const wasm = await fetch("/libra-chess-ui/libra.wasm?v=1.0.7");
  const wasmBuffer = await wasm.arrayBuffer();
  const { instance } = await WebAssembly.instantiate(
    wasmBuffer,
    go.importObject
  );
  go.run(instance);
  libra = (self as any).libra as LibraWasm;
}

// Message handler
self.onmessage = async (event: MessageEvent) => {
  const { type, payload, id } = event.data;
  if (typeof libra === "undefined") {
    await initWasmLibra();
  }
  let result: any = undefined;
  try {
    switch (type) {
      case "libraFromFEN":
        libra.fromFEN(payload.fen);
        result = null;
        break;
      case "libraToFEN":
        result = libra.toFEN!();
        break;
      case "libraMove":
        result = libra.move!(payload.move);
        break;
      case "libraLoadInitial":
        libra.loadInitial!();
        result = null;
        break;
      case "libraIterativeDeepeningSearch":
        result = libra.iterativeDeepeningSearch!(payload.ms);
        break;
      case "libraZobristHash":
        result = libra.zobristHash!();
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
