import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})

/**
 * Footer Component
 */
export class FooterComponent {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * SidebarHide modal
   * @param content modal content
   */
  sidebarShow() {
    document.getElementById("demo-switcher")?.classList.add("show");
    document.querySelector(".vertical-overlay")?.classList.add("show");
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.getElementById("demo-switcher")?.classList.remove("show");
    document.querySelector(".vertical-overlay")?.classList.remove("show");
  }
}
