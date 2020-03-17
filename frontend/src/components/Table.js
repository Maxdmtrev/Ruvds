import React, {Component} from 'react';
import { Table, Spinner } from 'reactstrap';
import styles from '../Checkbox.module.scss';
import moment from 'moment';
import Server from './Server';


class Tables extends Component {
  constructor(props) {
    super(props);
    let newDate = new Date();
    let currentTime = newDate.toLocaleTimeString();
    let date = newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate() + '  ';
    this.state = {
      serversLogs: [],
      date: date,
      clock: currentTime,
      usageTime: null,
      status: null
    }
  }

  componentDidMount = async () => {
    this.timerID = setInterval(
        () => this.tick(),
        1000
    );
    this.fetchUpdate();
  };

  fetchUpdate = async () => {
    let resp = await fetch('http://localhost:5000/');
    let json = await resp.json();
    let element = json.filter((el) => {
      if(el.createDate.length > 1 && el.removeDate.length > 1) {
        return el;
      }
    });

    let addServer = element.map(el => el.createDate);
    let removeServer = element.map(el => el.removeDate);

    let total = (addArr, remArr) => {
      return remArr.map((el, i) => {
        return Math.abs(moment(el) - moment(addArr[i]));
      })
    };

    let time = total(addServer, removeServer).reduce((sum, val) => {return sum + val}, 0);

    let hours = moment.duration(time).hours();
    let minutes = moment.duration(time).minutes();
    let seconds = moment.duration(time).seconds();

    const usageTime = (hs, ms, ss) => {
      if(hs < 10) {
        hs = '0' + hs;
      }
      if(ms < 10) {
        ms = '0' + ms;
      }
      if(ss < 10) {
        ss = '0' + ss;
      }
      return hs + ':' + ms + ':' + ss;
    };

    const setTime = usageTime(hours, minutes, seconds);
    await this.setState({usageTime: setTime});
    await this.setState( {serversLogs: json});
  };

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      clock: new Date().toLocaleTimeString()
    });
  }

  addServer = async () => {
    let resp = await fetch(
        '/',
        {
          method: 'POST',
          headers:  {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            createDate: this.state.date + this.state.clock
          })
        }
    );
    let data = await resp.json();
    if(data.result) {
      this.setState({status: data.result});
      this.fetchUpdate();
    }
  };

  removeServer = async (event) => {

    let response = await fetch(`/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        removeDate: this.state.date + this.state.clock,
        id: event.target.name,
      })
    });
    let data = response.json();
    if(data.result) {
      this.setState({status: data.result});
    }
    this.fetchUpdate();
  };

  deleteServer = async (event) => {
    const response = await fetch(`/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: event.target.name,
      })
    });
    let data = response.json();
    if(data.result) {
      this.setState({status: data.result});
    }
    this.fetchUpdate();
  };

  render() {
    return (
    <div>
      <div>
        <Table bordered>
          <thead>
          <tr>
            <td className={'width'}>CurrentDateTime:</td>
            <td>{this.state.date + this.state.clock}</td>
            <td>{''}</td>
            <td>{''}</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td className={'width'}>TotalUsageTime:</td>
            <td>{this.state.usageTime}</td>
            <td>{''}</td>
            <td>{''}</td>
          </tr>
          <tr>
            <td className={'width'}>VirtualServerId</td>
            <td className={'width'}>CreateDateTime</td>
            <td className={'width'}>RemoveDateTime</td>
            <td className={'width'}>SelectedForRemove</td>
          </tr>
            {this.state.serversLogs ?
              this.state.serversLogs.map((server, index) => {
              return <Server key={index} data={server}
                             removeServer={this.removeServer}
                             deleteServer={this.deleteServer}/>
              })
              : <div><Spinner color="primary" /></div>
            }
          </tbody>
        </Table>
      </div>
      <div>
        <input className={styles.add}
          type="submit"
          value={'Add Server'}
          onClick={this.addServer}/>{' '}
      </div>
    </div>
    );
  }
}

export default Tables;
