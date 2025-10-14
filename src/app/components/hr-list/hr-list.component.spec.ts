import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrListComponent } from './hr-list.component';

describe('HrListComponent', () => {
  let component: HrListComponent;
  let fixture: ComponentFixture<HrListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
