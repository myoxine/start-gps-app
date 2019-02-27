import React, { Component } from 'react';
import { Badge } from 'reactstrap';

class Parking extends Component {
  constructor(props){
    super(props);
    this.state={
      data:props.data,
      //key:props.key,
    }
  }
  onClick(e){
      this.props.onClick(this.props.data);
  }
  render(){
    return (
      <tr onClick={this.onClick.bind(this)}>
        <th scope="row"><Badge color="danger">P</Badge></th>
        <td>{this.state.data.Start.format("MM/DD/YYYY")} {this.state.data.Start.format("HH:mm:ss")}</td>
        <td>{this.state.data.End.format("MM/DD/YYYY")} {this.state.data.End.format("HH:mm:ss")}</td>
        <td>{this.state.data.Duration.get("hours")}H {this.state.data.Duration.get("minutes")}M {this.state.data.Duration.get("seconds")}S</td>
        <td></td>
      </tr>
    );
  }
}

export default Parking;
