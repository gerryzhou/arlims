import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageVidasComponent } from './stage-vidas.component';

describe('StageVidasComponent', () => {
  let component: StageVidasComponent;
  let fixture: ComponentFixture<StageVidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageVidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageVidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
