import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInformationManagementComponent } from './product-information-management.component';

describe('ProductInformationManagementComponent', () => {
  let component: ProductInformationManagementComponent;
  let fixture: ComponentFixture<ProductInformationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInformationManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductInformationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
