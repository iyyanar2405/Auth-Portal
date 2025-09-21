import { TreeTableNode } from 'primeng/api';

export interface TreeColumnDefinition {
  field: string;
  header: string;
  isTranslatable: boolean;
  hasNavigationEnabled?: boolean;
  width?: string;
}

export interface TreeNodeClick {
  rowNode: TreeTableNode;
  field: string;
}
