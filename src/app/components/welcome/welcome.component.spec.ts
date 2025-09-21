import { ComponentFixture, TestBed } from '@angular/core/testing';
import { 
  AuthService, 
  createAuthServiceMock,
  getTranslocoModule 
} from '@customer-portal/shared';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  const authService = createAuthServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent, getTranslocoModule()],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compileComponents();
    
    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should call AuthService login on login button click', () => {
    component.onLoginClick();
    expect(authService.login).toHaveBeenCalled();
  });

  test('should set isUserValidated from window.history.state on ngOnInit', () => {
    const mockState = { isUserValidated: true };
    Object.defineProperty(window, 'history', {
      value: { state: mockState },
      writable: true,
    });
    component.ngOnInit();
    expect(component.isUserValidated).toBe(true);
  });

  test('should default isUserValidated to undefined when state is not set', () => {
    Object.defineProperty(window, 'history', {
      value: { state: undefined },
      writable: true,
    });
    component.ngOnInit();
    expect(component.isUserValidated).toBe(undefined);
  });
});