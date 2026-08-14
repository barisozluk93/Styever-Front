export type ColumnFilterType = 'text' | 'select' | 'boolean' | 'number' | 'date';

export interface ColumnFilterOption {
  label: string;
  value: string | number | boolean;
}

export class ColumnModel {
  name: string;
  index: string | null;
  visibility: boolean;
  filterType?: ColumnFilterType;
  filterOptions?: ColumnFilterOption[];
  filterable?: boolean;
}
