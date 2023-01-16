import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitProposalLumpsumComponent } from './submit-proposal-lumpsum.component';

describe('SubmitProposalLumpsumComponent', () => {
  let component: SubmitProposalLumpsumComponent;
  let fixture: ComponentFixture<SubmitProposalLumpsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitProposalLumpsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitProposalLumpsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});