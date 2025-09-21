import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { OverlayPanel } from 'primeng/overlaypanel';

import {
  createSettingsCoBrowsingStoreServiceMock,
  ProfileLanguageStoreService,
  SettingsCoBrowsingStoreService,
} from '@auth-portal/data-access/settings';
import {
  AuthService,
  createAuthServiceMock,
  createTranslationServiceMock,
  Language,
} from '@auth-portal/shared';

import { NavbarSettingsComponent } from './navbar-settings.component';

describe('NavbarSettingsComponent', () => {
  let component: NavbarSettingsComponent;
  let fixture: ComponentFixture<NavbarSettingsComponent>;
  let authServiceMock: Partial<AuthService>;
  let profileLanguageStoreService: Partial<ProfileLanguageStoreService>;
  let router: Partial<Router>;
  let translocoService: Partial<TranslocoService>;
  const settingsCoBrowsingStoreServiceMock: Partial<SettingsCoBrowsingStoreService> = 
    createSettingsCoBrowsingStoreServiceMock();

  beforeEach(() => {
    profileLanguageStoreService = {
      updateProfileLanguage: jest.fn(),
      languageLabel: signal(Language.English),
    };
    router = {
      navigate: jest.fn(),
    };
    translocoService = createTranslationServiceMock();
    authServiceMock = createAuthServiceMock();

    TestBed.configureTestingModule({
      imports: [NavbarSettingsComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ProfileLanguageStoreService, useValue: profileLanguageStoreService },
        { provide: SettingsCoBrowsingStoreService, useValue: settingsCoBrowsingStoreServiceMock },
        { provide: Router, useValue: router },
        { provide: TranslocoService, useValue: translocoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarSettingsComponent);
    component = fixture.componentInstance;
  });

  test('should initialize with default values', () => {
    expect(component.isButtonSettingsActive()).toBe(false);
    expect(component.isLanguagePickerVisible).toBe(false);
    expect(component.languages()).toEqual([Language.English, Language.Italian]);
  });

  test('should handle onChangeLanguage correctly', () => {
    const language = Language.Italian;
    component.onChangeLanguage(language);
    expect(translocoService.setActiveLang).toHaveBeenCalledWith(language);
  });

  test('should handle onChangeLanguagePickerVisibility correctly', () => {
    component.onChangeLanguagePickerVisibility(true);
    expect(component.isLanguagePickerVisible).toBe(true);
    
    component.onChangeLanguagePickerVisibility(false);
    expect(component.isLanguagePickerVisible).toBe(false);
  });

  test('should handle onToggleButtonSettingsActive correctly', () => {
    const spy = jest.spyOn(component, 'onChangeLanguagePickerVisibility');
    
    component.onToggleButtonSettingsActive(true);
    expect(component.isButtonSettingsActive()).toBe(true);
    
    component.onToggleButtonSettingsActive(false);
    expect(component.isButtonSettingsActive()).toBe(false);
    expect(spy).toHaveBeenCalledWith(false);
  });

  test('should handle onToggleOverlayPanel correctly', () => {
    const mockEvent = new MouseEvent('click');
    const mockPanel = { toggle: jest.fn() } as unknown as OverlayPanel;
    
    component.onToggleOverlayPanel(mockPanel, mockEvent);
    expect(mockPanel.toggle).toHaveBeenCalledWith(mockEvent);
  });
});