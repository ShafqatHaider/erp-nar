import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemsGridComponent } from './sale-items-grid.component';

describe('SaleItemsGridComponent', () => {
  let component: SaleItemsGridComponent;
  let fixture: ComponentFixture<SaleItemsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleItemsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleItemsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
