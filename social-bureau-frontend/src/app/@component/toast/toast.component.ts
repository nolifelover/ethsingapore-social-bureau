import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { toastAnimation } from "src/app/@constant/toast-animation";
import { ToastModel } from "src/app/@model/toast";
import { ToastService } from "src/app/@service/toast.service";

@Component({
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"],
  animations: [toastAnimation],
})
export class ToastComponent implements OnDestroy {
  dismissEnabled = false;
  public toastModel: ToastModel;

  private $subscriptions: Subscription;

  constructor(private toastService: ToastService) {
    this.$subscriptions = this.toastService.$toastState.subscribe(
      (toastModel: ToastModel) => {
        this.toastModel = toastModel;
      }
    );
  }

  public close() {
    this.toastModel.visible = false;
  }

  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }
}
