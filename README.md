# Libra Chess UI

A web interface for the [Libra Chess Engine](https://github.com/eugenioenko/libra-chess), compiled to WebAssembly (WASM).

## ⚖️ [Play against Libra Engine!](https://eugenioenko.github.io/libra-chess-ui)

## Overview

Libra Chess UI is a React-based frontend for interacting with the Libra Chess Engine, a UCI-compliant chess engine written in Go. The engine is compiled to WebAssembly, allowing users to play against Libra directly in their browser with no server required.

- **Play chess in your browser** against Libra Chess.
- **Powered by Go + WASM:** The backend engine runs entirely client-side via WebAssembly.
- **Modern UI:** Built with React and Tailwind CSS for a responsive, clean experience.
- **Non-blocking move search:** Uses service workers during move search to avoid blocking the JavaScript event loop, ensuring smooth UI responsiveness.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or use npm/yarn)

### Installation

```bash
pnpm install
```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### Building for Production

```bash
pnpm build
```

The static site will be output to the `dist/` directory.

---

## Project Structure

- `src/` — React components, styles, and main app logic
- `public/` — Static assets, including `libra.wasm` and WASM loader
- `src/worker/` — Web worker and WASM client integration

---

## How It Works

- The Go-based Libra Chess Engine is compiled to WebAssembly (`libra.wasm`).
- The UI loads the WASM binary and communicates with it via a web worker (`libraWorker.ts`).
- All chess logic and move validation are handled by the engine; the UI manages user interaction and display.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, improvements, or new features.

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
