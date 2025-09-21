import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import { TriStateCheckboxChangeEvent } from 'primeng/tristatecheckbox';

import { createTranslationServiceMock } from '../../../__mocks__';
import { SharedSelectMultipleComponent } from './select-multiple.component';
import {
  SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_DEFAULT_DELAY_MS,
  SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LARGE_DELAY_MS,
  SHARED_SELECT_MULTIPLE_SCROLL_HEIGHT_PX,
} from './select-multiple.constants';

describe('SharedSelectMultipleComponent', () => {
  let component: SharedSelectMultipleComponent<any>;
  let fixture: ComponentFixture<SharedSelectMultipleComponent<any>>;
  let translocoService: Partial<TranslocoService>;
  let ref: any;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();

    TestBed.configureTestingModule({
      imports: [SharedSelectMultipleComponent],
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
    fixture = TestBed.createComponent(SharedSelectMultipleComponent);
    component = fixture.componentInstance;
  });

  test('should initialize with default values', () => {
    // Arrange
    const options = [
      {
        value: 'rabbit',
        label: 'Rabbit',
      },
      {
        value: 'fox',
        label: 'Fox',
      },
    ];
    fixture.componentRef.setInput('options', options);

    // Assert
    expect(component.ariaLabel()).toBeUndefined();
    expect(component.isDisabled()).toBeFalsy();
    expect(component.placeholder()).toBeUndefined();
    expect(component.prefill()).toStrictEqual([]);

    expect(component.hasSearch()).toBeFalsy();
    expect(component.hasTooltip()).toBeFalsy();
    expect(component.tooltipDelay()).toBe(
      SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_LARGE_DELAY_MS,
    );
    expect(component.scrollHeight).toBe(
      `${SHARED_SELECT_MULTIPLE_SCROLL_HEIGHT_PX}px`,
    );
    expect(component.selected()).toStrictEqual([]);
    expect(component.selectedTooltip()).toBe('');
    expect(component.triState()).toBeNull();
  });

  test('should set properties correctly', () => {
    // Arrange
    const options = [
      {
        value: 'rabbit',
        label: 'Rabbit',
      },
      {
        value: 'fox',
        label: 'Fox',
      },
    ];
    const prefill = ['rabbit'];
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('placeholder', 'rabbitPlaceholder');
    fixture.componentRef.setInput('prefill', prefill);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.options()).toStrictEqual(options);
    expect(component.placeholder()).toBe('rabbitPlaceholder');
    expect(component.prefill()).toStrictEqual(prefill);

    expect(component.hasSearch()).toBeFalsy();
    expect(component.hasTooltip()).toBeTruthy();
    expect(component.tooltipDelay()).toBe(
      SHARED_SELECT_MULTIPLE_OPTION_TOOLTIP_DEFAULT_DELAY_MS,
    );
    expect(component.selected()).toStrictEqual(['rabbit']);
    expect(component.triState()).toBeFalsy();
  });

  test('should handle onChange correctly', () => {
    // Arrange
    const mockMultiSelectChangeEvent: MultiSelectChangeEvent = {
      value: ['Rabbit'],
      originalEvent: new Event('change'),
    };
    const changeEventSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    component.onChange(mockMultiSelectChangeEvent);

    // Assert
    expect(changeEventSpy).toHaveBeenCalledWith(['Rabbit']);
  });

  test('should handle onChangeTriState correctly', () => {
    // Arrange
    const options = [
      {
        value: 'rabbit',
        label: 'Rabbit',
      },
      {
        value: 'fox',
        label: 'Fox',
      },
    ];
    const prefill = [
      {
        value: 'rabbit',
        label: 'Rabbit',
      },
    ];
    const mockTriStateChangeEventTrue: TriStateCheckboxChangeEvent = {
      value: true,
      originalEvent: new MouseEvent('click'),
    };
    const mockTriStateChangeEventFalse: TriStateCheckboxChangeEvent = {
      value: false,
      originalEvent: new MouseEvent('click'),
    };
    const changeEventSpy = jest.spyOn(component.changeEvent, 'emit');
    jest.spyOn(
      mockTriStateChangeEventTrue.originalEvent,
      'stopImmediatePropagation',
    );
    jest.spyOn(
      mockTriStateChangeEventFalse.originalEvent,
      'stopImmediatePropagation',
    );
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('prefill', prefill);
    fixture.componentRef.setInput('placeholder', 'rabbitPlaceholder');

    // Act
    component.onChangeTriState(mockTriStateChangeEventTrue);

    // Assert
    expect(
      mockTriStateChangeEventTrue.originalEvent.stopImmediatePropagation,
    ).toHaveBeenCalled();
    expect(component.selected()).toStrictEqual(['rabbit', 'fox']);
    expect(changeEventSpy).toHaveBeenCalledWith(['rabbit', 'fox']);

    // Act
    component.onChangeTriState(mockTriStateChangeEventFalse);

    // Assert
    expect(
      mockTriStateChangeEventFalse.originalEvent.stopImmediatePropagation,
    ).toHaveBeenCalled();
    expect(component.selected()).toStrictEqual([]);
    expect(changeEventSpy).toHaveBeenCalledWith([]);
  });

  test('should auto-select single prefill option', () => {
    // Arrange
    const options = [{ value: 'value1', label: 'label1' }];
    const prefill = ['value1'];
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('prefill', prefill);

    fixture.detectChanges();
    TestBed.flushEffects();

    // Assert
    expect(component.selected()).toEqual(['value1']);
    expect(emitSpy).toHaveBeenCalledWith(['value1']);
  });

  test('should auto-select if only one valid option and no prefill', () => {
    // Arrange
    const options = [{ value: 'value1', label: 'Label1' }];

    // Act
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('prefill', []);
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    fixture.detectChanges();
    TestBed.flushEffects();

    // Assert
    expect(component.selected()).toEqual(['value1']);
    expect(emitSpy).toHaveBeenCalledWith(['value1']);
  });

  test('should not auto-select if multiple valid options exist', () => {
    // Arrange
    const options = [
      { value: 'hawk', label: 'Hawk' },
      { value: 'owl', label: 'Owl' },
    ];

    // Act
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('prefill', []);
    const emitSpy = jest.spyOn(component.changeEvent, 'emit');

    fixture.detectChanges();
    TestBed.flushEffects();

    // Assert
    expect(component.selected()).toEqual([]);
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
