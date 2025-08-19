// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketMaster is ERC1155, AccessControl, ReentrancyGuard {
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant SCANNER_ROLE = keccak256("SCANNER_ROLE");

    struct Event {
        uint256 eventId;
        address organizer;
        string name;
        uint256 ticketPrice;
        uint256 totalSupply;
        uint256 ticketsSold;
        bool isActive;
    }

    uint256 private _eventCount;
    mapping(uint256 => Event) public eventInfo;
    mapping(uint256 => mapping(address => uint256)) public redeemedTickets;

    event EventCreated(uint256 indexed eventId, string name, address indexed organizer, uint256 price, uint256 supply);
    event TicketsPurchased(uint256 indexed eventId, address indexed buyer, uint256 quantity);
    event TicketRedeemed(uint256 indexed eventId, address indexed ticketHolder, uint256 quantity);

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORGANIZER_ROLE, msg.sender);
        _grantRole(SCANNER_ROLE, msg.sender);
    }

    function createEvent(
        string memory _name,
        uint256 _ticketPrice,
        uint256 _totalSupply
    ) external onlyRole(ORGANIZER_ROLE) {
        require(_ticketPrice > 0, "Ticket price must be greater than zero");
        require(_totalSupply > 0, "Total supply must be greater than zero");

        _eventCount++;
        uint256 newEventId = _eventCount;

        eventInfo[newEventId] = Event({
            eventId: newEventId,
            organizer: msg.sender,
            name: _name,
            ticketPrice: _ticketPrice,
            totalSupply: _totalSupply,
            ticketsSold: 0,
            isActive: true
        });

        emit EventCreated(newEventId, _name, msg.sender, _ticketPrice, _totalSupply);
    }

    function buyTickets(uint256 _eventId, uint256 _quantity) external payable {
        Event storage currentEvent = eventInfo[_eventId];
        
        require(currentEvent.eventId != 0, "Event does not exist");
        require(currentEvent.isActive, "Event sales are not active");
        require(currentEvent.totalSupply >= currentEvent.ticketsSold + _quantity, "Not enough tickets left");
        require(msg.value == currentEvent.ticketPrice * _quantity, "Incorrect amount of MATIC sent");

        currentEvent.ticketsSold += _quantity;
        
        _mint(msg.sender, _eventId, _quantity, "");

        emit TicketsPurchased(_eventId, msg.sender, _quantity);
    }

    function redeemTicket(uint256 _eventId, address _ticketHolder) external onlyRole(SCANNER_ROLE) {
        uint256 ticketsOwned = balanceOf(_ticketHolder, _eventId);
        
        require(ticketsOwned > 0, "Holder does not own any tickets for this event");
        require(ticketsOwned > redeemedTickets[_eventId][_ticketHolder], "All tickets for this holder have been redeemed");
        
        redeemedTickets[_eventId][_ticketHolder]++;
        
        emit TicketRedeemed(_eventId, _ticketHolder, 1);
    }

    function withdrawFunds() external nonReentrant onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    function grantRoleTo(bytes32 _role, address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(_role, _account);
    }

    function uri(uint256) public view override returns (string memory) {
        return "";
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}