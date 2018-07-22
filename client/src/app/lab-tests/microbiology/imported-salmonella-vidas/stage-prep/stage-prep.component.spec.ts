import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagePrepComponent } from './stage-prep.component';

describe('StagePrepComponent', () => {
  let component: StagePrepComponent;
  let fixture: ComponentFixture<StagePrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagePrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagePrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
