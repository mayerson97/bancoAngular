import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../../models/Product";
import { Observable, of } from 'rxjs';

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

  createProduc(product: Product): Observable<Product[]> {
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });
    return this.http.post<Product[]>(`${this.URL}`, product, { headers });
    */
    return this.http.get<Product[]>(this.URLMOCK + 'productsMocks.json');
  }

  editProduc(product: Product): Observable<Product[]> {
    /*const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });
    return this.http.put<Product[]>(`${this.URL}`, product, { headers });
    */
    return this.http.get<Product[]>(this.URLMOCK + 'productsMocks.json');
  }

  deleteProduct(id: string): Observable<string> {
    /*
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'authorId': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' 
    });

    return this.http.delete<string>(`${this.URL}?id=${id}`, { headers });
    */

    return of('exitoso')
  }
}