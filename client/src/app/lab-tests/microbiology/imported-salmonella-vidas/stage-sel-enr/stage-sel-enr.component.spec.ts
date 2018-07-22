import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageSelEnrComponent } from './stage-sel-enr.component';

describe('StageSelEnrComponent', () => {
  let component: StageSelEnrComponent;
  let fixture: ComponentFixture<StageSelEnrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageSelEnrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageSelEnrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
