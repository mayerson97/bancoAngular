import { ValidationsUtil } from "../../../src/app/util/ValidationsUtil";

describe('validationsUtil', () => {
  let validationsUtil: ValidationsUtil;

  beforeEach(() => {
    validationsUtil = new ValidationsUtil(); 
  });
  it('debe devolver true por que los datos del option page son mayores', () => {
    const records = 5;
    const optionsPage = [5, 10, 20];
    const result = validationsUtil.checkIfLesserOptionPage(records, optionsPage);
    expect(result).toBe(true);
  });

  it('debe devolver falso por que los datos del option page son menores', () => {
    const records = 25;
    const optionsPage = [5, 10, 20];
    const result = validationsUtil.checkIfLesserOptionPage(records, optionsPage);
    expect(result).toBe(false);
  });

  it('debería devolver verdadero si las fechas tienen una diferencia de un año', () => {
    const fechaUno = new Date('2023-01-01'); 
    const fechaDos = new Date('2022-01-01');
    const resultado = validationsUtil.isOneYearOfDifference(fechaUno, fechaDos);
    expect(resultado).toBe(true);
  });

  it('debería devolver verdadero si las fechas tienen una diferencia de un año en bisiestos fecha uno con 29', () => {
    const fechaDos = new Date('2024-02-29'); 
    const fechaUno = new Date('2025-02-28');
    const resultado = validationsUtil.isOneYearOfDifference(fechaUno, fechaDos);
    expect(resultado).toBe(true);
  });

  it('debería devolver verdadero si las fechas tienen una diferencia de un año en bisiestos fecha dos con 29', () => {
    const fechaDos = new Date('2027-02-28'); 
    const fechaUno = new Date('2028-02-29');
    const resultado = validationsUtil.isOneYearOfDifference(fechaUno, fechaDos);
    expect(resultado).toBe(true);
  });

  it('debería devolver falso si las fechas no tienen una diferencia de un año', () => {
    const fechaUno = new Date('2023-01-01'); 
    const fechaDos = new Date('2022-01-02');
    const resultado = validationsUtil.isOneYearOfDifference(fechaUno, fechaDos);
    expect(resultado).toBe(false);
  });
  

});