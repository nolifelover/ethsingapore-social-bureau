import { Router } from "@angular/router";
import { ApiService } from "./../../@service/api.service";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createMask } from "@ngneat/input-mask";
import {
  categories,
  currency,
  paymentChannels,
  scamTypes,
} from "src/app/@constant/report";
import { FormService } from "src/app/@service/form.service";
import { ToastService } from "src/app/@service/toast.service";
import {
  CategoryType,
  ChannelCreditCardInputType,
  ChannelElectronicPaymentInputType,
  ReportFormType,
  ReportInputType,
} from "src/app/@type/report.type";
import { errorFormat } from "src/app/@utility/error-format";
import { AuthService } from "src/app/@service/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConnectWalletModalComponent } from "src/app/@component/connect-wallet-modal/connect-wallet-modal.component";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-report",
  templateUrl: "./report-crime.component.html",
  styleUrls: ["./report-crime.component.scss"],
})
export class ReportCrimeComponent {
  @ViewChild("evidenceInput") evidenceInputRef: ElementRef;
  mobilePhoneMask = createMask("099 999 9999");
  cIdPhoneMask = createMask("9 9999 99999 99 9");
  submitting = false;
  uploading = false;
  reportId = "";

  readonly scamTypeOptions = scamTypes;
  readonly categoryOptions = categories;
  subcategoryOptions: string[] | undefined;
  readonly paymentChannelOption = paymentChannels;
  readonly currencyOptions = currency;

  reportForm: FormGroup<ReportFormType> = this.fb.nonNullable.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
    name: ["", Validators.required],
    mobilePhone: ["", Validators.required],
    cId: ["", Validators.required],
    scamType: ["", Validators.required],
    category: ["", Validators.required],
    subcategory: ["", Validators.required],
    foundOn: ["", Validators.required],
    evidences: [Array<string>()],
    transcationDate: ["", Validators.required],
    paymentChannel: ["", Validators.required],
    amountOfMoney: ["", Validators.required],
    currency: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private toastService: ToastService,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) { }

  onSelectScamType(scamType: string) {
    this.reportForm.patchValue({ scamType });
  }

  onSelectCategory(category: CategoryType) {
    this.reportForm.patchValue({ category: category.title, subcategory: "" });
    this.subcategoryOptions = category.subcategories;
  }

  onSelectSubcategory(subcategory: string) {
    this.reportForm.patchValue({ subcategory: subcategory });
  }

  async onInputEvidenceImages(event: Event) {
    try {
      this.uploading = true;
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList = element.files;
      const fileListAsArray = Array.from(fileList);
      const paths = await this.apiService.uploadEvidenceImages(fileListAsArray);
      this.reportForm.patchValue({ evidences: paths });
    } catch (error) {
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.uploading = false;
    }
  }

  onRemoveEvidenceImages(uri: string) {
    const oldImages = [...this.reportForm.value.evidences];
    const newImages = oldImages.filter((img) => img !== uri);
    this.reportForm.patchValue({ evidences: newImages });
    this.apiService.deleteImages(uri);
    if (!!this.evidenceInputRef) {
      this.evidenceInputRef.nativeElement.value = "";
    }
  }

  onSelectPaymentChannel(paymentChannel: string) {
    this.reportForm.patchValue({ paymentChannel });
  }

  onPaymentDetailFormChange(formGroup: FormGroup) {
    this.reportForm.removeControl("paymentDetail");
    this.reportForm.addControl("paymentDetail", formGroup);
  }

  async handleSubmit() {
    try {
      if (!this.reportForm.valid) {
        this.reportForm.markAllAsTouched();
        return;
      }
      this.submitting = true;
      const { value } = this.reportForm;

      if (value.paymentChannel === "Credit Card") {
        const paymentDetail = value.paymentDetail as ChannelCreditCardInputType;
        if (paymentDetail.network === "Others") {
          value.paymentDetail = {
            network: paymentDetail.otherNetwork,
            issuers: paymentDetail.issuers,
            number: paymentDetail.number,
          };
        }
      }

      if (value.paymentChannel === "Electronic Payment") {
        const paymentDetail =
          value.paymentDetail as ChannelElectronicPaymentInputType;
        if (paymentDetail.payment === "Others") {
          value.paymentDetail = {
            payment: paymentDetail.other,
          };
        }
      }

      value.amountOfMoney = value.amountOfMoney.toString();

      await this.apiService.postCrimeReport(value as ReportInputType)
        .then(async () => {
          await this.updateUserReportPoint(value.evidences);
        });

      this.router.navigate(["/crimes"]);
    } catch (error) {
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.submitting = false;
    }
  }

  get userId() {
    const uid = !!this.authService.user ? this.authService.user.uid : "";
    return uid;
  }

  get userRole() {
    const role = !!this.authService.user ? this.authService.user.role : "";
    return role;
  }

  async updateUserReportPoint(evidences: string[] = []) {
    if (!this.userId) {
      this.openConnectWalletModal();
      return;
    }
    let reports = await this.apiService.getCrimeReports();
    let report = reports.results.filter(e => e.createdBy.uid == this.userId)[0]
    const { value } = this.reportForm;
    await this.apiService.createUserReportPoint(this.userId, value.category, report.id, this.calculateScore(evidences));
  }

  openConnectWalletModal() {
    const modalRef = this.modalService.open(ConnectWalletModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      "You can vote on any post with a Social Bureau account.";
  }

  calculateScore(evidences: string[]): number {
    let score = 1;
    for (const evidence of evidences) {
      const fileExtension = this.getFileExtension(evidence);

      if (this.isPictureFile(fileExtension)) {
        score += 10;
      } else if (this.isMusicFile(fileExtension) || this.isDocumentFile(fileExtension)) {
        score += 12;
      } else if (this.isVideoFile(fileExtension)) {
        score += 15;
      }
    }
    return score;
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  isPictureFile(extension: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  }

  isMusicFile(extension: string): boolean {
    return ['mp3', 'wav', 'flac'].includes(extension);
  }

  isDocumentFile(extension: string): boolean {
    return ['pdf', 'doc', 'docx', 'txt'].includes(extension);
  }

  isVideoFile(extension: string): boolean {
    return ['mp4', 'avi', 'mkv'].includes(extension);
  }
}
