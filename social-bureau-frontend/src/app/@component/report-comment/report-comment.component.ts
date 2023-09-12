import { Component, Input } from "@angular/core";
import { defaultAvatar } from "src/app/@constant/user";
import { ReportComment } from "src/app/@type/comment.type";
import { fromNow } from "src/app/@utility/fromNow";

@Component({
  selector: "app-report-comment",
  templateUrl: "./report-comment.component.html",
  styleUrls: ["./report-comment.component.scss"],
})
export class ReportCommentComponent {
  @Input() comment: ReportComment;
  fromNow = fromNow;
  defaultAvatar = defaultAvatar;
}
