// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PQCERC20
 * @notice ERC-20 token with an auditable post-quantum metadata registry.
 * @dev FIPS algorithms are metadata only; this EVM contract does NOT perform
 * ML-KEM/ML-DSA cryptographic verification. Off-chain PQC verification must
 * be completed by a trusted verifier before a bridge action is authorized.
 */
contract PQCERC20 {
    string public constant name = "Post-Quantum Conway Token";
    string public constant symbol = "PQC";
    uint8 public constant decimals = 18;

    uint256 public totalSupply;
    address public owner;
    address public bridgeContract;

    bytes32 public constant LATTICE_ALGORITHM = keccak256("FIPS_203_ML_KEM_768");
    bytes32 public globalLatticeStateHash;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => bytes32) public addressPqcPublicKeyHash;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed tokenOwner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event BridgeUpdated(address indexed bridge);
    event LatticeKeyRegistered(address indexed user, bytes32 indexed publicKeyHash);
    event BridgeMint(address indexed to, uint256 amount, uint256 sourceChainId);
    event BridgeBurn(address indexed from, uint256 amount, uint256 targetChainId);
    event LatticeStateUpdated(bytes32 indexed newStateHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner authorized");
        _;
    }

    modifier onlyBridge() {
        require(msg.sender == bridgeContract, "Only bridge authorized");
        _;
    }

    constructor(uint256 initialSupply) {
        owner = msg.sender;
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
        globalLatticeStateHash = keccak256(abi.encodePacked(block.chainid, msg.sender, "GENESIS_LATTICE_SEED"));
        emit Transfer(address(0), msg.sender, totalSupply);
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function setBridgeContract(address bridge) external onlyOwner {
        require(bridge != address(0), "Invalid bridge");
        bridgeContract = bridge;
        emit BridgeUpdated(bridge);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function registerPqcPublicKeyHash(bytes32 publicKeyHash) external {
        require(publicKeyHash != bytes32(0), "Empty key hash");
        addressPqcPublicKeyHash[msg.sender] = publicKeyHash;
        emit LatticeKeyRegistered(msg.sender, publicKeyHash);
    }

    function updateLatticeState(bytes32 newStateHash) external onlyOwner {
        require(newStateHash != bytes32(0), "Empty state hash");
        globalLatticeStateHash = newStateHash;
        emit LatticeStateUpdated(newStateHash, block.timestamp);
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "Invalid spender");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        uint256 currentAllowance = allowance[sender][msg.sender];
        require(currentAllowance >= amount, "Allowance exceeded");
        unchecked { allowance[sender][msg.sender] = currentAllowance - amount; }
        _transfer(sender, recipient, amount);
        emit Approval(sender, msg.sender, allowance[sender][msg.sender]);
        return true;
    }

    function bridgeMint(address to, uint256 amount, uint256 sourceChainId) external onlyBridge returns (bool) {
        require(to != address(0), "Invalid recipient");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit BridgeMint(to, amount, sourceChainId);
        emit Transfer(address(0), to, amount);
        return true;
    }

    function bridgeBurn(address from, uint256 amount, uint256 targetChainId) external onlyBridge returns (bool) {
        _transfer(from, address(this), amount);
        balanceOf[address(this)] -= amount;
        totalSupply -= amount;
        emit BridgeBurn(from, amount, targetChainId);
        emit Transfer(address(this), address(0), amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Invalid sender");
        require(to != address(0), "Invalid recipient");
        require(balanceOf[from] >= amount, "Insufficient PQC balance");
        unchecked {
            balanceOf[from] -= amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
    }
}
