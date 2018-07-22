import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageResultsComponent } from './stage-results.component';

describe('StageResultsComponent', () => {
  let component: StageResultsComponent;
  let fixture: ComponentFixture<StageResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
