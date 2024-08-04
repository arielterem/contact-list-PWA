import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleContactRecordComponent } from './single-contact-record.component';

describe('SingleContactRecordComponent', () => {
  let component: SingleContactRecordComponent;
  let fixture: ComponentFixture<SingleContactRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleContactRecordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleContactRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
