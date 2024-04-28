import { Product } from '../../../src/app/models/Product';
import { DataSharedService } from "../../../src/app/services/banco/DataSharedService";

describe('dataSharedService', () => {

    let dataSharedService: DataSharedService;

    beforeEach(() => {
        dataSharedService = new DataSharedService();
    });
    it('debe devolver el producto mock', () => {
        const productMock = Product.crear('123', '12345', '1234512345',
            'Logo', new Date(), new Date())
        dataSharedService.setProduct(productMock);
        const product = dataSharedService.getProduct()
        expect(product).toEqual(productMock);
    });


});

