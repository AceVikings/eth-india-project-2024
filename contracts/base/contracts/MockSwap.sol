// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract MockSwap {
    IERC20 public USDC;

    constructor(address _usdc) {
        USDC = IERC20(_usdc);
    }

    function swapUSDCForPolygon(uint256 usdcAmount) external {
        // Calculate the equivalent amount of Polygon tokens (1 USDC = 2 Polygon)
        uint256 polygonAmount = usdcAmount * 2;

        // Check if the contract has enough Polygon tokens
        require(
            address(this).balance >= polygonAmount,
            "Not enough Polygon tokens in the contract"
        );

        // Transfer USDC tokens from the user to the contract
        require(
            USDC.transferFrom(msg.sender, address(this), usdcAmount),
            "USDC transfer failed"
        );

        // Transfer the equivalent amount of Polygon tokens from the contract to the user
        payable(msg.sender).transfer(polygonAmount);
    }

    function swapPolygonForUSDC(uint256 polygonAmount) external payable {
        // Calculate the equivalent amount of USDC tokens (1 Polygon = 0.5 USDC)
        uint256 usdcAmount = polygonAmount / 2;

        // Check if the contract has enough USDC tokens
        require(
            USDC.balanceOf(address(this)) >= usdcAmount,
            "Not enough USDC tokens in the contract"
        );

        // Transfer Polygon tokens from the user to the contract
        require(msg.value >= polygonAmount, "Polygon transfer failed");

        // Transfer the equivalent amount of USDC tokens from the contract to the user
        require(USDC.transfer(msg.sender, usdcAmount), "USDC transfer failed");
    }
}
