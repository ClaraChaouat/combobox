import { useEffect } from 'react';
import { SuggestionItem } from './suggestionTypes';

interface UseAutoCompleteSelectionParams {
  isOpen: boolean;
  inputValue: string;
  activeIndex: number;
  suggestions: SuggestionItem[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function useAutoCompleteSelection({
  isOpen,
  inputValue,
  activeIndex,
  suggestions,
  inputRef,
}: UseAutoCompleteSelectionParams) {
  useEffect(() => {
    const inputEl = inputRef.current;
    const active = suggestions[activeIndex];

    if (
      isOpen &&
      inputEl &&
      active &&
      inputValue &&
      active.name.toLowerCase().startsWith(inputValue.toLowerCase())
    ) {
      inputEl.value = active.name;
      inputEl.setSelectionRange(inputValue.length, active.name.length);
    }
  }, [isOpen, inputValue, activeIndex, suggestions, inputRef]);
}
