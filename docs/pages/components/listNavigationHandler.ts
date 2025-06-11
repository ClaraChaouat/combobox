// listNavigationHandler.ts
import { KeyboardEvent } from 'react';
import { SuggestionItem } from './suggestionTypes';

interface Params {
  isOpen: boolean;
  suggestions: SuggestionItem[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  onSelect: (item: SuggestionItem) => void;
  setIsOpen: (open: boolean) => void;
  setInputValue: (val: string) => void;
}

const getKeyDownHandler = ({
  isOpen: popupOpen,
  suggestions,
  activeIndex,
  setActiveIndex,
  onSelect,
  setIsOpen,
  setInputValue,
}: Params) => (e: KeyboardEvent<HTMLInputElement>) => {
  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      if (!popupOpen) {
        setIsOpen(true);
      } else {
        setActiveIndex(Math.min(activeIndex + 1, suggestions.length - 1));
      }
      break;
    }

    case 'ArrowUp': {
      if (!popupOpen) return;
      e.preventDefault();
      const next = activeIndex < 0 ? suggestions.length - 1 : Math.max(activeIndex - 1, 0);
      setActiveIndex(next);
      break;
    }

    case 'Home': {
      if (!popupOpen) return;
      e.preventDefault();
      if (suggestions.length) setActiveIndex(0);
      break;
    }

    case 'End': {
      if (!popupOpen) return;
      e.preventDefault();
      if (suggestions.length) setActiveIndex(suggestions.length - 1);
      break;
    }

    case 'Enter': {
      if (!popupOpen) return;
      e.preventDefault();
      const item = suggestions[activeIndex];
      if (item) {
        onSelect(item);
        setInputValue(item.name);
        setIsOpen(false);
      }
      break;
    }

    case 'Escape': {
      if (!popupOpen) return;
      e.preventDefault();
      setIsOpen(false);
      break;
    }

    default:
      break;
  }
};

export default getKeyDownHandler;
