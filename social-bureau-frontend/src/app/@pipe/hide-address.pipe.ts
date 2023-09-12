import { Pipe, PipeTransform } from "@angular/core";
import { ethers } from "ethers";

@Pipe({
  name: "hideAddress",
})
export class HideAddressPipe implements PipeTransform {
  transform(value: string, ...args: number[]): string {
    if (!value) return "";

    if (!ethers.utils.isAddress(value)) return value;
    return this.trimAddress(value, args[0], args[1]);
  }

  trimAddress(address: string, _frontLength?: number, _backLength?: number) {
    let frontLength = _frontLength;
    let backLength = _backLength;
    if (frontLength == undefined) frontLength = 3;
    if (backLength == undefined) backLength = 4;
    return address.replace(
      address.substring(
        frontLength,
        (address ? address.length : 42) - backLength
      ),
      "..."
    );
  }
}
