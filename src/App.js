import './App.css';
import './App.scss';
import {Button, Row , Col} from 'antd';
import {useState, useEffect} from 'react';
import History from './Table/History';
import {useWeb3React} from '@web3-react/core'
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import { 
  WETH_CONTRACT_ADDRESS,
  DD2_CONTRACT_ADDRESS,
  MASTERCHEF_CONTRACT_ADDRESS,
  WALLETCONNECT_BRIDGE_URL,
  INFURA_KEY,
  SUPPORTED_CHAIN_IDS
} from './abi/constant.js'
import{ truncateAddress} from './formatAddress/index'

const NETWORK_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  5: `https://goerli.infura.io/v3/${INFURA_KEY}`
};

const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

const walletConnectConnector = new WalletConnectConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true
});




function App() {
  const [isAprove, setIsAprove] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceDD2, setBalanceDD2] = useState(0);
  const [stake, setStake] = useState(0);
  const [totalStake, setTotalStake] = useState(0);

  const { account, activate, library } = useWeb3React();

  const connectInjectedConnector = () => {
    activate(injected);
  };

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector)
  };
  return (
    <div className="App">
      {!account ? (
        <Row>
          <Col span={12} offset={6}>
                <div className="connector-container">
                  <button onClick={connectInjectedConnector} className="button-metamask" >
                    Connect MetaMask
                  </button>
                  <button onClick={connectWalletConnectConnector} >Connect Wallet</button>
              </div>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={12} offset={6}>
                <div className='main '>
                  <div className='main_address'>Wallet Address:  {truncateAddress(account)}</div>
                  <div className='main_address'>Balance:{balance}</div>
                  <div className='main_token'>
                    <div className='main_token-earned'>Token earned:{balanceDD2} DD2</div>
                    <div className='main_token-button'>
                      <button>Harvert</button>
                    </div>
                  </div>

                  <div className='action-container'>
                  {!isAprove ? (
                        <button
                          className="button-approve"
                          >
                          Approve
                        </button>
                    ) : (
                      <div className="action-container-deposit">
                        <button
                          className="button-deposit"
                          >
                          Deposit
                        </button>
                        <button
                          className="button-withdraw"
                          >
                          Withdraw
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="your-stake">Your stake:{stake}  WETH</div>
                  <div className="total-stake">Total stake:{totalStake}  WETH</div>
                </div>
          </Col>
        </Row>
      )}

      {/* <History/> */}
     
    </div>
  );
}

export default App;
