import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AuthService,
  createAuthServiceMock,
  getTranslocoModule,
} from '../../index';
import { SessionTimeoutModalComponent } from './session-timeout-modal.component';

describe('SessionTimeoutModalComponent', () => {
  let component: SessionTimeoutModalComponent;
  let fixture: ComponentFixture<SessionTimeoutModalComponent>;
  const authService: Partial<AuthService> = createAuthServiceMock();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTimeoutModalComponent, getTranslocoModule()],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionTimeoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
