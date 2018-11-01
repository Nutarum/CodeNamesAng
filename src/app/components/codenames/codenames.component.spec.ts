import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodenamesComponent } from './codenames.component';

describe('CodenamesComponent', () => {
  let component: CodenamesComponent;
  let fixture: ComponentFixture<CodenamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodenamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodenamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
