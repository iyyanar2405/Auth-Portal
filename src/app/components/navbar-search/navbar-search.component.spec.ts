import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { createTranslocoServiceMock } from '@auth-portal/shared/testing';

import { NavbarSearchComponent } from './navbar-search.component';

describe('NavbarSearchComponent', () => {
  let component: NavbarSearchComponent;
  let fixture: ComponentFixture<NavbarSearchComponent>;
  let translocoService: Partial<TranslocoService>;

  beforeEach(async () => {
    translocoService = createTranslocoServiceMock();

    await TestBed.configureTestingModule({
      imports: [NavbarSearchComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: translocoService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should initialize with default values', () => {
    expect(component.isButtonSearchActive()).toBe(false);
  });

  test('should handle onSearch correctly', () => {
    const searchEventSpy = jest.spyOn(component.searchEvent, 'emit');
    component.onSearch();
    expect(searchEventSpy).toHaveBeenCalled();
  });

  test('should handle onToggleButtonSearchActive correctly', () => {
    component.onToggleButtonSearchActive(false);
    expect(component.isButtonSearchActive()).toBe(false);
    
    component.onToggleButtonSearchActive(true);
    expect(component.isButtonSearchActive()).toBe(true);
  });
});