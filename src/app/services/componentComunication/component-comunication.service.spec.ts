import { TestBed, inject } from '@angular/core/testing';

import { ComponentComunicationService } from './component-comunication.service';

describe('ComponentComunicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentComunicationService]
    });
  });

  it('should be created', inject([ComponentComunicationService], (service: ComponentComunicationService) => {
    expect(service).toBeTruthy();
  }));
});
