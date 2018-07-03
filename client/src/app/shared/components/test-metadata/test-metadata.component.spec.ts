import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMetadataComponent } from './test-metadata.component';

describe('TestMetadataComponent', () => {
  let component: TestMetadataComponent;
  let fixture: ComponentFixture<TestMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
