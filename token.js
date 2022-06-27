class Token {
  constructor(web3) {
    this.web3 = web3
  }
  async balanceOf (contract_address, account) {
    let contract = new this.web3.eth.Contract([{
      "constant": true,
      "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ],
      "name": "balanceOf",
      "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }], contract_address)
    let balance = await contract.methods.balanceOf(account).call()
    return balance
  }
  async ownerOf (contract_address, tokenId) {
    let contract = new this.web3.eth.Contract([{
      "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" } ],
      "name": "ownerOf",
      "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
      "stateMutability": "view",
      "type": "function"
    }], contract_address)
    console.log("contract", contract)
    let owner = await contract.methods.ownerOf(tokenId).call()
    return owner
  }
  async tokenURI (contract_address, tokenId) {
    let contract = new this.web3.eth.Contract([{
      "inputs": [ { "internalType": "uint256", "name": "tokenId", "type": "uint256" } ],
      "name": "tokenURI",
      "outputs": [ { "internalType": "string", "name": "", "type": "string" }
      ],
      "stateMutability": "view",
      "type": "function"
    }], contract_address)
    let tokenURI = await contract.methods.tokenURI(tokenId).call()
    return tokenURI
  }
  async owner (contract_address) {
    let contract = new this.web3.eth.Contract([{
      "inputs": [],
      "name": "owner",
      "outputs": [ { "internalType": "address", "name": "", "type": "address" } ],
      "stateMutability": "view",
      "type": "function"
    }], contract_address)
    let owner = await contract.methods.owner().call()
    return owner
  }
}
module.exports = Token
