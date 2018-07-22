import { ImportedSalmonellaVidasModule } from './imported-salmonella-vidas.module';

describe('ImportedSalmonellaVidasModule', () => {
  let importedSalmonellaVidasModule: ImportedSalmonellaVidasModule;

  beforeEach(() => {
    importedSalmonellaVidasModule = new ImportedSalmonellaVidasModule();
  });

  it('should create an instance', () => {
    expect(importedSalmonellaVidasModule).toBeTruthy();
  });
});
