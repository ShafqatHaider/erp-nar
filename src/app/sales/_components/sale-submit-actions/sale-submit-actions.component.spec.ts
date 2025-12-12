import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSubmitActionsComponent } from './sale-submit-actions.component';

describe('SaleSubmitActionsComponent', () => {
  let component: SaleSubmitActionsComponent;
  let fixture: ComponentFixture<SaleSubmitActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleSubmitActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleSubmitActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
