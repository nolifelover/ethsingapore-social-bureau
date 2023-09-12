import { ethers } from 'ethers';
import { SOCIAL_BUREAU_ADDRESSES } from './addresses';
import SOCIAL_BUREAU_CORE_ABI from './abi/social-bureau.json';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContractService {
  constructor() {}

  async getPublicProvider() {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.test.taiko.xyz');
    return provider;
  }

  async isInspector(address: string) {
    // TODO dynamic by chain
    const publicProvider = await this.getPublicProvider();
    const chainId = 167005;
    // eslint-disable-next-line
    const contract: any = new ethers.Contract(
      SOCIAL_BUREAU_ADDRESSES[chainId],
      [
        "function isInspector(address userAddress) public view returns (bool _staked)"
      ],
      publicProvider
    );
    return contract.isInspector(address);
  }
}
