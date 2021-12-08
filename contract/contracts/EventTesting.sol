pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract EventTesting {
    uint256 oldNumber;

    event JanJan(
        uint256 indexed oldValue,
        uint256 indexed newValue,
        address accesser
    );

    function store() public {
        oldNumber = 90;
        emit JanJan(oldNumber, oldNumber + 5, msg.sender);
    }
}
