import { Component, Input } from "@angular/core";
import { defaultAvatar } from "src/app/@constant/user";
import { ReportResult } from "src/app/@type/report.type";
import { fromNow } from "src/app/@utility/fromNow";

@Component({
  selector: "app-report-card",
  templateUrl: "./report-card.component.html",
  styleUrls: ["./report-card.component.scss"],
})
export class ReportCardComponent {
  @Input() report: ReportResult | undefined;
  fromNow = fromNow;
  defaultAvatar = defaultAvatar;

  get upOrDownVote() {
    if (this.report.upvoter && !this.report.downvoter) {
      return "UP";
    } else if (!this.report.upvoter && this.report.downvoter) {
      return "DOWN";
    } else {
      return "";
    }
  }
}
