import { Routes } from '@angular/router';
import { DetalleProductosComponent } from './modules/banco/detalle-productos/detalle-productos.component';
import { ProductInformationManagementComponent } from './modules/banco/product-information-management/product-information-management.component';

export const routes: Routes = [
    { path: 'detalle', component: DetalleProductosComponent },
    { path: 'gestionar', component: ProductInformationManagementComponent },
    { path: '**',  component: DetalleProductosComponent },
];
