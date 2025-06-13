import { SuggestionItem } from './suggestionTypes';
import countries from './countries';

interface CacheEntry {
  ts: number;
  data: SuggestionItem[];
}
const CACHE = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1_000;
const now = () => Date.now();
const fresh = (e: CacheEntry) => now() - e.ts < TTL_MS;

const normalize = (s: string) => s.toLowerCase().trim();

export default async function getSuggestions(q: string): Promise<SuggestionItem[]> {
  const query = normalize(q);
  if (!query) return [];

  const hit = CACHE.get(query);
  if (hit && fresh(hit)) return hit.data;

  const all = countries.map((c, i) => ({ id: i, name: c.label }));

  const prefix = all.filter((c) => normalize(c.name).startsWith(query));
  const substr = all
    .filter((c) => !normalize(c.name).startsWith(query) && normalize(c.name).includes(query))
    .sort((a, b) => normalize(a.name).indexOf(query) - normalize(b.name).indexOf(query));

  const out = [...prefix, ...substr];
  CACHE.set(query, { ts: now(), data: out });
  return out;
}
