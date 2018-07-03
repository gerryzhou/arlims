import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesListingComponent } from './samples-listing.component';

describe('SamplesListingComponent', () => {
  let component: SamplesListingComponent;
  let fixture: ComponentFixture<SamplesListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplesListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
