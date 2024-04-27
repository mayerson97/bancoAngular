import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { ValidationsUtil } from '../../../util/ValidationsUtil';
import { CommonModule } from '@angular/common';
import { BancoServices } from '../../../services/banco/BancoServices.service';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Product } from '../../../models/Product';
import { catchError, of, tap } from 'rxjs';
import { DataSharedService } from '../../../services/banco/DataSharedService';
import moment from 'moment';

@Component({
  selector: 'app-product-information-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule,
    HttpClientJsonpModule],
  templateUrl: './product-information-management.component.html',
  styleUrl: './product-information-management.component.css'
})
export class ProductInformationManagementComponent {

  formProductGroup!: FormGroup
  showAlert: boolean = false;
  alertMessage: string = 'Error'
  typeMessage: string = ''
  isDisabledInputId: boolean = false
  isEdit: boolean = false

  constructor(private formBuilder: FormBuilder, private bancoServices: BancoServices,
    private validationsUtil: ValidationsUtil, private dataSharedService: DataSharedService) {
    this.buildForm();
    this.loadProductToEdit();
  }

  buildForm() {
    this.formProductGroup = this.formBuilder.group({
      inputId: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      inputName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      inputDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      inputLogo: ['', [Validators.required]],
      inputDateRelease: ['', [Validators.required]],
      inputDateRevision: ['', [Validators.required]]

    });
  }

  loadProductToEdit() {
    const product = this.dataSharedService.getProduct()
    if (product) {
      this.formProductGroup.setValue({
        inputId: product.id,
        inputName: product.name,
        inputDescription: product.description,
        inputLogo: product.logo,
        inputDateRelease: moment(product.date_release).format('YYYY-MM-DD'),
        inputDateRevision: moment(product.date_revision).format('YYYY-MM-DD')
      });
      this.isEdit = true
      this.formProductGroup.get('inputId')?.disable()
    }
  }

  sendAdd() {
    if (this.validateInformationForm()) {
      const formData = this.formProductGroup.value
      const request = Product.crear(formData.inputId, formData.inputName, formData.inputDescription,
        formData.inputLogo, formData.inputDateRelease, formData.inputDateRevision)
      this.createProduct(request);
    }
  }

  sendEdit() {
    if (this.validateInformationForm()) {
      const formData = this.formProductGroup.value
      const request = Product.crear(this.formProductGroup.get('inputId')?.value, formData.inputName, formData.inputDescription,
        formData.inputLogo, formData.inputDateRelease, formData.inputDateRevision)
      this.editProduct(request);
    }
  }

  createProduct(product: Product) {
    this.bancoServices.createProduc(product).pipe(
      tap((products: Product[]) => {
        this.showAlert = true;
        this.typeMessage = 'exitoso'
        this.alertMessage = 'Producto creado con éxito'
      }),
      catchError((error) => {
        console.error('Error consumiendo el servicio de creación de producto:', error);
        this.showAlert = true;
        this.typeMessage = 'error'
        this.alertMessage = 'Error consumiendo el servicio de creación de producto'
        return of(false)
      })
    ).subscribe();
  }


  editProduct(product: Product) {
    this.bancoServices.editProduc(product).pipe(
      tap((products: Product[]) => {
        this.showAlert = true;
        this.typeMessage = 'exitoso'
        this.alertMessage = 'Producto editado con éxito'
      }),
      catchError((error) => {
        console.error('Error consumiendo el servicio de edición de producto:', error);
        this.showAlert = true;
        this.typeMessage = 'error'
        this.alertMessage = 'Error consumiendo el servicio de edición de producto'
        return of(false)
      })
    ).subscribe();
  }

  clearForm() {
    if (this.dataSharedService.getProduct()) {
      this.formProductGroup.reset({ inputId: this.formProductGroup.get('inputId')?.value });
    } else {
      this.formProductGroup.reset();
    }
  }

  validateInputDateRelease(): boolean {
    const today = format(new Date(), 'yyyy-MM-dd');
    const dateRelease = this.formProductGroup?.value.inputDateRelease
    return new Date(dateRelease) >= new Date(today)
  }

  validateInputDateRevision(): boolean {
    const dateRelease = this.formProductGroup.value.inputDateRelease
    const inputDateRevision = this.formProductGroup.value.inputDateRevision
    return this.validationsUtil.isOneYearOfDifference(new Date(inputDateRevision), new Date(dateRelease));
  }

  validateExistenceId(id: string): boolean {
    let result = false;

    this.bancoServices.verifyExistenceId(id).pipe(
      tap((exists: boolean) => {
        result = exists;
      }),
      catchError((error) => {
        console.error('Error al verificar la existencia del ID:', error);
        this.showAlert = true;
        this.typeMessage = 'error'
        this.alertMessage = 'Error consumiendo el servicio de validar ID'
        return of(false)
      })
    ).subscribe();

    return result;
  }

  validateInformationForm(): boolean {
    if (!this.validateInputDateRelease() && !this.validateInputDateRevision() && this.formProductGroup.status === 'INVALID') {
      this.showAlert = true;
      this.typeMessage = 'error'
      this.alertMessage = 'Por favor valide la información del formulario'
      return false
    }
    console.log(this.formProductGroup);
    if (this.validateExistenceId(this.formProductGroup.get('inputId')?.value)) {
      this.showAlert = true;
      this.typeMessage = 'error'
      this.alertMessage = 'El id ya existe'
      return false
    }

    return true;
  }

  isValidFormGroupStatus(inputName: string, status: 'valid' | 'invalid') {
    const inputControl = this.formProductGroup.get(inputName);
    return inputControl && (inputControl.touched) && ((status === 'valid' && inputControl.valid) || (status === 'invalid' && inputControl.invalid));
  }

  isValidFormGroupStatusWithOtherValidations(inputName: string, status: 'valid' | 'invalid', otherValidate: boolean) {
    const inputControl = this.formProductGroup.get(inputName);
    return inputControl && (inputControl.touched) &&
      ((status === 'valid' && inputControl.valid && otherValidate) || (status === 'invalid' && (!otherValidate || inputControl.invalid)));
  }

  hideAlet() {
    this.showAlert = false
    this.typeMessage = ''
  }

}
