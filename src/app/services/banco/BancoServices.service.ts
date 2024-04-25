import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../../models/Product";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class BancoServices {
    private readonly URL = 'assets/mocks/';
  
    constructor(private http: HttpClient) {}
  
    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.URL + 'productsMocks.json');
    }
  }