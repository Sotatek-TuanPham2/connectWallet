import React, { useState } from 'react';
import { Modal, Input } from 'antd';

const ModalWithdraw = ({ isVisible, stake, toggleVisible, withdraw }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const onChange = ({ target }) => {
    setAmount(target.value);
  };

  const handleOk = async () => {
    try {
      if (!isNaN(amount) && amount <= parseFloat(stake) && amount > 0) {
        toggleVisible(false);
        await withdraw(amount);
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
    <Modal visible={isVisible} title="Withdraw" onOk={handleOk} onCancel={handleCancel}>
      <Input value={amount} onChange={onChange} placeholder="input your amount" />
      <p>Your WETH deposited: {stake} WETH</p>
      {error ? <p>Input value must be less than Your WETH deposited</p> : null}
    </Modal>
  );
};

export default ModalWithdraw;
