import { TestBed } from '@angular/core/testing';

import { LoginRoutingGuardService } from './login-routing-guard.service';

describe('LoginRoutingGuardService', () => {
  let service: LoginRoutingGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRoutingGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
