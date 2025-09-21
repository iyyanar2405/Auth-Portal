import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';

import { createTranslationServiceMock } from '../../__mocks__';
import { CustomCardComponent } from './custom-card.component';

describe('CustomCardComponent', () => {
  let component: CustomCardComponent;
  let fixture: ComponentFixture<CustomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomCardComponent],
      providers: [
        {
          provide: TranslocoService,
          useValue: createTranslationServiceMock(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
