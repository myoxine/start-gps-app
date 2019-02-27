import React, { Component } from 'react';
import Parking from './Parking';
import Driving from './Driving';

class DataTable extends Component {
  constructor(props){
    super(props);
    this.state={
      datas:props.value,
    }
  }
  onParkingClick(data){
    this.props.onParkingClick(data);
  }
  onDrivingClick(data){
    this.props.onDrivingClick(data);
  }
  createTable = () => {
    let table = []
      for (const [key, value] of this.props.datas.entries()) {
      //items.push(<li key={index}>{value}</li>)
      if(value.Status==="PARKING"){
        table.push(<Parking data={value} key={key}  onClick={this.onParkingClick.bind(this)} />);
      }
      if(value.Status==="DRIVING"){
        table.push(<Driving data={value} key={key}  onClick={this.onDrivingClick.bind(this)} />);
      }
    };
    return table;
  }
  render(){
    return (
      <table className="table table-bordered table-striped table-sm table-hover resultSearching">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Start</th>
            <th>End</th>
            <th>Dur</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {this.createTable()}

        </tbody>
      </table>

    );
  }
}

export default DataTable;
