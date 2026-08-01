import { useState, useEffect } from "react";

/**
 * Loads the opening book from a JSON file.
 * Returns the book data (keyed by Zobrist hash) or undefined while loading.
 */
export function useOpeningBook() {
  const [book, setBook] = useState<Record<string, string[]> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch('/libra-chess-ui/openings.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!cancelled) setBook(data);
      } catch {
        if (!cancelled) setBook({});
        console.warn('Failed to load opening book');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return book;
}
