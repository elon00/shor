// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PQCNFT
 * @notice Post-Quantum Cellular Automaton ERC-721 NFT
 * Represents evolved Conway AI Automaton Cells with on-chain lattice signatures and quantum resilience metrics.
 */
contract PQCNFT {
    string public name = "Post-Quantum Conway Automaton NFT";
    string public symbol = "PQCA";
    uint256 public nextTokenId = 1;
    address public owner;
    address public bridgeContract;

    struct AutomatonMetadata {
        string cellName;
        uint256 generation;
        uint256 powerLevel;
        string algorithm; // e.g. "ML-KEM-768", "ML-DSA-65", "Falcon-512"
        string latticeHash;
        string pqcSignature;
        string tokenUri;
        uint256 mintTimestamp;
    }

    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(uint256 => address) public getApproved;
    mapping(address => mapping(address => bool)) public isApprovedForAll;
    mapping(uint256 => AutomatonMetadata) public tokenMetadata;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event CellMinted(uint256 indexed tokenId, address indexed owner, string cellName, uint256 generation);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setBridgeContract(address _bridge) external onlyOwner {
        bridgeContract = _bridge;
    }

    function mintAutomaton(
        address to,
        string calldata cellName,
        uint256 generation,
        uint256 powerLevel,
        string calldata algorithm,
        string calldata latticeHash,
        string calldata pqcSignature,
        string calldata uri
    ) external returns (uint256) {
        uint256 tokenId = nextTokenId++;
        ownerOf[tokenId] = to;
        balanceOf[to]++;

        tokenMetadata[tokenId] = AutomatonMetadata({
            cellName: cellName,
            generation: generation,
            powerLevel: powerLevel,
            algorithm: algorithm,
            latticeHash: latticeHash,
            pqcSignature: pqcSignature,
            tokenUri: uri,
            mintTimestamp: block.timestamp
        });

        emit CellMinted(tokenId, to, cellName, generation);
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return tokenMetadata[tokenId].tokenUri;
    }

    function getAutomaton(uint256 tokenId) external view returns (AutomatonMetadata memory) {
        require(ownerOf[tokenId] != address(0), "Token does not exist");
        return tokenMetadata[tokenId];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(ownerOf[tokenId] == from, "From is not token owner");
        require(to != address(0), "Cannot transfer to zero address");
        require(
            msg.sender == from || getApproved[tokenId] == msg.sender || isApprovedForAll[from][msg.sender],
            "Not authorized"
        );

        getApproved[tokenId] = address(0);
        balanceOf[from]--;
        balanceOf[to]++;
        ownerOf[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
}
