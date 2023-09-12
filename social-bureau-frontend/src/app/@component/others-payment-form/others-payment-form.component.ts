import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { FormService } from "src/app/@service/form.service";
import { ChannelOtherFormType } from "src/app/@type/report.type";

type FormGroupAction = FormGroup<ChannelOtherFormType>;

@Component({
  selector: "app-others-payment-form",
  templateUrl: "./others-payment-form.component.html",
  styleUrls: ["./others-payment-form.component.scss"],
})
export class OthersPaymentFormComponent implements OnInit {
  @Output() formGroupChange: EventEmitter<FormGroupAction> =
    new EventEmitter<FormGroupAction>();

  form: FormGroupAction = this.fb.nonNullable.group({
    channel: ["", Validators.required],
  });

  constructor(private fb: FormBuilder, public formService: FormService) {}

  ngOnInit() {
    this.formGroupChange.emit(this.form);
  }
}
