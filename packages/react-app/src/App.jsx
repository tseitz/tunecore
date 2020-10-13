import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import 'antd/dist/antd.css'
import { getDefaultProvider, JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import './App.css'
import { Row, Col, Button, Menu } from 'antd'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useUserAddress } from 'eth-hooks'
import { formatEther } from '@ethersproject/units'
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useBalance } from './hooks'
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Feed } from './components'
import { Transactor } from './helpers'
// import Hints from "./Hints";
import { Hints, ExampleUI } from './views'
import { INFURA_ID, ETHERSCAN_KEY } from './constants'

// const { TabPane } = Tabs; // antd

// 🔭 block explorer URL
const blockExplorer = 'https://etherscan.io/' // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers. connecting to ethereum
console.log('📡 Connecting to Mainnet Ethereum')
const mainnetProvider = getDefaultProvider('mainnet', { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 }) // should switch to 2 for prod
// const mainnetProvider = new InfuraProvider("mainnet", INFURA_ID);
// const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/5ce0898319eb4f5c9d4c982c8f78392a")

const localProviderUrlFromEnv = 'http://localhost:8545' || process.env.REACT_APP_PROVIDER
console.log('🏠 Connecting to provider:', localProviderUrlFromEnv)
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv)

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
})

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider()
  setTimeout(() => {
    window.location.reload()
  }, 1)
}

function App() {
  const [injectedProvider, setInjectedProvider] = useState()

  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider) // 1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice('fast') // 1000000000 for xdai

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider)
  const address = useUserAddress(userProvider)

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // get user balance
  const yourLocalBalance = useBalance(localProvider, address)
  console.log('💵 yourLocalBalance', yourLocalBalance ? formatEther(yourLocalBalance) : '...')

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  console.log('📝 readContracts', readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  console.log('🔐 writeContracts', writeContracts)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, [loadWeb3Modal])

  console.log('Location:', window.location.pathname)

  return (
    <div className="App">
      <Header />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: 'fixed', textAlign: 'right', right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
      </div>

      <Feed writeContracts={writeContracts} tx={tx} />

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} />
          </Col>

          <Col span={8} style={{ textAlign: 'center', opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: 'center', opacity: 1 }}>
            <Button
              onClick={() => {
                window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA')
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              localProvider &&
              localProvider.connection &&
              localProvider.connection.url &&
              localProvider.connection.url.indexOf('localhost') >= 0 &&
              // !process.env.REACT_APP_PROVIDER &&
              price > 1 ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ''
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default App
