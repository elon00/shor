// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPQCERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function bridgeBurn(address from, uint256 amount, uint256 targetChainId) external returns (bool);
    function bridgeMint(address to, uint256 amount, uint256 sourceChainId) external returns (bool);
}

/**
 * @title QuantumMultichainBridge
 * @notice EVM bridge escrow with explicit, replay-protected relay authorization.
 * @dev The relay signature is classical ECDSA. It is NOT post-quantum secure.
 * A future audited PQ verifier can replace this authorization layer.
 */
contract QuantumMultichainBridge {
    address public owner;
    address public relaySigner;
    IPQCERC20 public immutable pqcToken;
    uint256 public immutable currentChainId;
    uint256 public nextNonce;

    uint256 private constant SECP256K1N_HALF = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    struct BridgeTransaction {
        bytes32 txId;
        address sender;
        address recipient;
        uint256 amount;
        uint256 sourceChainId;
        uint256 targetChainId;
        bytes32 pqcProofHash;
        uint256 nonce;
        uint256 timestamp;
        bool completed;
    }

    mapping(bytes32 => BridgeTransaction) public bridgeTransactions;
    mapping(bytes32 => bool) public processedTxIds;
    mapping(uint256 => bool) public supportedChains;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event RelaySignerUpdated(address indexed signer);
    event SupportedChainUpdated(uint256 indexed chainId, bool supported);
    event BridgeInitiated(bytes32 indexed txId, address indexed sender, address indexed recipient, uint256 amount, uint256 sourceChainId, uint256 targetChainId, bytes32 pqcProofHash, uint256 nonce);
    event BridgeCompleted(bytes32 indexed txId, address indexed recipient, uint256 amount, uint256 sourceChainId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner authorized");
        _;
    }

    constructor(address token, uint256 chainId, address signer) {
        require(token != address(0) && signer != address(0), "Invalid address");
        owner = msg.sender;
        pqcToken = IPQCERC20(token);
        currentChainId = chainId;
        relaySigner = signer;

        supportedChains[1] = true;
        supportedChains[10] = true;
        supportedChains[56] = true;
        supportedChains[137] = true;
        supportedChains[42161] = true;
        supportedChains[8453] = true;
        supportedChains[43114] = true;
        supportedChains[11155111] = true;
        supportedChains[80002] = true;

        emit OwnershipTransferred(address(0), owner);
        emit RelaySignerUpdated(signer);
    }

    function setRelaySigner(address signer) external onlyOwner {
        require(signer != address(0), "Invalid signer");
        relaySigner = signer;
        emit RelaySignerUpdated(signer);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function setSupportedChain(uint256 chainId, bool supported) external onlyOwner {
        require(chainId != currentChainId, "Cannot configure source chain");
        supportedChains[chainId] = supported;
        emit SupportedChainUpdated(chainId, supported);
    }

    function initiateBridge(address recipient, uint256 amount, uint256 targetChainId, bytes32 pqcProofHash) external returns (bytes32 txId) {
        require(recipient != address(0), "Invalid recipient");
        require(supportedChains[targetChainId], "Target chain not supported");
        require(targetChainId != currentChainId, "Target chain must differ");
        require(amount > 0, "Amount must be greater than zero");
        require(pqcProofHash != bytes32(0), "PQC proof required");

        uint256 nonce = nextNonce++;
        txId = keccak256(abi.encode(address(this), msg.sender, recipient, amount, currentChainId, targetChainId, nonce, pqcProofHash));
        require(!processedTxIds[txId], "Transaction already exists");

        // Explicit user approval is required; the bridge cannot seize arbitrary balances.
        require(pqcToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        require(pqcToken.bridgeBurn(address(this), amount, targetChainId), "Token burn failed");

        bridgeTransactions[txId] = BridgeTransaction({
            txId: txId,
            sender: msg.sender,
            recipient: recipient,
            amount: amount,
            sourceChainId: currentChainId,
            targetChainId: targetChainId,
            pqcProofHash: pqcProofHash,
            nonce: nonce,
            timestamp: block.timestamp,
            completed: false
        });

        emit BridgeInitiated(txId, msg.sender, recipient, amount, currentChainId, targetChainId, pqcProofHash, nonce);
    }

    function completeBridge(
        bytes32 txId,
        address recipient,
        uint256 amount,
        uint256 sourceChainId,
        uint256 targetChainId,
        uint256 nonce,
        bytes32 pqcProofHash,
        bytes calldata relaySignature
    ) external returns (bool) {
        require(!processedTxIds[txId], "Bridge transaction already processed");
        require(targetChainId == currentChainId, "Wrong destination chain");
        require(supportedChains[sourceChainId], "Source chain not supported");
        require(recipient != address(0) && amount > 0, "Invalid transfer");
        require(pqcProofHash != bytes32(0), "PQC proof required");

        bytes32 digest = keccak256(abi.encode(address(this), txId, recipient, amount, sourceChainId, targetChainId, nonce, pqcProofHash));
        address signer = _recoverSigner(_toEthSignedMessageHash(digest), relaySignature);
        require(signer == relaySigner, "Invalid relay signature");

        processedTxIds[txId] = true;
        require(pqcToken.bridgeMint(recipient, amount, sourceChainId), "Token mint failed");
        emit BridgeCompleted(txId, recipient, amount, sourceChainId);
        return true;
    }

    function _toEthSignedMessageHash(bytes32 digest) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", digest));
    }

    function _recoverSigner(bytes32 digest, bytes calldata signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }
        require(uint256(s) <= SECP256K1N_HALF, "High-s signature rejected");
        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature v");
        return ecrecover(digest, v, r, s);
    }
}
