import { TestBed } from '@angular/core/testing';

import { ClientSSOService } from './client-sso.service';

describe('ClientSSOService', () => {
  let service: ClientSSOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientSSOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
