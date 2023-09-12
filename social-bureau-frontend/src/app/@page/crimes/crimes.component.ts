import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/@service/api.service";
import { AuthService } from "src/app/@service/auth.service";
import { ToastService } from "src/app/@service/toast.service";
import { User } from "src/app/@type/auth.type";
import {
  ReportPayloadWithPageInfo,
  ReportResult,
} from "src/app/@type/report.type";
import { errorFormat } from "src/app/@utility/error-format";
import { sleep } from "src/app/@utility/sleep";

@Component({
  selector: "app-crimes",
  templateUrl: "./crimes.component.html",
  styleUrls: ["./crimes.component.scss"],
})
export class CrimesComponent implements OnInit {
  fetching = true;
  filterLoading = true;
  loadingMore = false;
  error = false;
  crimeReport: ReportPayloadWithPageInfo | null = null;
  reportResults: ReportResult[] | null = null;
  page = 1;
  user: User | null = null;
  filters: string[] = [];

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.fetching = true;
    await this.firstLoadReport();
    await sleep(500);
    this.user = this.authService.user;
    this.fetching = false;
  }

  async firstLoadReport() {
    this.filterLoading = true;
    this.crimeReport = await this.fetchCrimeReport();
    this.reportResults = this.crimeReport.results;
    this.filterLoading = false;
  }

  async loadMoreReport() {
    this.loadingMore = true;
    this.page = this.page + 1;
    this.crimeReport = await this.fetchCrimeReport();
    const prevReport = [...this.reportResults];
    this.reportResults = prevReport.concat(this.crimeReport.results);
    this.loadingMore = false;
  }

  async fetchCrimeReport() {
    try {
      const uid = !!this.authService.user ? this.authService.user.uid : "";
      let params = `?page=${this.page}`;

      if (this.filters.length) {
        params += `&scamType=${this.filters.join(",")}`;
      }
      return await this.apiService.getCrimeReportsByScamType(params, uid);
    } catch (error) {
      this.error = true;
      this.toastService.show("An error occurred.", errorFormat(error).message);
      return null;
    }
  }

  get showLoadMoreButton() {
    if (!this.crimeReport && !this.reportResults) {
      return false;
    }
    return this.crimeReport.totalResults > this.reportResults.length;
  }

  onSelectFilter(filter: string) {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
    } else {
      const index = this.filters.indexOf(filter);
      this.filters.splice(index, 1);
    }
    this.firstLoadReport();
  }

  isActiveFiltere(filter: string) {
    return this.filters.includes(filter);
  }
}
