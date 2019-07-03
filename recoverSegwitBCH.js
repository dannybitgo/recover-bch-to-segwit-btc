/**
 * This script helps a bitgo employee construct a recovery transaction for BCH sent to a BTC segwit address
 *
 * node recoverSegwitBCH.js keyfile.json
 *
 * (see README for how to generate the keyfile.json)
 */


const utxo = require('bitgo-utxo-lib');
const fs = require('fs');
const _ = require('lodash');
const reverse = require("buffer-reverse")
const fee = 10000;
let keys = JSON.parse(fs.readFileSync(process.argv[2]));


/**
 * TODO: fill out these
 */
const network = utxo.networks.bitcoincash; // for mainnet
// const network = utxo.networks.bitcoincashTestnet; // for testnet
const chain = 10; // could be 20 for native segwit
const index = 0;
const txid = '';
const vin = 0;
const vinAmount = 0; // amount in satoshis
const destinationAddress = '';
/**
 * End Todo
 */


const outAmount = vinAmount - fee;
const txb = new utxo.TransactionBuilder(network);
txb.addInput(txid, vin);

if (keys.length === 5) {
  keys = [keys[2], keys[3], keys[4]];
} else if (keys.length === 4) {
  keys = [keys[1], keys[2], keys[3]];
}

const pubKeys = _.map(keys, (key) => {
  const node = utxo.HDNode.fromBase58(key.pub || key.xpub);
  if (!key.path) key.path = '/0/0';
  const path = key.path.substring(1, key.path.length) + '/' + chain + '/' + index;
  return node.derivePath(path).getPublicKeyBuffer();
});

const witnessScript = utxo.script.multisig.output.encode(2, pubKeys);
const redeemScript = utxo.script.witnessScriptHash.output.encode(utxo.crypto.sha256(witnessScript));
const scriptPubKey = utxo.script.scriptHash.output.encode(utxo.crypto.hash160(redeemScript));
const rsHex = redeemScript.toString('hex')
const rsHexLength = rsHex.length/2;
const lengthHex = (rsHexLength).toString('16');

txb.addOutput(destinationAddress, outAmount);
const tx = txb.buildIncomplete();
tx.setInputScript(0, Buffer.from(lengthHex + rsHex, 'hex'));

console.log(tx.toHex());

