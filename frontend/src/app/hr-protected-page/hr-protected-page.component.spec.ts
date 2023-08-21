import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrProtectedPageComponent } from './hr-protected-page.component';

describe('HrProtectedPageComponent', () => {
  let component: HrProtectedPageComponent;
  let fixture: ComponentFixture<HrProtectedPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrProtectedPageComponent]
    });
    fixture = TestBed.createComponent(HrProtectedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
