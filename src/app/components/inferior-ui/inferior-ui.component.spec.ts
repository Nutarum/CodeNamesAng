import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InferiorUIComponent } from './inferior-ui.component';

describe('InferiorUIComponent', () => {
  let component: InferiorUIComponent;
  let fixture: ComponentFixture<InferiorUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InferiorUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InferiorUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
