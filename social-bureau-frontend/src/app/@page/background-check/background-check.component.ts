import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { categories } from "src/app/@constant/check";
import { ApiService } from "src/app/@service/api.service";
import { FormService } from "src/app/@service/form.service";
import { Logger } from "src/app/@service/logger.service";
import { ToastService } from "src/app/@service/toast.service";
import { CheckFormType } from "src/app/@type/check.type";
import { ReportPayloadWithPageInfo } from "src/app/@type/report.type";
import { errorFormat } from "src/app/@utility/error-format";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/@service/auth.service";
import { ConnectWalletModalComponent } from "src/app/@component/connect-wallet-modal/connect-wallet-modal.component";

const log = new Logger("BackgroundCheckComponent");

type CategoryType = (typeof categories)[0];

@Component({
  selector: "app-background-check",
  templateUrl: "./background-check.component.html",
  styleUrls: ["./background-check.component.scss"],
})
export class BackgroundCheckComponent {
  readonly categoryOptions = categories;
  submitting = false;
  selectedCategory = this.categoryOptions[1];

  fetching = false;
  error = false;
  crimeReport: ReportPayloadWithPageInfo | null = null;

  form: FormGroup<CheckFormType> = this.fb.nonNullable.group({
    category: [this.categoryOptions[1].key, Validators.required],
    keyword: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private toastService: ToastService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router
  ) {}

  onSelectCategory(category: CategoryType) {
    this.selectedCategory = category;
    this.form.patchValue({ category: category.key });
  }

  handleSubmit() {
    try {
      if (!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }

      this.submitting = true;

      const value = {
        category: this.form.value.category,
        keyword: this.form.value.keyword.trim(),
      };

      const param = `?${value.category}=${value.keyword}`;
      this.fetchCrimeReport(param);
    } catch (error) {
      log.error(error);
    } finally {
      this.submitting = false;
    }
  }

  async fetchCrimeReport(param: string) {
    try {
      this.fetching = true;
      this.crimeReport = await this.apiService.getCrimeReports(param);
    } catch (error) {
      this.error = true;
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.fetching = false;
    }
  }

  get userId() {
    const uid = !!this.authService.user ? this.authService.user.uid : "";
    return uid;
  }

  createNewReport() {
    if (!this.userId) {
      const modalRef = this.modalService.open(ConnectWalletModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.message =
        "You can create report with a Social Bureau account.";
      return;
    }
    this.router.navigate(["/report-crime"]);
  }
}
