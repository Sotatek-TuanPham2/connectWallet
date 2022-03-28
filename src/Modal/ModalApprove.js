import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const ModalApprove = ({ isVisible, balance, toggleVisible, approve }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const onChange = ({ target }) => {
    setAmount(target.value);
  };

  const handleOk = async () => {
    try {
      if (!isNaN(amount) && amount <= balance && amount > 0) {
        toggleVisible(false);
        await approve(amount);
      } else {
        setError('Input value must be number is greater than zero and less than Your WETH balance');
      }
    } catch (error) {
      toggleVisible(false);
      console.log(error);
    }
  };

  const handleCancel = () => {
    toggleVisible(false);
  };

  return (
    <Modal visible={isVisible} title="Approve" onOk={handleOk} onCancel={handleCancel}>
      <Input autoFocus value={amount} onChange={onChange} placeholder="input your amount" />
      <p>Your WETH Balance: {balance} WETH</p>
      {error ? <p>Input value must be less than Your WETH balance</p> : null}
    </Modal>
  );
};
export default ModalApprove;
