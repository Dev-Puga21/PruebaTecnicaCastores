import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritesVideosPageComponent } from './favorites-videos-page.component';

describe('FavoritesVideosPageComponent', () => {
  let component: FavoritesVideosPageComponent;
  let fixture: ComponentFixture<FavoritesVideosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesVideosPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoritesVideosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
