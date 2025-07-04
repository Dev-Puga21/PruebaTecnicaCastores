import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';  // Asegúrate que este servicio esté creado
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  username: string | null = null;

  showNav = false;
  showProfileMenu = false;

  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
      this.username = state.decodedToken?.Username || null;
    });
  }

  toggleNav() {
    this.showNav = !this.showNav;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  closeNav() {
    this.showNav = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showProfileMenu = false;
    }
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
