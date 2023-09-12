import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/@service/api.service";
import { ToastService } from "src/app/@service/toast.service";
import { errorFormat } from "src/app/@utility/error-format";
import { ActivatedRoute } from "@angular/router";
import { ReportDetail } from "src/app/@type/report.type";
import { fromNow } from "src/app/@utility/fromNow";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CreateCommentModalComponent } from "src/app/@component/create-comment-modal/create-comment-modal.component";
import { AuthService } from "src/app/@service/auth.service";
import { ConnectWalletModalComponent } from "src/app/@component/connect-wallet-modal/connect-wallet-modal.component";
import { BecomeInspectorModalComponent } from "src/app/@component/become-inspector-modal/become-inspector-modal.component";
import { defaultAvatar } from "src/app/@constant/user";

@Component({
  selector: "app-crime-detail",
  templateUrl: "./crime-detail.component.html",
  styleUrls: ["./crime-detail.component.scss"],
})
export class CrimeDetailComponent implements OnInit {
  fetching = true;
  backgroundFetching = true;
  voting = false;
  error = false;
  reportId = "";
  report: ReportDetail | null = null;
  fromNow = fromNow;
  defaultAvatar = defaultAvatar;

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthService
  ) {
    const reportId = this.route.snapshot.paramMap.get("report-id");
    !!reportId && (this.reportId = reportId);
    // this.deleteCrimeReport();
  }

  async ngOnInit() {
    this.fetching = true;
    await this.fetchCrimeReport();
    this.fetching = false;
  }

  async fetchCrimeReport() {
    try {
      this.backgroundFetching = true;
      this.report = await this.apiService.getCrimeReportById(
        this.reportId,
        this.userId
      );
    } catch (error) {
      this.error = true;
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.backgroundFetching = false;
    }
  }

  get disabledVote() {
    return this.voting || this.backgroundFetching;
  }

  get upOrDownVote() {
    if (this.report.upvoter && !this.report.downvoter) {
      return "UP";
    } else if (!this.report.upvoter && this.report.downvoter) {
      return "DOWN";
    } else {
      return "";
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

  async voteCrimeReport(type: "UPVOTE" | "DOWNVOTE") {
    try {
      if (!this.userId) {
        this.openConnectWalletModal();
        return;
      }
      this.voting = true;
      // await this.apiService.voteCrimeReport(this.reportId, type);
      let voteRes: any | null = await this.apiService.voteCrimeReport(this.reportId, type);
      if (voteRes) {
        await this.updateUserReportPoint("update");
      } else {
        await this.updateUserReportPoint("delete");
      }
      await this.fetchCrimeReport();
    } catch (error) {
      this.error = true;
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.voting = false;
    }
  }

  async updateUserReportPoint(type: string = "") {
    let reportPoint: any | undefined = await this.apiService.getUserReportPoint(this.report.id, this.report.category);
    if (type == "update") {
      if (!reportPoint) {
        await this.apiService.createUserReportPoint(this.userId, this.report.category, this.report.id, 1);
      } else if (reportPoint.point == 0) {
        await this.apiService.updateUserReportPoint(reportPoint.id, this.report.category, this.report.id, 1, 0);
      }
    }
    else {
      if (reportPoint) {
        await this.apiService.updateUserReportPoint(reportPoint.id, this.report.category, this.report.id, 0, 0);
      }
    }
  }

  openCreateCommentModal() {
    if (!this.userId) {
      this.openConnectWalletModal();
      return;
    }

    if (this.userRole !== "INSPECTOR") {
      this.openBecomeInspectorModal();
      return;
    }

    const modalRef = this.modalService.open(CreateCommentModalComponent, {
      centered: true,
      size: "md",
    });
    modalRef.componentInstance.reportId = this.reportId;
    modalRef.componentInstance.category = this.report.category;

    modalRef.result.then(async (data) => {
      if (data === "submited") {
        await this.fetchCrimeReport();
      }
    });
  }

  openConnectWalletModal() {
    const modalRef = this.modalService.open(ConnectWalletModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.message =
      "You can vote on any post with a Social Bureau account.";
  }

  openBecomeInspectorModal() {
    this.modalService.open(BecomeInspectorModalComponent, {
      centered: true,
    });
  }

  async deleteCrimeReport() {
    await this.apiService.deleteCrimeReport(this.reportId);
  }
}
