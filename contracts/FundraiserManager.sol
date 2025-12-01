// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract FundraiserManager {

    struct Fundraiser {
        string name;
        string description;
        uint256 goal;
        uint256 totalCollected;
        address payable owner;
        bool active;
    }

    Fundraiser[] public fundraisers;

    event FundraiserCreated(
        uint256 indexed id,
        string name,
        string description,
        uint256 goal,
        address owner
    );

    event Donated(uint256 indexed id, uint256 amount, address donor);
    event Withdrawn(uint256 indexed id, address owner);

    function createFundraiser(
        string memory _name,
        string memory _description,
        uint256 _goal
    ) external {
        require(_goal > 0, "Goal must be > 0");

        fundraisers.push(
            Fundraiser({
                name: _name,
                description: _description,
                goal: _goal,
                totalCollected: 0,
                owner: payable(msg.sender),
                active: true
            })
        );

        emit FundraiserCreated(fundraisers.length - 1, _name, _description, _goal, msg.sender);
    }

    function donate(uint256 _id) external payable {
        require(_id < fundraisers.length, "Invalid ID");
        Fundraiser storage f = fundraisers[_id];
        require(f.active, "Fundraiser inactive");
        require(msg.value > 0, "Amount > 0");

        f.totalCollected += msg.value;

        emit Donated(_id, msg.value, msg.sender);
    }

    function withdraw(uint256 _id) external {
        require(_id < fundraisers.length, "Invalid ID");
        Fundraiser storage f = fundraisers[_id];

        require(msg.sender == f.owner, "Not owner");
        require(f.totalCollected >= f.goal, "Goal not reached");
        require(f.active, "Already withdrawn");

        uint256 amount = f.totalCollected;
        f.active = false;
        f.owner.transfer(amount);

        emit Withdrawn(_id, msg.sender);
    }

    function getFundraisers() external view returns (Fundraiser[] memory) {
        return fundraisers;
    }
}
