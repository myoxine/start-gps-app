import React, { Component } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

class DateInput extends Component {
  constructor(props){
    super(props);
    this.state={
      value:props.value,
      label:props.label
    }
  }
  onChange(val){
    this.setState({
      value:val
    }, function(){
      this.props.onChange(this.state.value);
    });
  }
  render(){
    return (
      <div className="form-group row">
        <label className="col-sm-3 col-form-label">{this.state.label}</label>
        <div className="col-sm-9">
          <Datetime dateFormat="DD-MM-YYYY" timeFormat="HH:mm"  value={this.state.value} onChange={this.onChange.bind(this)} />
        </div>
      </div>

    );
  }
}

export default DateInput;
