import React, { useRef, useState, useEffect } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { SuggestionItem } from './suggestionTypes';
import HighlightedText from './HighlightedText';
import useSuggestionFetcher from './useSuggestionFetcher';
import getKeyDownHandler from './listNavigationHandler';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import SearchInput from './SearchInput';

const Root = styled('div')(() => ({
  position: 'relative',
  fontFamily: 'var(--font-family-base)',
}));

const Listbox = styled('ul')(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  width: '100%',
  margin: 0,
  padding: 0,
  listStyle: 'none',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderTop: 'none',
  maxHeight: 200,
  overflowY: 'auto',
}));

const Option = styled('li', { shouldForwardProp: (prop: string) => prop !== 'active' })<{
  active: boolean;
}>(({ theme, active }) => ({
  padding: theme.spacing(1),
  backgroundColor: active ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
}));

interface ComboBoxProps {
  onChange?: (item: SuggestionItem) => void;
  fetchSuggestions?: (query: string) => Promise<SuggestionItem[]>;
}

export default function ComboBox({ onChange, fetchSuggestions }: ComboBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { suggestions, isOpen, error, isLoading, setIsOpen } = useSuggestionFetcher(
    inputValue,
    fetchSuggestions,
  );

  const handleSelect = (item: SuggestionItem) => {
    setInputValue(item.name);
    onChange?.(item);
    setIsOpen(false);
  };

  const handleKeyDown = getKeyDownHandler({
    isOpen,
    suggestions,
    activeIndex,
    setActiveIndex,
    onSelect: handleSelect,
    setIsOpen,
    setInputValue,
  });

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
    } else if (activeIndex >= suggestions.length) {
      setActiveIndex(suggestions.length - 1);
    }
  }, [isOpen, suggestions.length, activeIndex]);

  return (
    <Root ref={rootRef}>
      {isLoading && <LoadingIndicator />}
      <SearchInput
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClear={() => setInputValue('')}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="combo-options"
        aria-activedescendant={
          isOpen && suggestions[activeIndex] ? `option-${suggestions[activeIndex].id}` : undefined
        }
        aria-autocomplete="list"
        autoComplete="off"
        autoFocus
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isOpen && (
        <Listbox role="listbox" id="combo-options">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <Option
                key={s.id}
                id={`option-${s.id}`}
                role="option"
                aria-selected={i === activeIndex}
                active={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleSelect(s)}
              >
                <HighlightedText text={s.name} query={inputValue} />
              </Option>
            ))
          ) : (
            <Option active={false} role="option" aria-disabled="true">
              No results found
            </Option>
          )}
        </Listbox>
      )}
    </Root>
  );
}
