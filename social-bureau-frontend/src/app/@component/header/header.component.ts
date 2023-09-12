import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { MENU } from "../../@constant/menu";
import { MenuItem } from "src/app/@type/menu.type";
import { AuthService } from "src/app/@service/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})

/**
 * Header Component
 */
export class HeaderComponent {
  menuItems: MenuItem[] = MENU;

  constructor(private router: Router, public authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.activateMenu();
      }
    });
  }

  onMenuClick(event: Event) {
    const target = event.target as HTMLAnchorElement;
    const nextEl = target.nextElementSibling;
    if (nextEl) {
      const parentEl = target.parentNode as Element;
      if (parentEl) {
        parentEl.classList.remove("show");
      }
      nextEl.classList.toggle("show");
    }
    return false;
  }

  toggleMobileMenu() {
    if (window.screen.width <= 1024) {
      document.getElementById("navbarNav")?.classList.toggle("show");
    }
  }

  windowScroll() {
    const navbar = document.querySelector(".navbar");
    if (document.documentElement.scrollTop > 40) {
      navbar?.classList.add("navbar-stuck");
      document.querySelector(".btn-scroll-top")?.classList.add("show");
    } else {
      navbar?.classList.remove("navbar-stuck");
      document.querySelector(".btn-scroll-top")?.classList.remove("show");
    }
  }
}
