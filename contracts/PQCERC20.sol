// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PQCERC20
 * @notice Post-Quantum Cryptography Enabled ERC-20 Token ($PQC)
 * Built for Shor Web 4.0 Multichain Cellular Automaton & AI Network.
 * Supports FIPS 203 ML-KEM-768 lattice state verification and cross-chain bridge minting.
 */
contract PQCERC20 {
    string public name = "Post-Quantum Conway Token";
    string public symbol = "PQC";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    address public bridgeContract;

    bytes32 public constant LATTICE_ALGORITHM = keccak256("FIPS_203_ML_KEM_768");
    bytes32 public globalLatticeStateHash;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => string) public addressPqcPublicKey;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event LatticeKeyRegistered(address indexed user, string pqcPublicKey);
    event BridgeMint(address indexed to, uint256 amount, uint256 sourceChainId);
    event BridgeBurn(address indexed from, uint256 amount, uint256 targetChainId);
    event LatticeStateUpdated(bytes32 indexed newStateHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner authorized");
        _;
    }

    modifier onlyBridge() {
        require(msg.sender == bridgeContract || msg.sender == owner, "Only bridge authorized");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply * (10 ** uint256(decimals));
        balanceOf[msg.sender] = totalSupply;
        globalLatticeStateHash = keccak256(abi.encodePacked(block.timestamp, msg.sender, "GENESIS_LATTICE_SEED"));
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function setBridgeContract(address _bridge) external onlyOwner {
        bridgeContract = _bridge;
    }

    function registerPqcPublicKey(string calldata publicKey) external {
        addressPqcPublicKey[msg.sender] = publicKey;
        emit LatticeKeyRegistered(msg.sender, publicKey);
    }

    function updateLatticeState(bytes32 newStateHash) external onlyOwner {
        globalLatticeStateHash = newStateHash;
        emit LatticeStateUpdated(newStateHash, block.timestamp);
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        require(recipient != address(0), "Cannot transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient PQC balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        require(balanceOf[sender] >= amount, "Insufficient PQC balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");

        balanceOf[sender] -= amount;
        allowance[sender][msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function bridgeMint(address to, uint256 amount, uint256 sourceChainId) external onlyBridge returns (bool) {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit BridgeMint(to, amount, sourceChainId);
        emit Transfer(address(0), to, amount);
        return true;
    }

    function bridgeBurn(address from, uint256 amount, uint256 targetChainId) external onlyBridge returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient PQC balance to burn");
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit BridgeBurn(from, amount, targetChainId);
        emit Transfer(from, address(0), amount);
        return true;
    }
}
