// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

interface IMockSwap {
    function swapUSDCForPolygon(uint256 usdcAmount) external;

    function swapPolygonForUSDC(uint256 polygonAmount) external payable;
}

contract GamePoolMaster is ERC20Burnable, Ownable2Step {
    IERC20 public USDC;
    address public botAddress;
    IMockSwap public swapContract;
    uint256 public lastRebalancePercent;

    constructor(
        address _usdc,
        address _swapContract
    ) ERC20("GamePoolTokens", "GPM") Ownable(msg.sender) {
        USDC = IERC20(_usdc);
        swapContract = IMockSwap(_swapContract);
        lastRebalancePercent = 0;
    }

    function mint(uint _amount) external payable {
        (uint256 usdcBalance, uint256 ethBalance) = getCurrentPoolBalance();
        if (usdcBalance > 0 && totalSupply() > 0) {
            uint256 usdcAmount = (_amount * usdcBalance) / totalSupply();
            require(
                USDC.transferFrom(msg.sender, address(this), usdcAmount),
                "USDC transfer failed"
            );
        }
        if (ethBalance > 0 && totalSupply() > 0) {
            uint256 ethAmount = (_amount * ethBalance) / totalSupply();
            require(msg.value >= ethAmount, "ETH transfer failed");
        }
        if (totalSupply() == 0) {
            require(msg.value >= 0, "ETH transfer failed");
            require(
                USDC.transferFrom(msg.sender, address(this), _amount / 1e12),
                "USDC transfer failed"
            );
        }
        _mint(msg.sender, _amount);
    }

    function withdraw(uint _amount) external {
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");
        (uint256 usdcBalance, uint256 ethBalance) = getCurrentPoolBalance();
        uint256 usdcAmount = (_amount * usdcBalance) / totalSupply();
        uint256 ethAmount = (_amount * ethBalance) / totalSupply();
        _burn(msg.sender, _amount);
        if (usdcAmount > 0) {
            require(
                USDC.transfer(msg.sender, usdcAmount),
                "USDC transfer failed"
            );
        }
        if (ethAmount > 0) {
            payable(msg.sender).transfer(ethAmount);
        }
    }

    function rebalance(uint256 percent) external {
        require(msg.sender == botAddress, "Unauthorized");
        require(percent <= 100, "Invalid percentage");

        // Check if the last rebalance percent is the same as the current one
        if (percent == lastRebalancePercent) {
            return;
        }

        // Calculate the total value of the pool in USDC
        uint256 totalUSDC = USDC.balanceOf(address(this));
        uint256 totalPolygon = address(this).balance;
        uint256 totalValue = totalUSDC + (totalPolygon / 2);

        // Calculate the target USDC and Polygon amounts based on the percentage
        uint256 targetUSDC = (totalValue * percent) / 100;
        uint256 targetPolygon = (totalValue - targetUSDC) * 2;

        // Rebalance holdings
        if (totalUSDC > targetUSDC) {
            uint256 excessUSDC = totalUSDC - targetUSDC;
            USDC.approve(address(swapContract), excessUSDC);
            swapContract.swapUSDCForPolygon(excessUSDC);
        } else if (totalPolygon > targetPolygon) {
            uint256 excessPolygon = totalPolygon - targetPolygon;

            swapContract.swapPolygonForUSDC{value: excessPolygon}(
                excessPolygon
            );
        }

        // Update the last rebalance percent
        lastRebalancePercent = percent;
    }

    function getCurrentPoolBalance() public view returns (uint256, uint256) {
        return (USDC.balanceOf(address(this)), balanceOf(address(this)));
    }

    receive() external payable {}

    function setBotAddress(address _botAddress) external onlyOwner {
        botAddress = _botAddress;
    }

    function setUSDC(address _usdc) external onlyOwner {
        USDC = IERC20(_usdc);
    }
}
