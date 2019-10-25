import { TestBed } from '@angular/core/testing';

import { JiraDataService } from './jira-data.service';

describe('JiraDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JiraDataService = TestBed.get(JiraDataService);
    expect(service).toBeTruthy();
  });
});
