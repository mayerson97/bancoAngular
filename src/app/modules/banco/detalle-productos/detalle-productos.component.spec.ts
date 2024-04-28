import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProductosComponent } from './detalle-productos.component';
import { Product } from '../../../models/Product';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BancoServices } from '../../../services/banco/BancoServices.service';
import { DataSharedService } from '../../../services/banco/DataSharedService';
import { ValidationsUtil } from '../../../util/ValidationsUtil';

describe('DetalleProductosComponent', () => {
  let bancoServicesSpy: { getProducts: jest.Mock, deleteProduct: jest.Mock };
  const mockRouterNavigate = jest.fn();
  const mockValidation = { checkIfLesserOptionPage: jest.fn() };

  const mockDataSharedService = { setProduct: jest.fn() };
  let router: Router;
  let component: DetalleProductosComponent;
  let fixture: ComponentFixture<DetalleProductosComponent>;

  beforeEach(async () => {
    bancoServicesSpy = {
      getProducts: jest.fn(() => of([])),
      deleteProduct: jest.fn(() => of('')),
    };

    router = {
      navigate: mockRouterNavigate
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule, CommonModule, FormsModule],
      providers: [
        { provide: BancoServices, useValue: bancoServicesSpy },
        { provide: Router, useValue: router },
        { provide: DataSharedService, useValue: mockDataSharedService },
        { provide: ValidationsUtil, useValue: mockValidation },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetalleProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('loadProducts', () => {
    it('debe cargar los producto exitosamente', () => {
      const mockProducts: Product[] = [];
      const mockObservable = of(mockProducts);
      bancoServicesSpy.getProducts.mockReturnValue(mockObservable as unknown as Observable<Product[]>);
      component.loadProducts();

      expect(component.isLoadSkeleton).toBe(false);
      expect(component.originalProducts).toEqual(mockProducts);
    });

    it('debe aparecer un error cuando se carga', () => {
      const errorMessage = 'Error consumiendo el servicio consultar todos los productos';
      const errorObservable = new Observable<Product[]>((observer) => {
        observer.error(new Error('Error'));
      });
      bancoServicesSpy.getProducts.mockReturnValue(errorObservable);
      component.loadProducts();

      expect(component.isLoadSkeleton).toBe(false);
      expect(component.originalProducts).toEqual([]);
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe(errorMessage);
    });
  });

  describe('deleteProduct', () => {
    it('debe eliminar  producto exitosamente', () => {
      const mockObservable = of('');
      bancoServicesSpy.deleteProduct.mockReturnValue(mockObservable as unknown as Observable<string>);

      jest.spyOn(component, 'loadProducts').mockImplementation();
      jest.spyOn(component, 'determineTotalResult').mockImplementation();

      const mockProduct = Product.crear('123', '12345', '1234512345',
      'Logo', new Date(), new Date())
      const mockProducts = Array<Product>()
      mockProducts.push(mockProduct)
      component.productToDelete = mockProduct
      component.products = mockProducts

      component.deleteProduct();

      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('exitoso');
      expect(component.alertMessage).toEqual('Producto eliminado con éxito');

    });

    it('debe aparecer un error cuando se elimina', () => {
      const errorMessage = 'Error consumiendo el servicio de eliminación de producto';
      const errorObservable = new Observable<string>((observer) => {
        observer.error(new Error('Error'));
      });
      component.productToDelete = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())
      bancoServicesSpy.deleteProduct.mockReturnValue(errorObservable);
      component.deleteProduct();

      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe(errorMessage);
    });
  });

  describe('hideAlert', () => {
    it('debe ocultarse el modal de alerta', () => {
      component.hideAlert()
      expect(component.showAlert).toBe(false);
      expect(component.typeMessage).toBe('');
    });
  });

  describe('hideAlertConfirmation', () => {
    it('debe ocultarse el modal de alertas de confirmacion', () => {
      component.hideAlertConfirmation()
      expect(component.showAlertConfirmation).toBe(false);
      expect(component.confirmationMessage).toBe('');
    });
  });

  describe('processAlertConfirmation', () => {
    it('debe de operar la alerta de confirmación para eliminar el producto', () => {
      jest.spyOn(component, 'deleteProduct').mockImplementation();
      component.processAlertConfirmation()
      expect(component.showAlertConfirmation).toBe(false);
      expect(component.confirmationMessage).toBe('');
    });
  });

  it('debe set producto y navegar a  gestionar', () => {
    const mockProduct = Product.crear('123', '12345', '1234512345',
      'Logo', new Date(), new Date())
    component.editProduct(mockProduct);
    expect(mockDataSharedService.setProduct).toHaveBeenCalledWith(mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/gestionar']);
  });


  it('debe navegar a gestionar', () => {
    component.addProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/gestionar']);
  });

  it('showConfirmationMessageDeleteProduct debe motras la alerta de confirmación', () => {
    const mockProduct = Product.crear('123', '12345', '1234512345',
      'Logo', new Date(), new Date())
    component.showConfirmationMessageDeleteProduct(mockProduct);
    expect(component.showAlertConfirmation).toBe(true);
    expect(component.confirmationMessage).toBe(`Estas seguro de eliminar el producto ${mockProduct.name}`);
    expect(component.productToDelete).toEqual(mockProduct);
  });

  it('onPageChange debe asiganar el mapinado a mostrar en la grig', () => {
    jest.spyOn(component, 'displayList').mockImplementation();
    jest.spyOn(component, 'determineTotalResult').mockImplementation();

    component.onPageChange('5');
    expect(component.pageSize ).toBe(5);
  });

  it('searchProduct debe buscar producto', () => {
    jest.spyOn(component, 'determineTotalResult').mockImplementation();

    const mockProduct = Product.crear('123', '12345', '1234512345',
    'Logo', new Date(), new Date())
    const mockProducts = Array<Product>()
    mockProducts.push(mockProduct)

    component.originalProducts = mockProducts

    component.searchProduct();
    expect(component.products).toEqual(mockProducts);
  });


  it('determineTotalResult debe ser igual al total de tamaño del paginado', () => {
    mockValidation.checkIfLesserOptionPage.mockReturnValue(false)
    const mockProduct = Product.crear('123', '12345', '1234512345', 'Logo', new Date(), new Date())
    const mockProducts = Array<Product>()
    mockProducts.push(mockProduct)
    mockProducts.push(mockProduct)
    mockProducts.push(mockProduct)
    mockProducts.push(mockProduct)
    mockProducts.push(mockProduct)

    component.products = mockProducts
    component.pageSize = 5

    component.determineTotalResult();
    expect(component.totalRows).toBe(component.pageSize);
  });

  it('determineTotalResult debe ser igual al total de productos', () => {
    mockValidation.checkIfLesserOptionPage.mockReturnValue(true)
    const mockProduct = Product.crear('123', '12345', '1234512345', 'Logo', new Date(), new Date())
    const mockProducts = Array<Product>()
    mockProducts.push(mockProduct)

    component.products = mockProducts
    component.pageSize = 5

    component.determineTotalResult();
    expect(component.totalRows).toBe(component.products.length);
  });

});
