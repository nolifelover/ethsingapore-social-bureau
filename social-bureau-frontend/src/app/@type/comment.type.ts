import { FormControl } from "@angular/forms";
import { Time } from "./common.type";
import { User } from "./auth.type";

export type ReportCommentInputType = {
  crimeId: string;
  description: string;
  evidences: string[];
  vote: string;
};

export type ReportCommentFormType = {
  crimeId: FormControl<string>;
  description: FormControl<string>;
  evidences: FormControl<string[]>;
  vote: FormControl<string>;
};

export type ReportComment = {
  crimeId: string;
  createdAt: Time;
  createdBy: User;
  description: string;
  id: string;
  evidences: string[];
  updatedAt: Time;
  vote: VoteType;
};

export enum VoteType {
  "UPVOTE" = "UPVOTE",
  "DOWNVOTE" = "DOWNVOTE",
}
