// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../contracts/FundraiserManager.sol";

contract FundraiserManagerTest is Test {
    FundraiserManager manager;
    address owner = address(0x123);

    function setUp() public {
        manager = new FundraiserManager();
        vm.deal(owner, 10 ether);
    }

    function testCreateFundraiser() public {
        vm.prank(owner);
        manager.createFundraiser("Test", "Desc", 1 ether);

        (string memory name, , uint256 goal, , address ownerAddr, bool active) =
            manager.fundraisers(0);

        assertEq(name, "Test");
        assertEq(goal, 1 ether);
        assertEq(ownerAddr, owner);
        assertEq(active, true);
    }

    function testDonate() public {
        vm.prank(owner);
        manager.createFundraiser("Test", "Desc", 1 ether);

        vm.deal(address(this), 2 ether);
        manager.donate{value: 1 ether}(0);

        (, , , uint256 total, , ) = manager.fundraisers(0);
        assertEq(total, 1 ether);
    }

    function testWithdraw() public {
        vm.prank(owner);
        manager.createFundraiser("Test", "Desc", 1 ether);

        vm.deal(address(this), 2 ether);
        manager.donate{value: 1 ether}(0);

        vm.prank(owner);
        manager.withdraw(0);

        (, , , uint256 total, , bool active) = manager.fundraisers(0);

        assertEq(total, 1 ether);
        assertEq(active, false);
    }
}
