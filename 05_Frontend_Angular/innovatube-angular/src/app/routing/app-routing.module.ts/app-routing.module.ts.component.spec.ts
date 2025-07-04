import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoutingModuleTsComponent } from './app-routing.module.ts.component';

describe('AppRoutingModuleTsComponent', () => {
  let component: AppRoutingModuleTsComponent;
  let fixture: ComponentFixture<AppRoutingModuleTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRoutingModuleTsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppRoutingModuleTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
