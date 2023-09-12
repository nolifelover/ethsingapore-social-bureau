export class ToastModel {
  public visible: boolean;

  public title: string;
  public message: string;
  public type: ToastType;

  constructor(visible: boolean) {
    this.visible = visible;
    this.type = ToastType.Success;
  }
}

export enum ToastType {
  Warning = "warning",
  Error = "error",
  Success = "success",
}
