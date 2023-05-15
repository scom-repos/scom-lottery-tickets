export default {
  "infuraId": "adc596bf88b648e2a8902bc9093930c5",
  "networks": [  
    {
      "chainId": 97,
      "isMainChain": true,
      "isCrossChainSupported": true,
      "explorerName": "BSCScan",
      "explorerTxUrl": "https://testnet.bscscan.com/tx/",
      "explorerAddressUrl": "https://testnet.bscscan.com/address/",
      "isTestnet": true
    },    
    {
      "chainId": 43113,
      "shortName": "AVAX Testnet",
      "isCrossChainSupported": true,
      "explorerName": "SnowTrace",
      "explorerTxUrl": "https://testnet.snowtrace.io/tx/",
      "explorerAddressUrl": "https://testnet.snowtrace.io/address/",
      "isTestnet": true
    }    
  ],
  "proxyAddresses": {
    "97": "0x9602cB9A782babc72b1b6C96E050273F631a6870",
    "43113": "0x7f1EAB0db83c02263539E3bFf99b638E61916B96"
  },
  "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
  "embedderCommissionFee": "0.01",
  "defaultBuilderData": {
    "defaultChainId": 43113,
    "chainId": 43113,
    "networks": [
      {
        "chainId": 43113
      },
      {
        "chainId": 97
      }
    ],
    "wallets": [
      {
        "name": "metamask"
      }
    ]
  }
}