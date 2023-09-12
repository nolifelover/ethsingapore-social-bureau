import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-become-inspector-modal",
  templateUrl: "./become-inspector-modal.component.html",
  styleUrls: ["./become-inspector-modal.component.scss"],
})
export class BecomeInspectorModalComponent {
  constructor(private activeModal: NgbActiveModal, private router: Router) {}

  becomeInspector() {
    this.router.navigate(["/stake"]);
    this.activeModal.close();
  }
}
