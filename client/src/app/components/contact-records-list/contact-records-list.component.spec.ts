import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRecordsListComponent } from './contact-records-list.component';

describe('ContactRecordsListComponent', () => {
  let component: ContactRecordsListComponent;
  let fixture: ComponentFixture<ContactRecordsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactRecordsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactRecordsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
