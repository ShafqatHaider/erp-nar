import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMainFormComponent } from './sale-main-form.component';

describe('SaleMainFormComponent', () => {
  let component: SaleMainFormComponent;
  let fixture: ComponentFixture<SaleMainFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleMainFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleMainFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
