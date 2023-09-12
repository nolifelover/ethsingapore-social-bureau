import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { WalletService } from "src/app/@service/wallet.service";

@Component({
  selector: "app-connect-wallet-modal",
  templateUrl: "./connect-wallet-modal.component.html",
  styleUrls: ["./connect-wallet-modal.component.scss"],
})
export class ConnectWalletModalComponent {
  @Input() message: string;

  constructor(
    private walletService: WalletService,
    private activeModal: NgbActiveModal
  ) {}

  async connectWallet() {
    await this.walletService.connectWallet();
    this.activeModal.close();
  }
}
