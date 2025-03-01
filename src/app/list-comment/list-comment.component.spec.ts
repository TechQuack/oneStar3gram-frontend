import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommentComponent } from './list-comment.component';

describe('ListCommentComponent', () => {
  let component: ListCommentComponent;
  let fixture: ComponentFixture<ListCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
