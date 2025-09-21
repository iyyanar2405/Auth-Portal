import { SelectItem } from 'primeng/api';

export interface TranslatableSelectItem extends SelectItem {
  i18nKey: string;
}
