import { Injectable } from '@angular/core';
import { Product } from '../../models/Product';

@Injectable({
  providedIn: 'root'
})
export class DataSharedService {

  private sharedProduct: Product | undefined;

  constructor() { }

  setProduct(product: Product | undefined) {
    this.sharedProduct = product;
  }

  getProduct(): Product | undefined {
    return this.sharedProduct;
  }
}