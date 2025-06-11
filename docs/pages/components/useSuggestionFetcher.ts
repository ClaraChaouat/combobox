import { useEffect, useState, useCallback } from 'react';
import { AUTOCOMPLETE_CONFIG, VALID_INPUT_REGEX } from './autocompleteConstants';
import { SuggestionItem } from './suggestionTypes';
import getSuggestions from './getSuggestions';
import countries from './countries';

const preload = (): SuggestionItem[] =>
  countries.map((c, i) => ({ id: i, name: c.label })).slice(0, AUTOCOMPLETE_CONFIG.MAX_SUGGESTIONS);

interface State {
  suggestions: SuggestionItem[];
  isLoading: boolean;
  error: string | null;
  isOpen: boolean;
}
type ReturnType = State & { setIsOpen: (o: boolean) => void };

const useSuggestionFetcher = (
  query: string,
  fetchFn: (q: string) => Promise<SuggestionItem[]> = getSuggestions,
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

    if (!isValid || trimmed.length < AUTOCOMPLETE_CONFIG.MIN_SEARCH_LENGTH) {
      setState((s) => ({
        ...s,
        isOpen: false,
        error: isValid ? null : 'Invalid characters',
      }));
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const results = await fetchFn(trimmed);
      setState({
        suggestions: results.slice(0, AUTOCOMPLETE_CONFIG.MAX_SUGGESTIONS),
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
  }, [query, fetchFn]);

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
