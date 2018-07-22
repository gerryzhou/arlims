import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageWrapupComponent } from './stage-wrapup.component';

describe('StageWrapupComponent', () => {
  let component: StageWrapupComponent;
  let fixture: ComponentFixture<StageWrapupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageWrapupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageWrapupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
