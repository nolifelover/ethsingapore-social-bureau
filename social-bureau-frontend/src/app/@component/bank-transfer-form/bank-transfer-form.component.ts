import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { thaiBanks } from "src/app/@constant/report";
import { FormService } from "src/app/@service/form.service";
import { ChannelBankTransferFormType } from "src/app/@type/report.type";

type FormGroupAction = FormGroup<ChannelBankTransferFormType>;

@Component({
  selector: "app-bank-transfer-form",
  templateUrl: "./bank-transfer-form.component.html",
  styleUrls: ["./bank-transfer-form.component.scss"],
})
export class BankTransferFormComponent implements OnInit {
  @Output() formGroupChange: EventEmitter<FormGroupAction> =
    new EventEmitter<FormGroupAction>();

  readonly thaiBankOptions = thaiBanks;

  form: FormGroupAction = this.fb.nonNullable.group({
    bank: ["", Validators.required],
  });

  constructor(private fb: FormBuilder, public formService: FormService) {}

  ngOnInit() {
    this.formGroupChange.emit(this.form);
  }
}
