import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStageStatusComponent } from './test-stage-status.component';

describe('TestStageStatusComponent', () => {
  let component: TestStageStatusComponent;
  let fixture: ComponentFixture<TestStageStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStageStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
