import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthService } from "../@service/auth.service";
import { isEmpty } from "lodash";
import { ApiService } from "../@service/api.service";
import { WalletService } from "../@service/wallet.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { RegisterNoticeModalComponent } from "../@component/register-notice-modal/register-notice-modal.component";

@Injectable({
  providedIn: "root",
})
export class JwtGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private walletService: WalletService,
    private modalService: NgbModal
  ) { }

  async canActivate() {
    const tokens = this.authService.getTokens();
    if (isEmpty(tokens)) {
      this.walletService.disconnectWallet();
      return false;
    }

    if (isEmpty(this.authService.user)) {
      const userInfo = await this.apiService.getUserInfo();
      this.authService.user = userInfo;
    }

    if (!this.authService.user.interestingScamType?.length) {
      this.modalService.open(RegisterNoticeModalComponent, {
        centered: true,
        backdrop: "static",
        keyboard: false,
      });
    }

    return true;
  }
}
