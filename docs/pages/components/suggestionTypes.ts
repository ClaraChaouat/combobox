export interface SuggestionItem {
  id: number;
  name: string;
}

export type FilterOptionsFn = (options: SuggestionItem[], input: string) => SuggestionItem[];
