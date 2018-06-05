import { TestBed, inject } from '@angular/core/testing';

import { ApiUrlsService } from './api-urls.service';

describe('ApiUrlsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiUrlsService]
    });
  });

  it('should be created', inject([ApiUrlsService], (service: ApiUrlsService) => {
    expect(service).toBeTruthy();
  }));
});
