import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { TreeNode } from 'primeng/api';

import { createTranslationServiceMock } from '../../../__mocks__';
import { SharedSelectTreeComponent } from './select-tree.component';
import {
  SHARED_SELECT_TREE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  SHARED_SELECT_TREE_SCROLL_HEIGHT_PX,
} from './select-tree.constants';

describe('SharedSelectTreeComponent', () => {
  const options: TreeNode[] = [
    {
      key: '1',
      label: 'Belgium',
      children: [
        {
          key: '1-1',
          label: 'Antwerp',
          children: [
            {
              key: '1-1-1',
              label: 'Site 1',
            },
            {
              key: '1-1-2',
              label: 'Site 2',
            },
          ],
        },
      ],
    },
    {
      key: '2',
      label: 'Italy',
      children: [
        {
          key: '2-1',
          label: 'Rome',
          children: [
            {
              key: '2-1-1',
              label: 'Site 1',
            },
            {
              key: '2-1-2',
              label: 'Site 2',
            },
          ],
        },
      ],
    },
  ];
  let component: SharedSelectTreeComponent;
  let fixture: ComponentFixture<SharedSelectTreeComponent>;
  let translocoService: Partial<TranslocoService>;
  let ref: any;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();
    ref = { markForCheck: jest.fn() };

    TestBed.configureTestingModule({
      imports: [SharedSelectTreeComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
        {
          provide: ChangeDetectorRef,
          useValue: ref,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SharedSelectTreeComponent);
    component = fixture.componentInstance;
  });

  test('should have default values for inputs', () => {
    // Arrange
    fixture.componentRef.setInput('options', options);

    // Assert
    expect(component.ariaLabel()).toBeUndefined();
    expect(component.isDisabled()).toBeFalsy();
    expect(component.options()).toBe(options);
    expect(component.placeholder()).toBeUndefined();
    expect(component.prefill()).toStrictEqual([]);

    expect(component.hasSearch()).toBeFalsy();
    expect(component.hasTooltip()).toBeFalsy();
    expect(component.scrollHeight).toBe(
      `${SHARED_SELECT_TREE_SCROLL_HEIGHT_PX}px`,
    );
    expect(component.selected).toStrictEqual([]);
    expect(component.tooltipDelay()).toBe(
      SHARED_SELECT_TREE_OPTION_TOOLTIP_LARGE_DELAY_MS,
    );
    expect(component.triState()).toBeNull();
  });

  test('should update selectedOptions and emit changeEvent on onChange()', () => {
    // Arrange
    fixture.componentRef.setInput('options', options);
    const mockTreeNodeSelectEvent = {
      originalEvent: new MouseEvent('click'),
      node: {},
    };
    const mockNodes: TreeNode[] = [
      { data: 1, key: 'key1', label: 'Node 1' },
      { data: 2, key: 'key2', label: 'Node 2' },
    ];
    component.selected = mockNodes;
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    component.onChange(mockTreeNodeSelectEvent);

    // Assert
    expect(emitSpy).toHaveBeenCalled();
  });

  test('should emit changeEvent with empty array if no options are selected', () => {
    // Arrange
    const mockTreeNodeSelectEvent = {
      originalEvent: new MouseEvent('click'),
      node: {},
    };
    component.selected = [];
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    component.onChange(mockTreeNodeSelectEvent);

    // Assert
    expect(emitSpy).toHaveBeenCalled();
  });

  test('should auto-select single path when no prefill is provided', () => {
    // Arrange
    const singlePath: TreeNode[] = [
      {
        key: 'root',
        label: 'Root',
        children: [
          {
            key: 'child',
            label: 'Child',
            children: [
              {
                key: 'grandchild',
                label: 'Grandchild',
              },
            ],
          },
        ],
      },
    ];

    fixture.componentRef.setInput('options', singlePath);
    fixture.componentRef.setInput('prefill', []);
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.selected.length).toBe(3);
    expect(component.selected.map((n) => n.key)).toEqual([
      'root',
      'child',
      'grandchild',
    ]);
    expect(emitSpy).toHaveBeenCalled();
  });

  test('should not auto-select if any level has multiple children', () => {
    // Arrange
    const multiLevelOptions: TreeNode[] = [
      {
        key: '1',
        label: 'Europe',
        children: [
          {
            key: '1-1',
            label: 'Germany',
            children: [
              { key: '1-1-1', label: 'Berlin' },
              { key: '1-1-2', label: 'Munich' },
            ],
          },
        ],
      },
    ];
    fixture.componentRef.setInput('options', multiLevelOptions);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.selected.length).toBe(0);
  });
});
