import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://thegraph.com/hosted-service/subgraph/sotatek-tuanpham2/connectwallet',
  cache: new InMemoryCache()
});

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  return library;
}
const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');

ReactDOM.render(
  // <React.StrictMode>
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
