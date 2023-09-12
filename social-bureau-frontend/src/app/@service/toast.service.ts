import { BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
import { ToastModel, ToastType } from "../@model/toast";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  $toastState = new BehaviorSubject<ToastModel>(new ToastModel(false));

  public show(
    title: string,
    message: string,
    seconds = 3,
    type: ToastType = ToastType.Error
  ) {
    if (seconds <= 0) {
      seconds = 5;
    }

    const toast = new ToastModel(true);
    toast.title = title;
    toast.message = message;
    toast.type = type;

    this.$toastState.next(toast);
    setTimeout(
      () => this.$toastState.next(new ToastModel(false)),
      seconds * 1000
    );
  }
}
