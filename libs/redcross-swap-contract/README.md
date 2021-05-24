# REDCROSS SWAP

[IPFS](https://docs.ipfs.io/install/command-line/#official-distributions)

```sh
export EDITOR=nano
pnpx jsipfs daemon
pnpx jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://127.0.0.1:5002", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io","http://localhost:5002"]'
pnpx jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST","HEAD"]'
pnpx hardhat run ./scripts/test.ts
```
