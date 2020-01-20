import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxLogoutComponent } from './logout.component';

describe('NgxLogoutComponent', () => {
  let component: NgxLogoutComponent;
  let fixture: ComponentFixture<NgxLogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxLogoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
