import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastmeasurementsComponent } from './lastmeasurements.component';

describe('LastmeasurementsComponent', () => {
  let component: LastmeasurementsComponent;
  let fixture: ComponentFixture<LastmeasurementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastmeasurementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastmeasurementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
