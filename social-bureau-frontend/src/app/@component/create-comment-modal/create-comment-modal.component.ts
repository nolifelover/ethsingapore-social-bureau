import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/@service/api.service";
import { FormService } from "src/app/@service/form.service";
import { ToastService } from "src/app/@service/toast.service";
import {
  ReportCommentFormType,
  ReportCommentInputType,
} from "src/app/@type/comment.type";
import { errorFormat } from "src/app/@utility/error-format";
import { ConnectWalletModalComponent } from "../connect-wallet-modal/connect-wallet-modal.component";
import { AuthService } from "src/app/@service/auth.service";

@Component({
  selector: "app-create-comment-modal",
  templateUrl: "./create-comment-modal.component.html",
  styleUrls: ["./create-comment-modal.component.scss"],
})
export class CreateCommentModalComponent implements OnInit {
  @ViewChild("evidenceInput") evidenceInputRef: ElementRef;
  @Input() reportId: string;
  @Input() category: string;
  // uploading = true;
  uploading = false;
  submitting = false;
  uid

  commentForm: FormGroup<ReportCommentFormType> = this.fb.nonNullable.group({
    crimeId: ["", Validators.required],
    description: ["", Validators.required],
    evidences: [Array<string>()],
    vote: ["", Validators.required],
  });

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public formService: FormService,
    private toastService: ToastService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.commentForm.patchValue({ crimeId: this.reportId });
  }

  onSelectVote(vote: "UPVOTE" | "DOWNVOTE") {
    this.commentForm.patchValue({ vote });
  }

  async onInputEvidenceImages(event: Event) {
    try {
      this.uploading = true;
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList = element.files;
      const fileListAsArray = Array.from(fileList);
      const paths = await this.apiService.uploadCommentImages(fileListAsArray);
      this.commentForm.patchValue({ evidences: paths });
    } catch (error) {
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.uploading = false;
    }
  }

  onRemoveEvidenceImages(uri: string) {
    const oldImages = [...this.commentForm.value.evidences];
    const newImages = oldImages.filter((img) => img !== uri);
    this.commentForm.patchValue({ evidences: newImages });
    this.apiService.deleteImages(uri);
    if (!!this.evidenceInputRef) {
      this.evidenceInputRef.nativeElement.value = "";
    }
  }
  async handleSubmit() {
    try {
      if (!this.commentForm.valid) {
        this.commentForm.markAllAsTouched();
        return;
      }
      this.submitting = true;
      const { value } = this.commentForm;

      await this.apiService.postCrimeReportComment(
        value as ReportCommentInputType
      );

      await this.updateUserReportPoint(value.evidences);

      this.activeModal.close("submited");
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
    let reportPoint: any | undefined = await this.apiService.getUserReportPoint(this.reportId, this.category);
    if (!reportPoint) {
      if (!this.userId) {
        this.openConnectWalletModal();
        return;
      }
      await this.apiService.createUserReportPoint(this.userId, this.category, this.reportId, this.calculateScore(evidences));
    } else {
      await this.apiService.updateUserReportPoint(reportPoint.id, this.category, this.reportId, this.calculateScore(evidences), 0);
    }
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
