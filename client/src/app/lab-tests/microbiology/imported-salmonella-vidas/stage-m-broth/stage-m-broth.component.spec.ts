import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageMBrothComponent } from './stage-m-broth.component';

describe('StageMBrothComponent', () => {
  let component: StageMBrothComponent;
  let fixture: ComponentFixture<StageMBrothComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageMBrothComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageMBrothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
