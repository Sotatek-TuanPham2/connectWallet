import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const ModalDeposit = ({ isVisible, approveValue, toggleVisible, deposit }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const onChange = ({ target }) => {
    setAmount(target.value);
  };

  const handleOk = async () => {
    try {
      if (!isNaN(amount) && amount <= parseFloat(approveValue) && amount > 0) {
        toggleVisible(false);
        await deposit(amount);
      } else {
        setError('Input value must be number is greater than zero and less than Your WETH approve');
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
    <Modal visible={isVisible} title="Deposit" onOk={handleOk} onCancel={handleCancel}>
      <Input autoFocus value={amount} onChange={onChange} placeholder="input your amount" />
      <p>Your WETH approve: {approveValue} WETH</p>
      {error ? <p>{error}</p> : null}
    </Modal>
  );
};
export default ModalDeposit;
