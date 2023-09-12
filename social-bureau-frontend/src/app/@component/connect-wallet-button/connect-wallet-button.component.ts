import { AuthService } from "src/app/@service/auth.service";
import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Logger } from "ethers/lib/utils";
import { WalletService } from "src/app/@service/wallet.service";
import { sleep } from "src/app/@utility/sleep";
import { defaultAvatar } from "src/app/@constant/user";
import { ApiService } from "src/app/@service/api.service";

const log = new Logger("ConnectWalletButtonComponent");

@Component({
  selector: "app-connect-wallet-button",
  templateUrl: "./connect-wallet-button.component.html",
  styleUrls: ["./connect-wallet-button.component.scss"],
})
export class ConnectWalletButtonComponent implements OnInit {
  account = "";
  loading = true;
  defaultAvatar = defaultAvatar;
  userPoints = 0

  constructor(
    private modalService: NgbModal,
    private walletService: WalletService,
    public authService: AuthService,
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    this.account = await this.walletService.getAccount();
    this.walletService.getAccountSubject().subscribe(async (account) => {
      log.debug("Account subscription triggered");
      this.account = account;
      this.loading = false;
    });
    let reportPoint: any | undefined = await this.apiService.getSumUserReportPoint();
    if (reportPoint) {
      this.userPoints = reportPoint.reduce((prev, curr) => prev += curr.point, 0);
    }
    await sleep(500);
    this.loading = false;
  }

  async connectWallet() {
    log.debug("Connecting the wallet");
    await this.walletService.connectWallet();
  }

  async disconnect(confirmModal: TemplateRef<Element>) {
    this.modalService
      .open(confirmModal, { animation: true })
      .result.then(async (result) => {
        if (result == "disconnect") {
          log.debug("Disconnecting the wallet");
          await this.walletService.disconnectWallet();
        }
      });
  }

  get userId() {
    const uid = !!this.authService.user ? this.authService.user.uid : "";
    return uid;
  }
}
