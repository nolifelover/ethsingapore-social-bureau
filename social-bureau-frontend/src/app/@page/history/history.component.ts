import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { ApiService } from "src/app/@service/api.service";
import { ToastService } from "src/app/@service/toast.service";
import {
  HistoryPayloadWithPageInfo,
  HistoryResult,
} from "src/app/@type/history.type";
import { errorFormat } from "src/app/@utility/error-format";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
})
export class HistoryComponent implements OnInit {
  fetching = true;
  error = false;
  loadingMore = false;
  page = 1;
  history: HistoryPayloadWithPageInfo | null = null;
  historyResults: HistoryResult[] | null = null;
  moment = moment;

  constructor(
    private toastService: ToastService,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    this.fetching = true;
    this.history = await this.getUserHistory();
    this.historyResults = this.history.results;
    this.fetching = false;
  }

  async loadMoreHistory() {
    this.loadingMore = true;
    this.page = this.page + 1;
    this.history = await this.getUserHistory();
    const prev = [...this.historyResults];
    this.historyResults = prev.concat(this.history.results);
    this.loadingMore = false;
  }

  async getUserHistory() {
    try {
      return await this.apiService.getUserHistory(`?page=${this.page}`);
    } catch (error) {
      this.error = true;
      this.toastService.show("An error occurred.", errorFormat(error).message);
      return null;
    }
  }

  get showLoadMoreButton() {
    if (!this.history && !this.historyResults) {
      return false;
    }
    return this.history.totalResults > this.historyResults.length;
  }
}
