import React, {Component} from 'react';
import '../App.css';
import styles from '../Checkbox.module.scss';

class Server extends Component {

  render() {
    return (
      <tr>
        <td>{this.props.data._id}</td>
        <td>{this.props.data.createDate}</td>
        <td>{this.props.data.removeDate}</td>
        <td>
          <input
            onClick={this.props.removeServer}
            className={styles.checkbox}
            name={this.props.data._id}
            type="checkbox"
          />
          <input
            name={this.props.data._id}
            type='submit'
            className={styles.delete}
            value={'Delete'}
            onClick={this.props.deleteServer}
          />
        </td>
      </tr>
    );
  }
}

export default Server;
