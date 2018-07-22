import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageControlsComponent } from './stage-controls.component';

describe('StageControlsComponent', () => {
  let component: StageControlsComponent;
  let fixture: ComponentFixture<StageControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
