import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../../../models/Product';
import { FormsModule } from '@angular/forms';
import { BancoServices } from '../../../services/banco/BancoServices.service';
import { ValidationsUtil } from '../../../util/ValidationsUtil';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { DataSharedService } from '../../../services/banco/DataSharedService';

@Component({
  selector: 'app-detalle-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,
    HttpClientJsonpModule],
  templateUrl: './detalle-productos.component.html',
  styleUrl: './detalle-productos.component.css'
})

export class DetalleProductosComponent {

  @ViewChild('confirmationModal') confirmationModal: ElementRef | undefined;
  pageSize: number = 5;
  optionPage = [5, 10, 20]
  totalRows: number = 0;
  originalProducts: Product[] = new Array<Product>();
  products: Product[] = new Array<Product>();;
  inputSearchValue: string = '';

  productToDelete!: Product;

  showAlert: boolean = false;
  showAlertConfirmation: boolean = false;
  alertMessage: string = 'Error'
  confirmationMessage: string = ''
  typeMessage: string = ''

  isLoadSkeleton: boolean = true;
  dataSkeleton: string[] = ['','','','','']


  constructor(private bancoServices: BancoServices, private validationsUtil: ValidationsUtil,
    private router: Router, private dataSharedService: DataSharedService) {
    this.delay(3000).then(() => {
      this.loadProducts();
      this.products = this.originalProducts;
      this.determineTotalResult();
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  searchProduct() {
    this.products = this.originalProducts;
    this.products = this.products.filter(product => product.name.toUpperCase().startsWith(this.inputSearchValue.toUpperCase()));;
    this.determineTotalResult()
  }

  displayList() {
    return this.products.slice(0, this.pageSize);
  }

  onPageChange(page: string) {
    this.pageSize = +page
    this.displayList()
    this.determineTotalResult()
  }

  determineTotalResult() {
    const totalProducts = this.products.length
    if (this.validationsUtil.checkIfLesserOptionPage(totalProducts, this.optionPage) && totalProducts < this.pageSize)
      this.totalRows = totalProducts
    else this.totalRows = this.pageSize
  }

  showConfirmationMessageDeleteProduct(product: Product) {
    this.showAlertConfirmation = true;
    this.confirmationMessage = `Estas seguro de eliminar el producto ${product.name}`
    this.productToDelete = product
  }

  loadProducts() {
    this.bancoServices.getProducts().pipe(
      tap((products: Product[]) => {
        this.originalProducts = products;
      }),
      catchError((error) => {
        this.originalProducts = new Array<Product>();
        console.error('Error consumiendo el servicio consultar todos los productos:', error);
        this.showAlert = true;
        this.typeMessage = 'error';
        this.alertMessage = 'Error consumiendo el servicio consultar todos los productos';
        return of(false);
      })
    ).subscribe();
  }

  deleteProduct() {
    this.bancoServices.deleteProduct(this.productToDelete.id).pipe(
      tap(() => {
        this.showAlert = true;
        this.typeMessage = 'exitoso'
        this.alertMessage = 'Producto eliminado con éxito'
        this.loadProducts()
        // this.products = this.originalProducts
        this.products = this.products.filter(product => product.id !== this.productToDelete.id);

        this.determineTotalResult()
      }),
      catchError((error) => {
        console.error('Error consumiendo el servicio de eliminación de producto:', error);
        this.showAlert = true;
        this.typeMessage = 'error'
        this.alertMessage = 'Error consumiendo el servicio de eliminación de producto'
        return of(false)
      })
    ).subscribe();
  }

  addProduct() {
    this.router.navigate(['/gestionar']);
  }

  editProduct(product: Product) {
    this.dataSharedService.setProduct(product)
    this.router.navigate(['/gestionar']);
  }

  hideAlert() {
    this.showAlert = false
    this.typeMessage = ''
  }

  hideAlertConfirmation() {
    this.showAlertConfirmation = false
    this.confirmationMessage = ''
  }

  processAlertConfirmation() {
    this.showAlertConfirmation = false
    this.confirmationMessage = ''
    this.deleteProduct();
  }

}
