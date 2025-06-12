import React, { useRef, useState, useEffect } from 'react';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { FilterOptionsFn, SuggestionItem } from './suggestionTypes';
import HighlightedText from './HighlightedText';
import useSuggestionFetcher from './useSuggestionFetcher';
import getKeyDownHandler from './listNavigationHandler';
import LoadingIndicator from './LoadingIndicator';
import ErrorMessage from './ErrorMessage';
import SearchInput from './SearchInput';
import useClickOutside from './useClickOutside';

const Root = styled('div')(() => ({
  position: 'relative',
  fontFamily: 'var(--font-family-base)',
}));

const Listbox = styled('ul')<{ isOpen?: boolean }>(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  top: '100%',
  width: '100%',
  padding: 0,
  listStyle: 'none',
  backgroundColor: theme.palette.background.paper,
  marginTop: '-1px',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '0 0 20px 20px',
  maxHeight: 200,
  borderTop: 'none',
  overflowY: 'auto',
}));

const Option = styled('li', { shouldForwardProp: (prop: string) => prop !== 'active' })<{
  active: boolean;
}>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,

  padding: theme.spacing(0, 2),
  backgroundColor: active ? theme.palette.action.hover : 'transparent',
  cursor: 'pointer',
  borderTopRightRadius: active ? '20px' : 0,
  borderBottomRightRadius: active ? '20px' : 0,
}));

interface ComboBoxProps {
  onChange?: (item: SuggestionItem) => void;
  fetchSuggestions?: (query: string) => Promise<SuggestionItem[]>;
  filterOptions?: FilterOptionsFn;
}

function useClampActiveIndex(
  isOpen: boolean,
  suggestions: SuggestionItem[],
  activeIndex: number,
  setActiveIndex: (n: number) => void,
) {
  useEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
    } else if (activeIndex >= suggestions.length) {
      setActiveIndex(suggestions.length - 1);
    }
  }, [isOpen, suggestions.length, activeIndex, setActiveIndex]);
}

function useScrollActiveIntoView(
  isOpen: boolean,
  activeIndex: number,
  suggestions: SuggestionItem[],
) {
  useEffect(() => {
    if (!isOpen || activeIndex < 0 || activeIndex >= suggestions.length) {
      return;
    }
    const el = document.getElementById(`option-${suggestions[activeIndex].id}`);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex, suggestions]);
}

export default function ComboBox({ onChange, fetchSuggestions, filterOptions }: ComboBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const { suggestions, isOpen, error, isLoading, setIsOpen } = useSuggestionFetcher(
    inputValue,
    selectedValue,
    fetchSuggestions,
    filterOptions,
  );

  const handleSelect = (item: SuggestionItem) => {
    setInputValue(item.name);
    onChange?.(item);
    setIsOpen(false);
    setSelectedValue(item.name);
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

  useClickOutside(rootRef, () => setIsOpen(false));
  useClampActiveIndex(isOpen, suggestions, activeIndex, setActiveIndex);
  useScrollActiveIntoView(isOpen, activeIndex, suggestions);

  useEffect(() => {
    if (isOpen && suggestions.length > 0 && activeIndex < 0) {
      setActiveIndex(0);
    }
  }, [isOpen, suggestions.length, activeIndex, setActiveIndex]);

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
        isOpen={isOpen}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isOpen && (
        <Listbox role="listbox" id="combo-options" isOpen={isOpen}>
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <Option
                key={s.id}
                id={`option-${s.id}`}
                role="option"
                aria-selected={i === activeIndex ? 'true' : undefined}
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
