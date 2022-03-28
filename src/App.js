import './App.css';
import './App.scss';
import {Button, Row , Col} from 'antd';
import {useState, useEffect} from 'react';
import History from './Table/History';
import {useWeb3React} from '@web3-react/core';
import WETH_ABI from './abi/WETH.json';
import MASTERCHEF_ABI from './abi/Masterchef.json'
import {InjectedConnector} from '@web3-react/injected-connector';
import {WalletConnectConnector} from '@web3-react/walletconnect-connector';
import { 
  WETH_CONTRACT_ADDRESS,
  MASTERCHEF_CONTRACT_ADDRESS,
  WALLETCONNECT_BRIDGE_URL,
  INFURA_KEY,
  SUPPORTED_CHAIN_IDS
} from './abi/constant.js';
import ModalApprove from './Modal/ModalApprove';
import ModalDeposit from './Modal/ModalDeposit';
import ModalWithdraw from './Modal/ModalWithdraw';
import { Multicall } from 'ethereum-multicall';
import{ truncateAddress} from './formatAddress/index'
import Web3 from 'web3';

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
  const [balance, setBalance] = useState(0);
  const [balanceDD2, setBalanceDD2] = useState(0);
  const [stake, setStake] = useState(0);
  const [totalStake, setTotalStake] = useState(0);
  const [isAprove, setIsAprove] = useState(false);
  const [approveValue, setApproveValue] = useState(0);
  const [isModalDeposit, setIsModalDeposit] = useState(false);
  const [isModalApprove, setIsModalApprove] = useState(false);
  const [isModalWithdraw, setIsModalWithdraw] = useState(false);

  const { account, activate, library } = useWeb3React();

  const connectInjectedConnector = () => {
    activate(injected);
  };

  const connectWalletConnectConnector = () => {
    activate(walletConnectConnector)
  };

  const approve = async (value) => {
    const web3 = new Web3(library.provider);
    const wethContract = new web3.eth.Contract(WETH_ABI, WETH_CONTRACT_ADDRESS);
    await wethContract.methods
      .approve(MASTERCHEF_CONTRACT_ADDRESS, web3.utils.toWei(value))
      .send({ from: account });
    setIsAprove(true);
    await getInfo();
  };

  const harvest = () => {
    deposit('0');
  };

  const deposit = async (value) => {
    const web3 = new Web3(library.provider);
    const masterchefContract = new web3.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_CONTRACT_ADDRESS);
    const result = await masterchefContract.methods
      .deposit(web3.utils.toWei(value))
      .send({ from: account });
    console.log(result);
    await getInfo();
  };

  const withdraw = async (value) => {
    const web3 = new Web3(library.provider);
    const masterchefContract = new web3.eth.Contract(MASTERCHEF_ABI, MASTERCHEF_CONTRACT_ADDRESS);
    const result = await masterchefContract.methods
      .withdraw(web3.utils.toWei(value))
      .send({ from: account });
    console.log(result);
    await getInfo();
  };

  const getInfo = async () => {
    // getBalance()
    // getDD2()
    // checkIsAproveMasterChefContract()
    // getYourStake()
    // getTotalStake()
    getInfoMultiCall();
  };

  const getInfoMultiCall = async () => {
    const web3 = new Web3(library.provider);
    const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
    const addressList = [
      {
        address: WETH_CONTRACT_ADDRESS,
        abi: WETH_ABI,
        method: 'balanceOf',
        methodParameters: [account],
        reference: 'balance'
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
        abi: MASTERCHEF_ABI,
        method: 'pendingDD2',
        methodParameters: [account],
        reference: 'dd2'
      },
      {
        address: WETH_CONTRACT_ADDRESS,
        abi: WETH_ABI,
        method: 'allowance',
        methodParameters: [account, MASTERCHEF_CONTRACT_ADDRESS],
        reference: 'isApproval'
      },
      {
        address: MASTERCHEF_CONTRACT_ADDRESS,
        abi: MASTERCHEF_ABI,
        method: 'userInfo',
        methodParameters: [account],
        reference: 'yourStake'
      },
      {
        address: WETH_CONTRACT_ADDRESS,
        abi: WETH_ABI,
        method: 'balanceOf',
        methodParameters: [MASTERCHEF_CONTRACT_ADDRESS],
        reference: 'totalStake'
      }
    ];

    const contractCallContext = addressList.map((context) => {
      return {
        reference: context.reference,
        contractAddress: context.address,
        abi: context.abi,
        calls: [
          {
            reference: `${context.reference} call`,
            methodName: context.method,
            methodParameters: context.methodParameters
          }
        ]
      };
    });
    // console.log('multi call', contractCallContext);
    const result = await multicall.call(contractCallContext);
    // console.log('multi call result', result.results)
    // console.log('multi call balance', web3.utils.fromWei(result.results.balance.callsReturnContext[0].returnValues[0].hex))
    // console.log('multi call DD2', web3.utils.fromWei(result.results.dd2.callsReturnContext[0].returnValues[0].hex))
    // console.log('multi call isAprroval', web3.utils.fromWei(result.results.isApproval.callsReturnContext[0].returnValues[0].hex))
    // console.log('multi call yourStake', web3.utils.fromWei(result.results.yourStake.callsReturnContext[0].returnValues[0].hex))
    // console.log('multi call totalStake', web3.utils.fromWei(result.results.totalStake.callsReturnContext[0].returnValues[0].hex))
    const balance = web3.utils.fromWei(
      result.results.balance.callsReturnContext[0].returnValues[0].hex
    );
    setBalance(balance);
    const balanceDD2 = web3.utils.fromWei(
      result.results.dd2.callsReturnContext[0].returnValues[0].hex
    );
    setBalanceDD2(balanceDD2);
    const approvalValue = web3.utils.fromWei(
      result.results.isApproval.callsReturnContext[0].returnValues[0].hex
    );
    if (approvalValue > 0) {
      setIsAprove(true);
    } else {
      setIsAprove(false);
    }
    setApproveValue(approvalValue);
    const yourStake = web3.utils.fromWei(
      result.results.yourStake.callsReturnContext[0].returnValues[0].hex
    );
    setStake(yourStake);
    const totalStake = web3.utils.fromWei(
      result.results.totalStake.callsReturnContext[0].returnValues[0].hex
    );
    setTotalStake(totalStake);
  };

  const toggleVisibleModalApprove = (isVisible) => {
    setIsModalApprove(isVisible);
  };

  const toggleVisibleModalDeposit = (isVisible) => {
    setIsModalDeposit(isVisible);
  };

  const toggleVisibleModalWithdraw = (isVisible) => {
    setIsModalWithdraw(isVisible);
  };

  useEffect(() => {
    if (account) {
      console.log(account);
      getInfo();
    }
  }, [account]);
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
                          onClick={() => toggleVisibleModalApprove(true)}
                          >
                          Approve
                        </button>
                    ) : (
                      <div className="action-container-deposit">
                        <button
                          className="button-deposit"
                          onClick={() => toggleVisibleModalDeposit(true)}
                          >
                          Deposit
                        </button>
                        <button
                          className="button-withdraw"
                          onClick={() => toggleVisibleModalWithdraw(true)}
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

      <ModalApprove
            isVisible={isModalApprove}
            toggleVisible={toggleVisibleModalApprove}
            balance={balance}
            approve={approve}
          />
          <ModalDeposit
            isVisible={isModalDeposit}
            toggleVisible={toggleVisibleModalDeposit}
            approveValue={approveValue}
            deposit={deposit}
          />
          <ModalWithdraw
            isVisible={isModalWithdraw}
            toggleVisible={toggleVisibleModalWithdraw}
            stake={stake}
            withdraw={withdraw}
          />
     
    </div>
  );
}

export default App;
