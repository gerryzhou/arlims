import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StagePreEnrComponent } from './stage-pre-enr.component';

describe('StagePreEnrComponent', () => {
  let component: StagePreEnrComponent;
  let fixture: ComponentFixture<StagePreEnrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagePreEnrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StagePreEnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
