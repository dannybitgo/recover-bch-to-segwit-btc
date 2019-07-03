# recover-bch-to-segwit-btc
Script to help recover BCH sent to a segwit BTC address

Before running this script, you'll need to get a couple things from the customer:

1) The txid of the bad transaction (badtxid)
2) The BTC address where the bad transaction was sent to (bchaddress)
3) The BCH address where they'd like the recovered funds to be sent to (destination)

Now you should do the following:

```bash
# clone the repo if you haven't already
git clone https://github.com/dannybitgo/recover-bch-to-segwit-btc.git
cd recover-bch-to-segwit-btc
npm install
bga login
# proceed to login
bga coin bch
bga -j tx get (badtxid) > txinfo.json
bga coin btc
bga address get (bchaddress) | tail -n+3 > addressinfo.json
node recoverSegwitBCH.js txinfo.json addressinfo.json (destination)
```

This will output a transaction hex to the console, which should be given to a miner to directly mine.
Note that this type of transaction does *not* require signatures, and anyone who obtains this transaction hex can claim the funds. Make that very clear to the customer.

-------------
EXAMPLE (testnet):

For the remainder of this example, we'll consider a test case where I sent .012 TBCH to the TBTC address ```2MxeNXWW4JiYWnkcnH9k2yztX8FzwCgyZ26```
The txid is ```a8d2e95a90962a3995644eff014d38f7c30fcc8744b6de3319e940175555c6f8```


```bash
bga -e test coin tbch
bga -e test -j tx get a8d2e95a90962a3995644eff014d38f7c30fcc8744b6de3319e940175555c6f8 > txinfo.json
bga -e test coin tbtc
bga -e test address get 2MxeNXWW4JiYWnkcnH9k2yztX8FzwCgyZ26 | tail -n+3  > addressinfo.json
```
This should produce two files ```txinfo.json``` and ```addressinfo.json```. You should copy these over into the folder where ```recoverSegwitBCH.js``` lives.

To run the script, do:

```bash
node recoverSegwitBCH.js txinfo.json addressinfo.json <destinationAddress>
```
For testnet, do:
```bash
node recoverSegwitBCH.js txinfo.json addressinfo.json <destinationAddress> test
```

In this example, lets say the customer wants the funds recovered to the tbch address: ```2NE1kh3CySrmQU7RApm9n2iMbnZ5Q2M2c5F```
So we do:
```bash
node recoverSegwitBCH.js txinfo.json addressinfo.json 2NE1kh3CySrmQU7RApm9n2iMbnZ5Q2M2c5F test
```



