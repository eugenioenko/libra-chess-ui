// libraWorkerClient.ts - Main thread wrapper for Libra WASM service worker

export type LibraWorkerRequest =
  | { type: "libraFromFEN"; payload: { fen: string } }
  | { type: "libraToFEN" }
  | { type: "libraMove"; payload: { move: string } }
  | { type: "libraLoadInitial" }
  | { type: "libraZobristHash" }
  | { type: "libraIterativeDeepeningSearch"; payload: { ms: number } };

export type LibraWorkerResponse = {
  id: number;
  result?: any;
  error?: string;
};

class LibraWorkerClient {
  private worker: Worker;
  private requestId = 0;
  private pending = new Map<number, (res: LibraWorkerResponse) => void>();

  constructor() {
    this.worker = new Worker(new URL("./libra-worker.ts", import.meta.url)); // classic worker, not module
    this.worker.onmessage = (event: MessageEvent) => {
      const res: LibraWorkerResponse = event.data;
      const cb = this.pending.get(res.id);
      if (cb) {
        cb(res);
        this.pending.delete(res.id);
      }
    };
  }

  private call<T = any>(req: LibraWorkerRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = ++this.requestId;
      this.pending.set(id, (res) => {
        if (res.error) reject(new Error(res.error));
        else resolve(res.result);
      });
      this.worker.postMessage({ ...req, id });
    });
  }

  libraFromFEN(fen: string) {
    return this.call({ type: "libraFromFEN", payload: { fen } });
  }
  libraZobristHash() {
    return this.call<string>({ type: "libraZobristHash" });
  }
  libraToFEN() {
    return this.call<string>({ type: "libraToFEN" });
  }
  libraMove(move: string) {
    return this.call<boolean>({ type: "libraMove", payload: { move } });
  }
  libraLoadInitial() {
    return this.call({ type: "libraLoadInitial" });
  }
  libraIterativeDeepeningSearch(ms: number) {
    return this.call<string>({
      type: "libraIterativeDeepeningSearch",
      payload: { ms },
    });
  }
}

export const libraClient = new LibraWorkerClient();
