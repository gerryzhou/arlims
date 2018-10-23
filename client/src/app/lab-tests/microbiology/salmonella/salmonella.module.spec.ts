import {SalmonellaModule } from './salmonella.module';

describe('SalmonellaModule', () => {
  let salmonellaModule: SalmonellaModule;

  beforeEach(() => {
    salmonellaModule = new SalmonellaModule();
  });

  it('should create an instance', () => {
    expect(salmonellaModule).toBeTruthy();
  });
});
