import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSearchComponent } from './favorite-search.component';

describe('FavoriteSearchComponent', () => {
  let component: FavoriteSearchComponent;
  let fixture: ComponentFixture<FavoriteSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
