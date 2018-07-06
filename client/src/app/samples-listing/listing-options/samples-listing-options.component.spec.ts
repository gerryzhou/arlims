import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesListingOptionsComponent } from './samples-listing-options.component';

describe('SamplesListingOptionsComponent', () => {
  let component: SamplesListingOptionsComponent;
  let fixture: ComponentFixture<SamplesListingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplesListingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesListingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
