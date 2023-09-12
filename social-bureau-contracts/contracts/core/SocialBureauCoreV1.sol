// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../tokens/JUTC.sol";

contract SocialBureauCoreV1 is ReentrancyGuard, AccessControl {

    address public tokenAddress;
    uint256 public amountToStake = 50 ether;
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    mapping(address => uint256) public userStakedAmount;

    event Fauceted(address user, uint256 amount);
    event Staked(address user);
    event Zapped(address user);
    event Unstaked(address user);
    event Slashed(address user, address byUser);

    constructor(address _tokenAddress){
        tokenAddress = _tokenAddress;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    function faucet() public nonReentrant {
        JUTC(tokenAddress).mint(msg.sender, amountToStake);
        emit Fauceted(msg.sender, amountToStake);
    }

    function stake() public nonReentrant {
        require(JUTC(tokenAddress).balanceOf(msg.sender) >= amountToStake, "not enough token to stake");
        require(userStakedAmount[msg.sender] == 0, "you have already staked");

        JUTC(tokenAddress).transferFrom(msg.sender, address(this), amountToStake);
        userStakedAmount[msg.sender] += amountToStake;
        emit Staked(msg.sender);
    }

    /// @dev : faucet and stake in one transaction
    function zap() public nonReentrant {
        JUTC(tokenAddress).mint(address(this), amountToStake);
        userStakedAmount[msg.sender] += amountToStake;
        emit Zapped(msg.sender);
    }

    function unstake() public nonReentrant {
        require(userStakedAmount[msg.sender] >= amountToStake, "you don't have minimum staked");
        JUTC(tokenAddress).transfer(msg.sender, amountToStake);
        userStakedAmount[msg.sender] -= amountToStake;
        emit Unstaked(msg.sender);
    }

    function isStaked(address userAddress) public view returns (bool _staked){
        _staked = userStakedAmount[userAddress] >= amountToStake;
    }

    function isInspector(address userAddress) public view returns (bool _staked){
        _staked = isStaked(userAddress);
    }

    /// @dev this function is for manager to take/forfeit user staked token
    function slash(address userAddress) public onlyRole(MANAGER_ROLE) {
        userStakedAmount[userAddress] = 0;
        emit Slashed(userAddress, msg.sender);
    }


}
