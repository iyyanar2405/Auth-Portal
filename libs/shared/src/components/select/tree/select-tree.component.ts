import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { TreeNode } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TreeNodeSelectEvent } from 'primeng/tree';
import { TreeSelect, TreeSelectModule } from 'primeng/treeselect';
import {
  TriStateCheckboxChangeEvent,
  TriStateCheckboxModule,
} from 'primeng/tristatecheckbox';

import { SharedSelectTreeChangeEventOutput } from '../../../models';
import {
  SHARED_SELECT_TREE_OPTION_OVERFLOW_LIMIT,
  SHARED_SELECT_TREE_OPTION_TOOLTIP_DEFAULT_DELAY_MS,
  SHARED_SELECT_TREE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  SHARED_SELECT_TREE_SCROLL_HEIGHT_PX,
  SHARED_SELECT_TREE_SEARCH_LIMIT,
} from './select-tree.constants';

@Component({
  selector: 'shared-select-tree',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoDirective,
    TreeSelectModule,
    TooltipModule,
    TriStateCheckboxModule,
    FormsModule,
  ],
  templateUrl: './select-tree.component.html',
  styleUrl: './select-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedSelectTreeComponent {
  public ariaLabel = input<string>();
  public isDisabled = input<boolean>(false);
  public options = input.required<TreeNode[]>();
  public placeholder = input<string>();
  public prefill = input<TreeNode[]>([]);
  public appendTo = input<HTMLElement | string>('');

  public changeEvent = output<SharedSelectTreeChangeEventOutput>();

  public optionsTotal = computed(
    () => this.getAllAvailableOptions(this.options()).length,
  );
  public hasSearch = computed(
    () => this.options().length > SHARED_SELECT_TREE_SEARCH_LIMIT,
  );
  public hasTooltip = signal(false);
  public tooltipDelay = computed(() =>
    this.hasTooltip()
      ? SHARED_SELECT_TREE_OPTION_TOOLTIP_DEFAULT_DELAY_MS
      : SHARED_SELECT_TREE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  );
  public scrollHeight = `${SHARED_SELECT_TREE_SCROLL_HEIGHT_PX}px`;
  public selected: TreeNode[] = [];
  public triState = signal<boolean | null>(this.getTriState());
  public selectOverflowLimit = SHARED_SELECT_TREE_OPTION_OVERFLOW_LIMIT;

  get selectedTooltip(): string {
    return this.getSelectedTooptip();
  }

  treeSelect = viewChild.required<TreeSelect>('treeSelect');

  constructor(private ref: ChangeDetectorRef) {
    let prevPrefill: TreeNode[] | null = null;

    effect(() => {
      this.selected = this.getSelectedTrimmed();
      this.ref.markForCheck();
    });

    effect(() => {
      const hasNewPrefill = this.prefill().length > 0 && prevPrefill === null;
      const shouldAutoSelect =
        this.prefill().length === 0 && prevPrefill === null;

      if (hasNewPrefill) {
        this.applyPrefillSelection();
      } else if (shouldAutoSelect) {
        this.applyAutoSelection();
      }

      prevPrefill = this.prefill().length > 0 ? this.prefill() : null;
    });
  }

  onChange(_event: TreeNodeSelectEvent): void {
    this.changeEvent.emit({
      filter: Array.from(
        new Set(
          this.selected.map((s) =>
            typeof s.data === 'number' && Number.isNaN(s.data)
              ? Number(s.data)
              : s.data,
          ),
        ),
      ),
      prefill: this.getPrefillWithSelected(this.selected, true),
    });
    this.hasTooltip.set(this.selected.length > 0);
    this.triState.set(this.getTriState());
  }

  onChangeTriState(event: TriStateCheckboxChangeEvent): void {
    event.originalEvent.stopImmediatePropagation();
    this.selected = this.getSelectedByTriState(event.value);
    this.changeEvent.emit({
      filter: Array.from(
        new Set(
          this.selected.map((s) =>
            typeof s.data === 'number' && Number.isNaN(s.data)
              ? Number(s.data)
              : s.data,
          ),
        ),
      ),
      prefill: this.getPrefillWithSelected(this.selected, !!event.value),
    });
    this.hasTooltip.set(this.selected.length > 0);
    this.triState.set(this.getTriState());
    this.treeSelect().hide();
  }

  private applyPrefillSelection(): void {
    this.selected = this.getCheckedNodes(this.prefill());
  }

  private applyAutoSelection(): void {
    const autoSelected = this.getAutoSelectedNodes(this.options());
    this.selected = autoSelected;

    if (autoSelected.length > 0) {
      this.onChange({} as any);
    }
  }

  private getSelectedByTriState(value: boolean | null): TreeNode[] {
    return value ? this.getAllAvailableOptions(this.options()) : [];
  }

  private getAllAvailableOptions(options?: TreeNode[]): TreeNode[] {
    return (options || []).reduce(
      (acc: TreeNode[], option) =>
        [
          ...acc,
          option,
          ...(option?.children?.length
            ? this.getAllAvailableOptions(option.children)
            : []),
        ] as TreeNode[],
      [] as TreeNode[],
    );
  }

  private getSelectedTrimmed(): TreeNode[] {
    const keys = this.getAllAvailableOptions(this.options()).map((o) => o.key);

    return this.selected.filter((s) => keys.includes(s.key));
  }

  private getSelectedTooptip(): string {
    return this.selected.map((s) => s.label).join(', ');
  }

  private getTriState(): boolean | null {
    return this.selected.length !== 0
      ? this.optionsTotal() === this.selected.length
      : null;
  }

  private getCheckedNodes(nodes: TreeNode[]): TreeNode[] {
    const checkedNodes: TreeNode[] = [];

    nodes.forEach((node) => {
      if (node.checked) {
        checkedNodes.push(node);
      }

      if (node.children && node.children.length > 0) {
        checkedNodes.push(...this.getCheckedNodes(node.children));
      }
    });

    return checkedNodes;
  }

  private getPrefillWithSelected(
    data: TreeNode[],
    isChecked = false,
  ): TreeNode[] {
    return data.map((datum) => ({
      ...datum,
      checked: isChecked,
      children: datum?.children?.length
        ? this.getPrefillWithSelected(datum.children)
        : undefined,
    }));
  }

  private getAutoSelectedNodes(nodes: TreeNode[]): TreeNode[] {
    const path: TreeNode[] = [];
    let currentLevel = nodes;

    while (currentLevel.length === 1) {
      const node = currentLevel[0];
      path.push(node);
      currentLevel = node.children ?? [];

      if (currentLevel.length !== 1) {
        break;
      }
    }

    return currentLevel.length === 0 ? path : [];
  }
}
