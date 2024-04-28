import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInformationManagementComponent } from './product-information-management.component';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { BancoServices } from '../../../services/banco/BancoServices.service';
import { DataSharedService } from '../../../services/banco/DataSharedService';
import { ValidationsUtil } from '../../../util/ValidationsUtil';
import { Product } from '../../../models/Product';

describe('ProductInformationManagementComponent', () => {
  let bancoServicesSpy: {
    getProducts: jest.Mock, deleteProduct: jest.Mock,
    createProduct: jest.Mock, editProduct: jest.Mock, verifyExistenceId: jest.Mock
  };
  const mockRouterNavigate = jest.fn();
  const mockValidation = { checkIfLesserOptionPage: jest.fn(), isOneYearOfDifference: jest.fn() };

  const mockDataSharedService = { setProduct: jest.fn(), getProduct: jest.fn() };
  let router: Router;
  let component: ProductInformationManagementComponent;
  let fixture: ComponentFixture<ProductInformationManagementComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    bancoServicesSpy = {
      getProducts: jest.fn(() => of([])),
      deleteProduct: jest.fn(() => of('')),
      createProduct: jest.fn(() => of([])),
      editProduct: jest.fn(() => of([])),
      verifyExistenceId: jest.fn(() => of(true)),
    };

    router = {
      navigate: mockRouterNavigate
    } as any;

    formBuilder = new FormBuilder();


    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterModule, CommonModule, FormsModule],
      providers: [
        { provide: BancoServices, useValue: bancoServicesSpy },
        { provide: Router, useValue: router },
        { provide: DataSharedService, useValue: mockDataSharedService },
        { provide: ValidationsUtil, useValue: mockValidation },
        { provide: FormBuilder, useValue: formBuilder },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductInformationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('hideAlert', () => {
    it('debe ocultarse el modal de alerta', () => {
      component.hideAlet()
      expect(component.showAlert).toBe(false);
      expect(component.typeMessage).toBe('');
    });
  });


  describe('loadProductToEdit', () => {
    it('debe cargar el formulario en caso de ser una edición', () => {
      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())

      mockDataSharedService.getProduct.mockReturnValue(mockProduct);

      component.loadProductToEdit()
      expect(component.isEdit).toBe(true);
      expect(component.formProductGroup.status).toBe('VALID');
    });
  });


  describe('sendAdd', () => {
    it('debe enviar a crear el producto', () => {
      jest.spyOn(component, 'validateInformationForm').mockReturnValue(true);
      jest.spyOn(component, 'createProduct').mockImplementation();

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: ['123'],
        inputName: ['12345'],
        inputDescription: ['1234512345'],
        inputLogo: ['Logo'],
        inputDateRelease: [fechaOne],
        inputDateRevision: [fechaDos]
      });

      component.sendAdd()
      expect(component.createProduct).toHaveBeenCalledWith(
        Product.crear('123', '12345', '1234512345',
          'Logo', fechaOne, fechaDos)
      );
    });

    it('no debe enviar a crear el producto', () => {
      jest.spyOn(component, 'validateInformationForm').mockReturnValue(false);
      jest.spyOn(component, 'createProduct').mockImplementation();

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: ['123'],
        inputName: ['12345'],
        inputDescription: ['1234512345'],
        inputLogo: ['Logo'],
        inputDateRelease: [fechaOne],
        inputDateRevision: [fechaDos]
      });

      component.sendAdd()
      expect(component.createProduct).not.toHaveBeenCalled();
    });
  });


  describe('sendEdit', () => {
    it('debe enviar a editar el producto', () => {
      jest.spyOn(component, 'validateInformationForm').mockReturnValue(true);
      jest.spyOn(component, 'editProduct').mockImplementation();

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: ['123'],
        inputName: ['12345'],
        inputDescription: ['1234512345'],
        inputLogo: ['Logo'],
        inputDateRelease: [fechaOne],
        inputDateRevision: [fechaDos]
      });

      component.sendEdit()
      expect(component.editProduct).toHaveBeenCalledWith(
        Product.crear('123', '12345', '1234512345',
          'Logo', fechaOne, fechaDos)
      );
    });

    it('no debe enviar a editar el producto', () => {
      jest.spyOn(component, 'validateInformationForm').mockReturnValue(false);
      jest.spyOn(component, 'editProduct').mockImplementation();

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: ['123'],
        inputName: ['12345'],
        inputDescription: ['1234512345'],
        inputLogo: ['Logo'],
        inputDateRelease: [fechaOne],
        inputDateRevision: [fechaDos]
      });

      component.sendEdit()
      expect(component.editProduct).not.toHaveBeenCalled();
    });
  });


  describe('createProduct', () => {
    it('debe crear  producto exitosamente', () => {
      const mockProducts: Product[] = [];
      const mockObservable = of(mockProducts);

      bancoServicesSpy.createProduct.mockReturnValue(mockObservable as unknown as Observable<Product[]>);
      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())
      component.createProduct(mockProduct);

      expect(component.isLoading).toBe(false);
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('exitoso');
      expect(component.alertMessage).toEqual('Producto creado con éxito');

    });

    it('debe aparecer un error cuando se intenta crear', () => {
      const errorMessage = 'Error consumiendo el servicio de creación de producto';
      const errorObservable = new Observable<string>((observer) => {
        observer.error(new Error('Error'));
      });

      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())

      bancoServicesSpy.createProduct.mockReturnValue(errorObservable);

      component.createProduct(mockProduct);

      expect(component.isLoading).toBe(false);
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('error');
      expect(component.alertMessage).toEqual(errorMessage);
    });
  });


  describe('editProduct', () => {
    it('debe edit  producto exitosamente', () => {
      const mockProducts: Product[] = [];
      const mockObservable = of(mockProducts);

      bancoServicesSpy.editProduct.mockReturnValue(mockObservable as unknown as Observable<Product[]>);
      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())
      component.editProduct(mockProduct);

      expect(component.isLoading).toBe(false);
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('exitoso');
      expect(component.alertMessage).toEqual('Producto editado con éxito');

    });

    it('debe aparecer un error cuando se intenta edit', () => {
      const errorMessage = 'Error consumiendo el servicio de edición de producto';
      const errorObservable = new Observable<string>((observer) => {
        observer.error(new Error('Error'));
      });

      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())

      bancoServicesSpy.editProduct.mockReturnValue(errorObservable);

      component.editProduct(mockProduct);

      expect(component.isLoading).toBe(false);
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('error');
      expect(component.alertMessage).toEqual(errorMessage);
    });
  });


  describe('validateExistenceId', () => {
    it('debe validar existencia', () => {
      const mockProducts = true;
      const mockObservable = of(mockProducts);

      bancoServicesSpy.verifyExistenceId.mockReturnValue(mockObservable as unknown as Observable<boolean>);
      
      const result = component.validateExistenceId('123');

      expect(result).toBe(true);

    });

    it('debe aparecer un error cuando se valida existenca', () => {
      const errorMessage = 'Error consumiendo el servicio de validar ID';
      const errorObservable = new Observable<string>((observer) => {
        observer.error(new Error('Error'));
      });

      bancoServicesSpy.verifyExistenceId.mockReturnValue(errorObservable);

      component.validateExistenceId('123');

      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toEqual('error');
      expect(component.alertMessage).toEqual(errorMessage);
    });
  });

});
