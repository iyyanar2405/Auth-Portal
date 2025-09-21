import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { SelectButtonChangeEvent } from 'primeng/selectbutton';

import { createTranslationServiceMock } from '../../__mocks__';
import { SharedButtonToggleComponent } from './button-toggle.component';

describe('SharedButtonToggleComponent', () => {
  let component: SharedButtonToggleComponent<any>;
  let fixture: ComponentFixture<SharedButtonToggleComponent<any>>;
  let translocoService: Partial<TranslocoService>;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();

    TestBed.configureTestingModule({
      imports: [SharedButtonToggleComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SharedButtonToggleComponent);
    component = fixture.componentInstance;
  });

  test('should initialize with default values', () => {
    // Arrange
    fixture.componentRef.setInput('options', [
      {
        isActive: false,
        label: 'rabbit',
        value: 1,
      },
      {
        isActive: true,
        label: 'fox',
        value: 2,
      },
    ]);

    // Assert
    expect(component.options()).toStrictEqual([
      {
        isActive: false,
        label: 'rabbit',
        value: 1,
      },
      {
        isActive: true,
        label: 'fox',
        value: 2,
      },
    ]);
  });

  test('should set properties correctly', () => {
    // Arrange
    const options = [
      {
        i18nKey: 'myKey.rabbit',
        icon: 'iconRabbit',
        isActive: false,
        label: 'rabbit',
        value: 1,
      },
      {
        i18nKey: 'myKey.fox',
        icon: 'iconFox',
        isActive: true,
        label: 'fox',
        value: 2,
      },
    ];
    fixture.componentRef.setInput('options', options);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.options()).toStrictEqual(options);
    expect(component.selected()).toBe(2);
  });

  test('should handle onChange correctly', () => {
    // Arrange
    const mockSelectButtonChangeEvent: SelectButtonChangeEvent = {
      value: 3,
      originalEvent: new Event('change'),
    };
    const changeEventSpy = jest.spyOn(component.changeEvent, 'emit');

    // Act
    component.onChange(mockSelectButtonChangeEvent);

    // Assert
    expect(changeEventSpy).toHaveBeenCalledWith(3);
  });

  test('should handle getSelected correctly', () => {
    // Arrange
    const options = [
      {
        i18nKey: 'myKey.bear',
        icon: 'iconBear',
        isActive: false,
        label: 'bear',
        value: 4,
      },
      {
        i18nKey: 'myKey.wolf',
        icon: 'iconWolf',
        isActive: false,
        label: 'wolf',
        value: 5,
      },
    ];
    fixture.componentRef.setInput('options', options);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();
    const result = component['getSelected']();

    // Assert
    expect(result).toBe(4);
  });
});
