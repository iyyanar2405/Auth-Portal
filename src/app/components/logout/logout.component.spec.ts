import { ComponentFixture, TestBed } from '@angular/core/testing';
import { 
  AuthService, 
  createAuthServiceMock, 
  getTranslocoModule 
} from '@customer-portal/shared';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  const authService: Partial<AuthService> = createAuthServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutComponent, getTranslocoModule()],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});