export class Token {
  chainId: number;
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  isWrap: boolean;
  balance: number;

  constructor(
    _chainId: number,
    _address: string,
    _decimals: number,
    _symbol: string,
    _name: string,
    _isWrap = false
  ) {
    this.chainId = _chainId;
    this.address = _address;
    this.decimals = _decimals;
    this.symbol = _symbol;
    this.name = _name;
    this.isWrap = _isWrap;
  }
}
