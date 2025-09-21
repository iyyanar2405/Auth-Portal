import { DestroyRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';

import {
  createDestroyRefMock,
  createTranslationServiceMock,
} from '../../__mocks__';
import { SharedPageToggleComponent } from './page-toggle.component';

describe('SharedPageToggleComponent', () => {
  let component: SharedPageToggleComponent;
  let fixture: ComponentFixture<SharedPageToggleComponent>;
  let translocoService: Partial<TranslocoService>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let destroyRefMock: Partial<DestroyRef>;

  beforeEach(() => {
    translocoService = createTranslationServiceMock();
    routerMock = {
      events: of(),
      navigate: jest.fn(),
      url: 'audit/2',
    };
    activatedRouteMock = {};
    destroyRefMock = createDestroyRefMock();

    TestBed.configureTestingModule({
      imports: [SharedPageToggleComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
        {
          provide: DestroyRef,
          useValue: destroyRefMock,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SharedPageToggleComponent);
    component = fixture.componentInstance;
  });

  test('should initialize with default values', () => {
    // Arrange
    fixture.componentRef.setInput('data', [
      {
        label: 'rabbit',
        value: '1',
      },
      {
        label: 'fox',
        value: '2',
      },
    ]);

    // Assert
    expect(component.data()).toStrictEqual([
      {
        label: 'rabbit',
        value: '1',
      },
      {
        label: 'fox',
        value: '2',
      },
    ]);
  });

  test('should set properties correctly', () => {
    // Arrange
    const data = [
      {
        i18nKey: 'myKey.rabbit',
        icon: 'iconRabbit',
        label: 'rabbit',
        value: '1',
      },
      {
        i18nKey: 'myKey.fox',
        icon: 'iconFox',
        label: 'fox',
        value: '2',
      },
    ];
    fixture.componentRef.setInput('data', data);

    // Act
    TestBed.flushEffects();
    fixture.detectChanges();

    // Assert
    expect(component.data()).toStrictEqual(data);
    expect(component.options()).toStrictEqual([
      {
        i18nKey: 'myKey.rabbit',
        icon: 'iconRabbit',
        isActive: false,
        label: 'rabbit',
        value: '1',
      },
      {
        i18nKey: 'myKey.fox',
        icon: 'iconFox',
        isActive: true,
        label: 'fox',
        value: '2',
      },
    ]);
  });

  test('should handle onChange correctly', () => {
    // Act
    component.onChange('1');

    // Assert
    expect(component['router'].navigate).toHaveBeenCalledWith(['1'], {
      relativeTo: expect.any(Object),
    });
  });

  test('should handle getOptions correctly', () => {
    // Arrange
    const data = [
      {
        i18nKey: 'myKey.rabbit',
        icon: 'iconRabbit',
        label: 'rabbit',
        value: '1',
      },
      {
        i18nKey: 'myKey.fox',
        icon: 'iconFox',
        label: 'fox',
        value: '2',
      },
    ];
    let options = [];
    fixture.componentRef.setInput('data', data);

    // Act
    options = component['getOptions']();

    // Assert
    expect(options).toStrictEqual([
      {
        i18nKey: 'myKey.rabbit',
        icon: 'iconRabbit',
        isActive: false,
        label: 'rabbit',
        value: '1',
      },
      {
        i18nKey: 'myKey.fox',
        icon: 'iconFox',
        isActive: true,
        label: 'fox',
        value: '2',
      },
    ]);
  });

  test('should handle isActiveOption correctly', () => {
    // Arrange
    // Act
    const resultRabbit = component['isActiveOption']('1');
    const resultFox = component['isActiveOption']('2');

    // Assert
    expect(resultRabbit).toBeFalsy();
    expect(resultFox).toBeTruthy();
  });
});
