import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInformationManagementComponent } from './product-information-management.component';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
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

  describe('validateInformationForm', () => {
    it('debe devolver un error ya que es false validateInputDateRelease debido a que es inferior a la fecha actual', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(false);
      const result = component.validateInformationForm()
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe('Por favor valide la información del formulario');
      expect(result).toBe(false);
    });

    it('debe devolver un error ya que es false validateInputDateRevision debido a que nos hay difenrencia de 1 año entre las fechas', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(true);
      jest.spyOn(component, 'validateInputDateRevision').mockReturnValue(false);
      const result = component.validateInformationForm()
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe('Por favor valide la información del formulario');
      expect(result).toBe(false);
    });


    it('debe devolver un error ya que el formulario es invalido', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(true);
      jest.spyOn(component, 'validateInputDateRevision').mockReturnValue(true);
      component.clearForm()
      const result = component.validateInformationForm()
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe('Por favor valide la información del formulario');
      expect(result).toBe(false);
    });

    it('debe devolver un error si el id ya existe y no es actualización', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(true);
      jest.spyOn(component, 'validateInputDateRevision').mockReturnValue(true);
      jest.spyOn(component, 'validateExistenceId').mockReturnValue(true);
      component.isEdit = false
      const result = component.validateInformationForm()
      expect(component.showAlert).toBe(true);
      expect(component.typeMessage).toBe('error');
      expect(component.alertMessage).toBe('El id ya existe');
      expect(result).toBe(false);
    });

    it('debe devolver exitoso si los datos del son valido y si el id no existe al crear', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(true);
      jest.spyOn(component, 'validateInputDateRevision').mockReturnValue(true);
      jest.spyOn(component, 'validateExistenceId').mockReturnValue(false);
      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: [{ value: '123', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        inputName: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        inputDescription: ['1234512345', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        inputLogo: ['Logo', [Validators.required]],
        inputDateRelease: [fechaOne, [Validators.required]],
        inputDateRevision: [fechaDos, [Validators.required]],
      });
      component.isEdit = false
      const result = component.validateInformationForm()
      expect(result).toBe(true);
    });

    it('debe devolver exitoso al editar si los datos del son valido y si el id existe ', () => {
      jest.spyOn(component, 'validateInputDateRelease').mockReturnValue(true);
      jest.spyOn(component, 'validateInputDateRevision').mockReturnValue(true);
      jest.spyOn(component, 'validateExistenceId').mockReturnValue(true);
      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: [{ value: '123', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        inputName: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        inputDescription: ['1234512345', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        inputLogo: ['Logo', [Validators.required]],
        inputDateRelease: [fechaOne, [Validators.required]],
        inputDateRevision: [fechaDos, [Validators.required]],
      });
      component.isEdit = true
      const result = component.validateInformationForm()
      expect(result).toBe(true);
    });
  });
  describe('clearForm', () => {
    it('debe limpliar el formulario a excepción del id cuando se edita', () => {
      const mockProduct = Product.crear('123', '12345', '1234512345',
        'Logo', new Date(), new Date())

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: [{ value: '123', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        inputName: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        inputDescription: ['1234512345', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        inputLogo: ['Logo', [Validators.required]],
        inputDateRelease: [fechaOne, [Validators.required]],
        inputDateRevision: [fechaDos, [Validators.required]],
      });

      mockDataSharedService.getProduct.mockReturnValue(mockProduct);
      component.clearForm()
      expect(component.formProductGroup.get('inputId')?.value).toBe('123');
      expect(component.formProductGroup.status).toBe('INVALID');
      expect(component.formProductGroup.value.inputName).toBe(null);
      expect(component.formProductGroup.value.inputDescription).toBe(null);
      expect(component.formProductGroup.value.inputLogo).toBe(null);
      expect(component.formProductGroup.value.inputDateRelease).toBe(null);
      expect(component.formProductGroup.value.inputDateRevision).toBe(null);
    });

    it('debe limpliar el formulario crear', () => {

      const fechaOne = new Date('2023-01-01')
      const fechaDos = new Date('2024-01-01')

      component.formProductGroup = formBuilder.group({
        inputId: [{ value: '123', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
        inputName: ['12345', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        inputDescription: ['1234512345', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        inputLogo: ['Logo', [Validators.required]],
        inputDateRelease: [fechaOne, [Validators.required]],
        inputDateRevision: [fechaDos, [Validators.required]],
      });
      mockDataSharedService.getProduct.mockImplementation()
      component.clearForm()
      expect(component.formProductGroup.value.inputId).toBe(null);
      expect(component.formProductGroup.value.inputName).toBe(null);
      expect(component.formProductGroup.value.inputDescription).toBe(null);
      expect(component.formProductGroup.value.inputLogo).toBe(null);
      expect(component.formProductGroup.value.inputDateRelease).toBe(null);
      expect(component.formProductGroup.value.inputDateRevision).toBe(null);

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


  describe('isValidFormGroupStatus', () => {
    it('debe validarse el estado valid de los campos dentro del formulario cuando ya fue manipulado por el usuario', () => {

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

     component.formProductGroup.get('inputId')?.markAsTouched();
     component.formProductGroup.get('inputName')?.markAsTouched();
     component.formProductGroup.get('inputDescription')?.markAsTouched();
     component.formProductGroup.get('inputLogo')?.markAsTouched();
     component.formProductGroup.get('inputDateRelease')?.markAsTouched();
     component.formProductGroup.get('inputDateRevision')?.markAsTouched();

      const result = component.isValidFormGroupStatus('inputId', 'valid')
      && component.isValidFormGroupStatus('inputName', 'valid')
      && component.isValidFormGroupStatus('inputDescription', 'valid')
      && component.isValidFormGroupStatus('inputLogo', 'valid')
      && component.isValidFormGroupStatus('inputDateRelease', 'valid')
      && component.isValidFormGroupStatus('inputDateRevision', 'valid')
      expect(result).toBe(true)
    });

    it('debe validarse el estado valid de los campos dentro del formulario cuando no fue manipulado por el usuario', () => {

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

      const result = component.isValidFormGroupStatus('inputId', 'valid')
      && component.isValidFormGroupStatus('inputName', 'valid')
      && component.isValidFormGroupStatus('inputDescription', 'valid')
      && component.isValidFormGroupStatus('inputLogo', 'valid')
      && component.isValidFormGroupStatus('inputDateRelease', 'valid')
      && component.isValidFormGroupStatus('inputDateRevision', 'valid')
      expect(result).toBe(false)
    });

    it('debe validarse el estado inValid de los campos dentro del formulario cuando ya fue manipulado por el usuario', () => {


     component.formProductGroup.get('inputId')?.markAsTouched();
     component.formProductGroup.get('inputName')?.markAsTouched();
     component.formProductGroup.get('inputDescription')?.markAsTouched();
     component.formProductGroup.get('inputLogo')?.markAsTouched();
     component.formProductGroup.get('inputDateRelease')?.markAsTouched();
     component.formProductGroup.get('inputDateRevision')?.markAsTouched();

      const result = component.isValidFormGroupStatus('inputId', 'invalid')
      && component.isValidFormGroupStatus('inputName', 'invalid')
      && component.isValidFormGroupStatus('inputDescription', 'invalid')
      && component.isValidFormGroupStatus('inputLogo', 'invalid')
      && component.isValidFormGroupStatus('inputDateRelease', 'invalid')
      && component.isValidFormGroupStatus('inputDateRevision', 'invalid')
      expect(result).toBe(true)
    });

    it('debe validarse el estado invalid de los campos dentro del formulario cuando no fue manipulado por el usuario', () => {
      const result = component.isValidFormGroupStatus('inputId', 'invalid')
      && component.isValidFormGroupStatus('inputName', 'invalid')
      && component.isValidFormGroupStatus('inputDescription', 'invalid')
      && component.isValidFormGroupStatus('inputLogo', 'invalid')
      && component.isValidFormGroupStatus('inputDateRelease', 'invalid')
      && component.isValidFormGroupStatus('inputDateRevision', 'invalid')
      expect(result).toBe(false)
    });

  });


  describe('isValidFormGroupStatusWithOtherValidations', () => {
    it('debe validarse el estado valid de los campos dentro del formulario cuando ya fue manipulado por el usuario', () => {

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

     component.formProductGroup.get('inputId')?.markAsTouched();
     component.formProductGroup.get('inputName')?.markAsTouched();
     component.formProductGroup.get('inputDescription')?.markAsTouched();
     component.formProductGroup.get('inputLogo')?.markAsTouched();
     component.formProductGroup.get('inputDateRelease')?.markAsTouched();
     component.formProductGroup.get('inputDateRevision')?.markAsTouched();

     const result = component.isValidFormGroupStatusWithOtherValidations('inputId', 'valid', true)
     && component.isValidFormGroupStatusWithOtherValidations('inputName', 'valid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDescription', 'valid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputLogo', 'valid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDateRelease', 'valid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDateRevision', 'valid', true)
      expect(result).toBe(true)
    });

    it('debe validarse el estado valid de los campos dentro del formulario cuando no fue manipulado por el usuario', () => {

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

      const result = component.isValidFormGroupStatusWithOtherValidations('inputId', 'valid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputName', 'valid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDescription', 'valid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputLogo', 'valid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDateRelease', 'valid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDateRevision', 'valid', true)
      expect(result).toBe(false)
    });

    it('debe validarse el estado inValid de los campos dentro del formulario cuando ya fue manipulado por el usuario', () => {


     component.formProductGroup.get('inputId')?.markAsTouched();
     component.formProductGroup.get('inputName')?.markAsTouched();
     component.formProductGroup.get('inputDescription')?.markAsTouched();
     component.formProductGroup.get('inputLogo')?.markAsTouched();
     component.formProductGroup.get('inputDateRelease')?.markAsTouched();
     component.formProductGroup.get('inputDateRevision')?.markAsTouched();

     const result = component.isValidFormGroupStatusWithOtherValidations('inputId', 'invalid', true)
     && component.isValidFormGroupStatusWithOtherValidations('inputName', 'invalid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDescription', 'invalid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputLogo', 'invalid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDateRelease', 'invalid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputDateRevision', 'invalid', true)
      expect(result).toBe(true)
    });

    it('debe validarse el estado invalid de los campos dentro del formulario cuando no fue manipulado por el usuario', () => {
      const result = component.isValidFormGroupStatusWithOtherValidations('inputId', 'invalid', true)
      && component.isValidFormGroupStatusWithOtherValidations('inputName', 'invalid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDescription', 'invalid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputLogo', 'invalid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDateRelease', 'invalid', true)
       && component.isValidFormGroupStatusWithOtherValidations('inputDateRevision', 'invalid', true)
      expect(result).toBe(false)
    });

  });
});
