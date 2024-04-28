import { of } from 'rxjs';
import { BancoServices } from '../../../src/app/services/banco/BancoServices.service';
import { Product } from '../../../src/app/models/Product';

describe('BancoServices', () => {
  let httpClientSpy: { get: jest.Mock, put: jest.Mock, post: jest.Mock,  delete: jest.Mock  };
  let service: BancoServices;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      put: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    service = new BancoServices(httpClientSpy as any);
  });

  it('debe validar la existencia de un id', () => {
    const id = 'someId';
    const mockResponse = true;

    httpClientSpy.get.mockReturnValue(of(mockResponse));
    service.verifyExistenceId(id).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith('https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification?id=someId');
  });

  it('debe devolver un listado de producto', () => {
    const mockResponse: Product[] = new Array<Product>();

    httpClientSpy.get.mockReturnValue(of(mockResponse));
    service.getProducts().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith('assets/mocks/productsMocks.json');
  });

  it('debe devolver un listado de producto al crear un producto', () => {
    const mockResponse: Product[] = new Array<Product>();
    const product: Product = Product.crear('123', '12345', '1234512345',
      'Logo', new Date(), new Date());
    mockResponse.push(product)
    httpClientSpy.post.mockReturnValue(of(mockResponse));
    service.createProduct(product).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });


  it('debe devolver un listado de producto al edtar un producto', () => {
    const mockResponse: Product[] = new Array<Product>();
    const product: Product = Product.crear('123', '12345', '1234512345',
      'Logo', new Date(), new Date());
    mockResponse.push(product)
    httpClientSpy.put.mockReturnValue(of(mockResponse));
    service.editProduct(product).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });


  it('debe devolver un mensaje de producto removido al remover un producto', () => {
    const mockResponse = 'Product successfully removed'
    httpClientSpy.delete.mockReturnValue(of(mockResponse));
    service.deleteProduct('123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });

});
