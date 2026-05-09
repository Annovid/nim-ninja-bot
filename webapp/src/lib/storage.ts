import { cloud } from "./telegram";

const KEY = "nim_progress_v1";
const LOCAL_FALLBACK = KEY;

export type Progress = Record<string, { wins: number }>;

const empty: Progress = {};

export async function loadProgress(): Promise<Progress> {
  const remote = await cloud.get(KEY);
  if (remote) {
    try { return JSON.parse(remote) as Progress; } catch { /* fall through */ }
  }
  const local = localStorage.getItem(LOCAL_FALLBACK);
  if (local) {
    try { return JSON.parse(local) as Progress; } catch { /* fall through */ }
  }
  return { ...empty };
}

export async function saveProgress(p: Progress): Promise<void> {
  const json = JSON.stringify(p);
  localStorage.setItem(LOCAL_FALLBACK, json);
  await cloud.set(KEY, json);
}

export function recordWin(p: Progress, problemId: string): Progress {
  const prev = p[problemId]?.wins ?? 0;
  return { ...p, [problemId]: { wins: prev + 1 } };
}
