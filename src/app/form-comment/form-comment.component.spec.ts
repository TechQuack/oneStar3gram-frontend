import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCommentComponent } from './form-comment.component';

describe('FormCommentComponent', () => {
  let component: FormCommentComponent;
  let fixture: ComponentFixture<FormCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
