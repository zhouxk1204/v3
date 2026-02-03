export interface SrtEntry {
  index: string;
  time: string;
  text: string;
}

export function parseSrt(srt: string): SrtEntry[] {
  return srt
    .replace(/\r\n/g, "\n")
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.trim().split("\n");
      if (lines.length < 3) return null;
      return {
        index: lines[0],
        time: lines[1],
        text: lines.slice(2).join("\n"),
      };
    })
    .filter(Boolean) as SrtEntry[];
}

export function buildSrt(entries: SrtEntry[]): string {
  return entries.map((e) => `${e.index}\n${e.time}\n${e.text}`).join("\n\n");
}

export function chunkSrtWithContext(
  entries: SrtEntry[],
  chunkSize = 25,
  contextSize = 5,
) {
  const chunks: {
    context: SrtEntry[];
    chunk: SrtEntry[];
  }[] = [];

  for (let i = 0; i < entries.length; i += chunkSize) {
    const prev = entries.slice(Math.max(0, i - contextSize), i);
    const cur = entries.slice(i, i + chunkSize);
    const next = entries.slice(i + chunkSize, i + chunkSize + contextSize);

    chunks.push({
      context: [...prev, ...next],
      chunk: cur,
    });
  }

  return chunks;
}
