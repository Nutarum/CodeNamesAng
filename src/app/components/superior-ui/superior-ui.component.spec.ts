import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperiorUIComponent } from './superior-ui.component';

describe('SuperiorUIComponent', () => {
  let component: SuperiorUIComponent;
  let fixture: ComponentFixture<SuperiorUIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperiorUIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperiorUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
