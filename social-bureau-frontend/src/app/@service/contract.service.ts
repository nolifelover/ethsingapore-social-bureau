import { Injectable } from "@angular/core";
import { WalletService } from "./wallet.service";
import { ethers } from "ethers";
import { SOCIAL_BUREAU_ADDRESSES } from "../@constant/addresses";
import SOCIAL_BUREAU_CORE_ABI from "../@abi/core/social-bureau.json";

@Injectable({
  providedIn: "root",
})
export class ContractService {
  constructor(private walletService: WalletService) {}

  async getPublicProvider() {
    return await this.walletService.getPublicProvider();
  }

  async getProvider() {
    return await this.walletService.getProvider();
  }

  async isInspector(address: string) {
    const publicProvider = await this.getPublicProvider();
    const chainId = await this.walletService.getChainId();
    // eslint-disable-next-line
    const contract: any = new ethers.Contract(
      SOCIAL_BUREAU_ADDRESSES[chainId],
      SOCIAL_BUREAU_CORE_ABI,
      publicProvider
    );
    return contract.isInspector(address);
  }

  async zap() {
    const provider = await this.getProvider();
    const chainId = await this.walletService.getChainId();
    // eslint-disable-next-line
    const contract: any = new ethers.Contract(
      SOCIAL_BUREAU_ADDRESSES[chainId],
      SOCIAL_BUREAU_CORE_ABI,
      provider.getSigner()
    );
    return contract.zap();
  }

  async unstake() {
    const provider = await this.getProvider();
    const chainId = await this.walletService.getChainId();
    // eslint-disable-next-line
    const contract: any = new ethers.Contract(
      SOCIAL_BUREAU_ADDRESSES[chainId],
      SOCIAL_BUREAU_CORE_ABI,
      provider.getSigner()
    );
    return contract.unstake();
  }
}
