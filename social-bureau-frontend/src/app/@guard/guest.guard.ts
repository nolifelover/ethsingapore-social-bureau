import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../@service/auth.service";
import { isEmpty } from "lodash";
import { ApiService } from "../@service/api.service";
import { RegisterNoticeModalComponent } from "../@component/register-notice-modal/register-notice-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: "root",
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private modalService: NgbModal
  ) { }

  async canActivate() {
    const tokens = this.authService.getTokens();
    if (!!tokens && isEmpty(this.authService.user)) {
      const userInfo = await this.apiService.getUserInfo();
      this.authService.user = userInfo;
    }

    if (!!tokens && !this.authService.user.interestingScamType?.length) {
      this.modalService.open(RegisterNoticeModalComponent, {
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
    }

    return true;
  }
}
