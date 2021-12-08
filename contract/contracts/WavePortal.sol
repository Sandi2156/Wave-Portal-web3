pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves = 0;
    uint256 private seed;

    // events in solidity
    event NewWave(
        address indexed from,
        uint256 timestamp,
        string message,
        bool win
    );

    struct Wave {
        address waver;
        string mes;
        uint256 atTime;
    }

    Wave[] waves;

    mapping(address => uint256) public lastVisited;

    constructor() payable {
        console.log("yo yo I am constructor. lauds me");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved and sent %s", msg.sender, _message);

        require(
            lastVisited[msg.sender] + 15 seconds < block.timestamp,
            "wait 15 seconds"
        );

        lastVisited[msg.sender] = block.timestamp;

        waves.push(Wave(msg.sender, _message, block.timestamp));

        seed = (seed + block.difficulty + block.timestamp) % 100;

        console.log("seed value : ", seed);

        if (seed <= 50) {
            uint256 prizeAmount = 0.001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract..");
            emit NewWave((msg.sender), block.timestamp, _message, true);
            return;
        }
        emit NewWave((msg.sender), block.timestamp, _message, false);
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("we have %d total waves", totalWaves);
        return totalWaves;
    }
}
