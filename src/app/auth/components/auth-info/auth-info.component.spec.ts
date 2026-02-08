import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInfoComponent } from './auth-info.component';

describe('AuthInfoComponent', () => {
  let component: AuthInfoComponent;
  let fixture: ComponentFixture<AuthInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
