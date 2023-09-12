import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { FormService } from "src/app/@service/form.service";
import { ChannelCryptocurrencyInputForm } from "src/app/@type/report.type";

type FormGroupAction = FormGroup<ChannelCryptocurrencyInputForm>;

@Component({
  selector: "app-cryptocurrency-form",
  templateUrl: "./cryptocurrency-form.component.html",
  styleUrls: ["./cryptocurrency-form.component.scss"],
})
export class CryptocurrencyFormComponent implements OnInit {
  @Output() formGroupChange: EventEmitter<FormGroupAction> =
    new EventEmitter<FormGroupAction>();

  form: FormGroupAction = this.fb.nonNullable.group({
    walletName: ["", Validators.required],
    walletAddress: ["", Validators.required],
  });
  constructor(private fb: FormBuilder, public formService: FormService) {}

  ngOnInit() {
    this.formGroupChange.emit(this.form);
  }
}
