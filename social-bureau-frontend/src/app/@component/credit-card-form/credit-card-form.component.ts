import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createMask } from "@ngneat/input-mask";
import { creditCardNetworks, thaiBanks } from "src/app/@constant/report";
import { FormService } from "src/app/@service/form.service";
import { ChannelCreditCardFormType } from "src/app/@type/report.type";

type FormGroupAction = FormGroup<ChannelCreditCardFormType>;

@Component({
  selector: "app-credit-card-form",
  templateUrl: "./credit-card-form.component.html",
  styleUrls: ["./credit-card-form.component.scss"],
})
export class CreditCardFormComponent implements OnInit {
  @Output() formGroupChange: EventEmitter<FormGroupAction> =
    new EventEmitter<FormGroupAction>();

  readonly thaiBankOptions = thaiBanks;
  readonly creditCardNetworkOptions = creditCardNetworks;
  creditCardNoMask = createMask("9999 9999 9999 9999");

  constructor(private fb: FormBuilder, public formService: FormService) {}

  form: FormGroupAction = this.fb.nonNullable.group({
    network: ["", Validators.required],
    issuers: ["", Validators.required],
    number: ["", Validators.required],
  });

  ngOnInit() {
    this.formGroupChange.emit(this.form);
  }

  onSelectCreditCardNetwork(creditCardNetwork: string) {
    if (creditCardNetwork !== "Others") {
      this.form.removeControl("otherNetwork");
    } else {
      this.form.addControl(
        "otherNetwork",
        this.fb.control("", [Validators.required])
      );
    }

    this.form.patchValue({
      network: creditCardNetwork,
      issuers: "",
      number: "",
    });
  }
}
