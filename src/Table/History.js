import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Col, Row, Table } from 'antd';
import { LOAD_TRANSACTION } from '../../GraphQL/Queries';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import Web3 from 'web3';
const columns = [
  {
    title: 'Action',
    dataIndex: 'type',
    key: 'action',
    align: 'center'
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    align: 'center'
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    align: 'center'
  }
];
export default function TransactionHistory() {
  const { account } = useWeb3React();
  const { loading, data } = useQuery(LOAD_TRANSACTION, {
    variables: { first: 10, address: account }
  });

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    if (data) {
      console.log(data);
      setTransactions(
        data.transactionEntities.map((item) => {
          const { time, amount } = item;
          return {
            ...item,
            time: moment.unix(time).format('HH:mm DD/MM/YYYY'),
            amount: Web3.utils.fromWei(amount)
          };
        })
      );
    }
  }, [data]);

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <div>Lastest 10 transactions</div>
          <Table
            dataSource={transactions}
            loading={loading}
            bordered={true}
            rowKey="id"
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
}
