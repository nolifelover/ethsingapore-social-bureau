import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-register-notice-modal",
  templateUrl: "./register-notice-modal.component.html",
  styleUrls: ["./register-notice-modal.component.scss"],
})
export class RegisterNoticeModalComponent {
  constructor(private router: Router) {}

  register() {
    this.router.navigate(["/your-profile"]);
  }
}
