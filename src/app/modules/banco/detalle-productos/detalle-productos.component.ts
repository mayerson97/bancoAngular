import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../../../models/Product';
import { FormsModule } from '@angular/forms';
import { BancoServices } from '../../../services/banco/BancoServices.service';
import { ValidationsUtil } from '../../../util/ValidationsUtil';

@Component({
  selector: 'app-detalle-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-productos.component.html',
  styleUrl: './detalle-productos.component.css'
})

export class DetalleProductosComponent {
  
  @ViewChild('confirmationModal') confirmationModal: ElementRef | undefined;
  pageSize: number = 5;
  optionPage = [5, 10, 20]
  totalRows: number = 0;
  originalProducts: Product[] = new Array<Product>();
  products: Product[];
  inputSearchValue: string = '';


  constructor(private bancoServices: BancoServices, private validationsUtil: ValidationsUtil) {
    this.loadProducts();
    this.products = this.originalProducts
    this.determineTotalResult();

  }

  searchProduct() {
    this.products = this.originalProducts;
    this.products = this.products.filter(product => product.name.toUpperCase().startsWith(this.inputSearchValue.toUpperCase()));;
    this.determineTotalResult();
  }

  displayList() {
    return this.products.slice(0, this.pageSize);
  }

  onPageChange(page: string) {
    this.pageSize = +page;
    this.displayList();
    this.determineTotalResult()
  }

  determineTotalResult() {
    const totalProducts = this.products.length
    if (this.validationsUtil.checkIfLesserOptionPage(totalProducts, this.optionPage) && totalProducts < this.pageSize)
      this.totalRows = totalProducts
    else this.totalRows = this.pageSize
  }

  loadProducts() {
    this.bancoServices.getProducts().subscribe(products => {
      this.originalProducts =  products
    });
  }

  deleteProduct(product: Product) {
    console.log(product)
  }
}
