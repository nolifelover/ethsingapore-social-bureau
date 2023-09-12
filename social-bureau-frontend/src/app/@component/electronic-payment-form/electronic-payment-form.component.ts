import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { electronicPayments } from "src/app/@constant/report";
import { FormService } from "src/app/@service/form.service";
import { ChannelElectronicPaymentInputForm } from "src/app/@type/report.type";

type FormGroupAction = FormGroup<ChannelElectronicPaymentInputForm>;

@Component({
  selector: "app-electronic-payment-form",
  templateUrl: "./electronic-payment-form.component.html",
  styleUrls: ["./electronic-payment-form.component.scss"],
})
export class ElectronicPaymentFormComponent implements OnInit {
  @Output() formGroupChange: EventEmitter<FormGroupAction> =
    new EventEmitter<FormGroupAction>();

  readonly electronicPaymentOptions = electronicPayments;

  form: FormGroupAction = this.fb.nonNullable.group({
    payment: ["", Validators.required],
  });

  constructor(private fb: FormBuilder, public formService: FormService) {}

  ngOnInit() {
    this.formGroupChange.emit(this.form);
  }

  onSelectElectronicPayment(payment: string) {
    if (payment !== "Others") {
      this.form.removeControl("other");
    } else {
      this.form.addControl("other", this.fb.control("", [Validators.required]));
    }

    this.form.patchValue({ payment });
  }
}
