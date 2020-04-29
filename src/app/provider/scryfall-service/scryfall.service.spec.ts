import { TestBed } from '@angular/core/testing';

import { ScryfallService } from './scryfall.service';

describe('ScryfallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScryfallService = TestBed.get(ScryfallService);
    expect(service).toBeTruthy();
  });
});
