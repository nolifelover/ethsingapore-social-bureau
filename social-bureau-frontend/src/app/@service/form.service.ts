import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class FormService {
  getControl(form: FormGroup, controlName: string) {
    return form.controls[controlName];
  }

  isControlInvalid(form: FormGroup, controlName: string): boolean {
    const control = this.getControl(form, controlName);
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(
    form: FormGroup,
    controlName: string,
    validation: string
  ): boolean {
    return (
      this.isControlInvalid(form, controlName) &&
      this.getControl(form, controlName)?.errors?.[validation]
    );
  }

  controlHasRequiredError(form: FormGroup, controlName: string) {
    return (
      this.isControlInvalid(form, controlName) &&
      this.getControl(form, controlName)?.errors?.["required"]
    );
  }

  addPhoneNumberMask(tel: string) {
    if (!tel) return "";
    if (tel.length !== 10) return "";
    const pattern = "### ### ####";
    let i = 0;
    const v = tel.toString();
    return pattern.replace(/#/g, () => v[i++]);
  }

  removePhoneNumberMask(tel: string) {
    if (!tel) return "";
    if (tel.length !== 12) return tel;
    return tel.split(" ").join("");
  }
}
