import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../../models/Product";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BancoServices {
  private readonly URLMOCK = 'assets/mocks/';
  private readonly URL = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';



  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.URLMOCK + 'productsMocks.json');
  }

  verifyExistenceId(id: string): Observable<boolean> {
    const url = `${this.URL}/verification?id=${id}`;
    return this.http.get<boolean>(url);
  }

  createProduct(product: Product): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });
    
    return this.http.post<Product[]>(`${this.URLMOCK}productsMocks.json`, product, { headers });
  }

  editProduct(product: Product): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });
    
    return this.http.put<Product[]>(`${this.URLMOCK}productsMocks.json`, product, { headers });
  }

  deleteProduct(id: string): Observable<string> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });

    return this.http.delete<string>(`${this.URLMOCK}productsMocks.json`, { headers });
  }
}