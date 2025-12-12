import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemRowComponent } from './sale-item-row.component';

describe('SaleItemRowComponent', () => {
  let component: SaleItemRowComponent;
  let fixture: ComponentFixture<SaleItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
