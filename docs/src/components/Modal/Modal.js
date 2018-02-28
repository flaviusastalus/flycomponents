import React from 'react';
import Component from '../Component';
import { Modal, Button } from '../../../../src';
import README from './README.md';

class ModalExample extends React.Component {
  state = {
    showModal: false
  };

  handleClick = () => {
    this.setState({ showModal: true });
  };

  handleClose = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { showModal } = this.state;

    return (
      <Component readme={README}>
        <Button className="Button Button--primary" onClick={this.handleClick}>
          Open modal
        </Button>
        <Modal
          isOpen={showModal}
          onClose={this.handleClose}
          size="medium"
          className="color-danger"
        >
          <div>Modal dialog content</div>
        </Modal>
      </Component>
    );
  }
}

export default ModalExample;
