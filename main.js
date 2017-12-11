const crypto = require('crypto');

class BlockChain {
  constructor() {
    let genesisBlock = new Block(0, +(new Date()), 'Genesis Block');
    genesisBlock.previousHash = "0";
    genesisBlock.hash = genesisBlock.calculateHash();
    this.chain = [genesisBlock];

    this.difficulty = 5;
  }
  
  addBlock(newBlock) {
    newBlock.previousHash = this.lastBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  
  lastBlock() {
    return this.chain[this.chain.length -1];
  }
  
  isValid() {
    for (let i = 1; i < this.chain.length; i++){
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];

        if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }
    return true;
  }
}

class Block {
  constructor(id, timestamp, data) {
    this.id = id;
    this.timestamp = timestamp;
    this.data = data;
    this.nonce = 0;
  }
  
  calculateHash() {
    let dataString = JSON.stringify(this.data);
    let message = `${this.id}${this.message}${this.previousHash}${this.timestamp}${dataString}${this.nonce}`
    return crypto.createHash('sha256').update(message).digest('hex');
  }
  
  toString() {
    return JSON.stringify(this);
  }
  
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Mined a block :: ', this.hash);
  }
}

function newBlock(blockchain, data) {
  let lastBlock = blockchain.lastBlock();
  return new Block(lastBlock.id + 1, +(new Date()), data);
}

let blockchain = new BlockChain();

for(i = 0; i < 100; i++) {
  let block = newBlock(blockchain, { message: `test message ${i}` });
  blockchain.addBlock(block);
}

console.log(blockchain);
console.log('is blockchain valid :: ', blockchain.isValid());