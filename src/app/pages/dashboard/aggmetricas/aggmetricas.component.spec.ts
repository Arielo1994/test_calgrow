import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggmetricasComponent } from './aggmetricas.component';

describe('AggmetricasComponent', () => {
  let component: AggmetricasComponent;
  let fixture: ComponentFixture<AggmetricasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggmetricasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggmetricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
