import { Component, OnInit } from "@angular/core";
import { SUPPORT_CHAINS } from "src/app/@constant/chains";
import { WalletService } from "src/app/@service/wallet.service";

type SupportChain = (typeof SUPPORT_CHAINS)[0];

@Component({
  selector: "app-connected-network",
  templateUrl: "./connected-network.component.html",
  styleUrls: ["./connected-network.component.scss"],
})
export class ConnectedNetworkComponent implements OnInit {
  isSupportNetwork = true;
  chainName = "";
  chainInfo;

  supportChains = SUPPORT_CHAINS;

  constructor(private _walletService: WalletService) {}

  async ngOnInit() {
    await this.refresh();
    this._walletService.getChainSubject().subscribe(async () => {
      await this.refresh();
    });
  }

  async refresh() {
    this.chainInfo = await this._walletService.getChainInfo();
    if (this.chainInfo) {
      this.chainName = this.chainInfo.chainName;
      this.isSupportNetwork = true;
    } else {
      this.isSupportNetwork = false;
    }
  }

  onMenuClick(event: Event) {
    const target = event.target as HTMLAnchorElement;
    const nextEl = target.nextElementSibling;
    if (nextEl) {
      const parentEl = target.parentNode as Element;
      if (parentEl) {
        parentEl.classList.remove("show");
      }
      nextEl.classList.toggle("show");
    }
    return false;
  }

  async switchChain(chain: SupportChain) {
    await this._walletService.switchNetwork(chain);
  }
}
