// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPQCERC20 {
    function bridgeBurn(address from, uint256 amount, uint256 targetChainId) external returns (bool);
    function bridgeMint(address to, uint256 amount, uint256 sourceChainId) external returns (bool);
}

/**
 * @title QuantumMultichainBridge
 * @notice Cross-Chain PQC Token & Automaton State Bridge
 * Supports Ethereum, Polygon, Arbitrum, Base, Optimism, BSC, and Avalanche.
 */
contract QuantumMultichainBridge {
    address public admin;
    IPQCERC20 public pqcToken;
    uint256 public currentChainId;

    struct BridgeTransaction {
        bytes32 txId;
        address sender;
        address recipient;
        uint256 amount;
        uint256 sourceChainId;
        uint256 targetChainId;
        string pqcLatticeProof;
        uint256 timestamp;
        bool completed;
    }

    mapping(bytes32 => BridgeTransaction) public bridgeTransactions;
    mapping(bytes32 => bool) public processedNonces;
    mapping(uint256 => bool) public supportedChains;

    event BridgeInitiated(
        bytes32 indexed txId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        string pqcLatticeProof
    );

    event BridgeCompleted(
        bytes32 indexed txId,
        address indexed recipient,
        uint256 amount,
        uint256 sourceChainId
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin authorized");
        _;
    }

    constructor(address _pqcToken, uint256 _currentChainId) {
        admin = msg.sender;
        pqcToken = IPQCERC20(_pqcToken);
        currentChainId = _currentChainId;

        // Enable default EVM supported chains
        supportedChains[1] = true;        // Ethereum Mainnet
        supportedChains[137] = true;      // Polygon PoS
        supportedChains[42161] = true;    // Arbitrum One
        supportedChains[8453] = true;     // Base
        supportedChains[10] = true;       // Optimism
        supportedChains[56] = true;       // BSC
        supportedChains[43114] = true;    // Avalanche
        supportedChains[11155111] = true; // Sepolia
        supportedChains[80002] = true;    // Polygon Amoy
    }

    function setSupportedChain(uint256 chainId, bool supported) external onlyAdmin {
        supportedChains[chainId] = supported;
    }

    function initiateBridge(
        address recipient,
        uint256 amount,
        uint256 targetChainId,
        string calldata pqcLatticeProof
    ) external returns (bytes32) {
        require(supportedChains[targetChainId], "Target chain not supported");
        require(targetChainId != currentChainId, "Target chain must be different from source");
        require(amount > 0, "Amount must be greater than zero");

        // Burn / lock tokens on source chain
        pqcToken.bridgeBurn(msg.sender, amount, targetChainId);

        bytes32 txId = keccak256(
            abi.encodePacked(msg.sender, recipient, amount, currentChainId, targetChainId, block.timestamp, pqcLatticeProof)
        );

        bridgeTransactions[txId] = BridgeTransaction({
            txId: txId,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            sourceChainId: currentChainId,
            targetChainId: targetChainId,
            pqcLatticeProof: pqcLatticeProof,
            timestamp: block.timestamp,
            completed: false
        });

        emit BridgeInitiated(txId, msg.sender, recipient, amount, currentChainId, targetChainId, pqcLatticeProof);
        return txId;
    }

    function completeBridge(
        bytes32 txId,
        address recipient,
        uint256 amount,
        uint256 sourceChainId,
        bytes calldata relaySignature
    ) external onlyAdmin returns (bool) {
        require(!processedNonces[txId], "Bridge transaction already processed");
        require(supportedChains[sourceChainId], "Source chain not supported");

        processedNonces[txId] = true;

        // Mint tokens to recipient on destination chain
        pqcToken.bridgeMint(recipient, amount, sourceChainId);

        emit BridgeCompleted(txId, recipient, amount, sourceChainId);
        return true;
    }
}
