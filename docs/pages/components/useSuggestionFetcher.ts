import { useEffect, useState, useCallback } from 'react';
import { FilterOptionsFn, SuggestionItem } from './suggestionTypes';
import getSuggestions from './getSuggestions';
import countries from './countries';
import { SEARCH_CONFIG, VALID_INPUT_REGEX } from './searcBoxConfig';

const preload = (): SuggestionItem[] =>
  countries.map((c, i) => ({ id: i, name: c.label })).slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS);

interface State {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}
type ReturnType = State & { setIsOpen: (o: boolean) => void };

const defaultFilter: FilterOptionsFn = (opts, q) => {
  const norm = (s: string) => s.toLowerCase();
  const query = q.toLowerCase();
  const prefix = opts.filter((o) => norm(o.name).startsWith(query));
  const substr = opts
    .filter((o) => !norm(o.name).startsWith(query) && norm(o.name).includes(query))
    .sort((a, b) => norm(a.name).indexOf(q) - norm(b.name).indexOf(q));
  return [...prefix, ...substr];
};

const useSuggestionFetcher = (
  query: string,
  fetchFn: (q: string) => Promise<SuggestionItem[]> = getSuggestions,
  filterOptions: FilterOptionsFn = defaultFilter,
): ReturnType => {
  const [state, setState] = useState<State>({
    suggestions: preload(),
    isLoading: false,
    error: null,
    isOpen: false,
  });

  const fetchSuggestions = useCallback(async () => {
    const trimmed = query.trim();
    const isValid = VALID_INPUT_REGEX.test(trimmed);

    if (!isValid || trimmed.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
      setState((s) => ({
        ...s,
        isOpen: false,
        error: isValid ? null : 'Invalid characters',
      }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const raw = await fetchFn(trimmed);
      const filtered = filterOptions(raw, trimmed);
      setState({
        suggestions: filtered.slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS),
        isLoading: false,
        error: null,
        isOpen: true,
      });
    } catch {
      setState({
        suggestions: [],
        isLoading: false,
        error: 'Failed to load suggestions',
        isOpen: false,
      });
    }
  }, [query, fetchFn, filterOptions]);

  useEffect(() => {
    const id = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(id);
  }, [fetchSuggestions]);

  return {
    ...state,
    setIsOpen: (open: boolean) => setState((s) => ({ ...s, isOpen: open })),
  };
};

export default useSuggestionFetcher;
