import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import GMap from './components/GMap';
import './assets/css/app.min.css';
import moment from 'moment';
import { Button,InputGroup, InputGroupAddon } from 'reactstrap';
import DateInput from './components/controls/DateInput';
import DataTable from './components/controls/DataTable';
import history from './history.json';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay,faUndo,faDownload,faSearchLocation } from '@fortawesome/free-solid-svg-icons'
library.add(faDownload);
library.add(faPlay);
library.add(faUndo);
library.add(faSearchLocation);

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      fromDate:moment("22/12/2018 00:00","DD/MM/YYYY HH:mm"),
      toDate:moment("22/12/2018 23:59","DD/MM/YYYY HH:mm"),
      datas:[
      ],
      center: {lat: -6.2293867, lng: 106.6894293},
      zoom: 15,
      marker: {lat: -6.2293867, lng: 106.6894293},
      isMarkerShown:false,
      chartData:null
    };
  }

  componentWillMount(){
      history.sort(function(a, b) {
        var A = a.Date // ignore upper and lowercase
        var B = b.Date; // ignore upper and lowercase
        if (A < B) {
          return -1;
        }
        if (A > B) {
          return 1;
        }

        // names must be equal
        return 0;
      });
  }
  changeFromInput(val){
      this.setState({fromDate:val});
  }
  changeToInput(val){
      this.setState({toDate:val});
  }
  onParkingClick(data){
    this.setState({
      center: {
        lat: data.Lat,
        lng: data.Lng
      },
      marker:{
        lat: data.Lat,
        lng: data.Lng
      },
      routes:data.Routes,
      isMarkerShown:true,
      chartData:null
    });
  }
  onDrivingClick(data){
    console.log(data);
    var arrlabels=[];
    var arrvalue=[];
    for(var i=0;i<data.Routes.length;i++){
      arrlabels.push(data.Routes[i].Date);
      arrvalue.push(data.Routes[i].Speed);
    }
    var tmpdata = {
      labels: arrlabels,
      datasets: [
        {
          label: 'Speed',
          data: arrvalue,
          fill: false,          // Don't fill area under the line
          borderColor: 'green'  // Line color
        }
      ]
    }
    console.log(tmpdata);
    this.setState({
      center: {
        lat: data.Lat,
        lng: data.Lng
      },
      routes:data.Routes,
      isMarkerShown:false,
      chartData:tmpdata
    });
  }
  onsearch2(){
      var current=null;
      //var prev=null;
      var data=[];
      for(var i=0;i<history.length;i++){

        if(current!=null){
          if(history[i].Status===current.Status){
            var dt=history[i].Duration.split(":");
            current.Duration=current.Duration.add(dt[0], 'h').add(dt[1], 'm').add(dt[2], 's');
            //console.log(current.Duration.format("HH:mm:ss"));
            if(history[i].Status==='DRIVING'){
                current.Routes.push({
                  Date:history[i].Date,
                  Lat:history[i].Lat,
                  Lng:history[i].Lng,
                  Speed:history[i].Speed

                })
            }
          }else{
            current.End=current.Start.clone().add(current.Duration.hours(),'hours').add(current.Duration.minutes(),'minutes').add(current.Duration.seconds(),'seconds')
            data.push(current);
            current=null;
          }
        }
        if(current==null){
            current={
              Start:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
              End:null,
              Status:history[i].Status,
              Lat:history[i].Lat,
              Lng:history[i].Lng,
              Duration:moment(history[i].Duration,"HH:mm:ss"),
              Routes:[]
            };
        }
      }
      this.setState({datas:data},function(){
          console.log(this.state);
      });
  }

  onsearch(){
      var current=null;
      var prev=null;
      var data=[];
      for(var i=0;i<history.length;i++){
        if(current===null && prev===null){
          current={
            Start:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            End:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            Status:history[i].Status,
            Lat:history[i].Lat,
            Lng:history[i].Lng,
            //Duration:moment(history[i].Duration,"HH:mm:ss"),
            Routes:[]
          };
          //current.Duration=moment(current.End, "HH:mm:ss").diff(moment(current.Start, "HH:mm:ss"),"HH:mm:ss");
          current.Duration=moment.duration(current.End.diff(current.Start));

        }else if(prev.Status==="PARKING" && history[i].Status==="PARKING"){
          //current.End=
        }else if(prev.Status==="DRIVING" && history[i].Status==="DRIVING"){
          current.Routes.push({
            Lat:history[i].Lat,
            Lng:history[i].Lng,
            Speed:history[i].Speed,
            Date:history[i].Date
          });
          current.End=moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss');
          current.Duration=moment.duration(current.End.diff(current.Start));
        }else if(prev.Status==="PARKING" && history[i].Status==="DRIVING"){
          current.End=moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss');
          current.Duration=moment.duration(current.End.diff(current.Start));

          data.push(current);
          current={
            Start:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            End:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            Status:history[i].Status,
            Lat:prev.Lat,
            Lng:prev.Lng,
            Routes:[]
          };
          current.Routes.push({
            Lat:history[i].Lat,
            Lng:history[i].Lng,
            Speed:history[i].Speed,
            Date:history[i].Date
          });
          current.Duration=moment.duration(current.End.diff(current.Start));
        }else if(prev.Status==="DRIVING" && history[i].Status==="PARKING"){
          current.End=moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss');
          current.Duration=moment.duration(current.End.diff(current.Start));
          current.LatDest=history[i].Lat;
          current.LngDest=history[i].Lng;
          data.push(current);
          current={
            Start:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            End:moment(history[i].Date, 'MM/DD/YYYY HH:mm:ss'),
            Status:history[i].Status,
            Lat:history[i].Lat,
            Lng:history[i].Lng,
            Routes:[]
          };
          current.Duration=moment.duration(current.End.diff(current.Start));
        }
        if(i===(history.length-1)){
          data.push(current);
        }
        prev=history[i];
      }
      console.log(data);

      this.setState({datas:data},function(){
          console.log(this.state);
      });
  }
  render() {

    return (
        <div className="App">
          <div style={{ height: '100vh', width: '100%' }}>
            <GMap center={this.state.center} zoom={this.state.zoom} marker={this.state.marker} routes={this.state.routes} isMarkerShown={this.state.isMarkerShown} />
          </div>
          <div className="boxleft">
            <form>
              <DateInput label="From : " value={this.state.fromDate}  onChange={this.changeFromInput.bind(this)} />
              <DateInput label="To : " value={this.state.toDate}  onChange={this.changeToInput.bind(this)} />
                <div className="form-group row">
                  <div className="col-sm-12"><Button color="secondary" outline block><FontAwesomeIcon icon="download" /> Export To Excel</Button></div>
                </div>
                <div className="form-group row">
                  <div className="col-sm-12"><Button color="primary" block onClick={this.onsearch.bind(this)}><FontAwesomeIcon icon="search-location" /> Search</Button></div>
                </div>

            </form>

                    <DataTable datas={this.state.datas}  onParkingClick={this.onParkingClick.bind(this)} onDrivingClick={this.onDrivingClick.bind(this)}  />


          </div>
{this.state.chartData &&
          <div className="box-chart">
            <div>

              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <Button outline color="secondary"><FontAwesomeIcon icon="undo" /> Restart</Button>
                </InputGroupAddon>
                <InputGroupAddon addonType="prepend">
                  Speed
                </InputGroupAddon>
                <select>
                  <option>1X</option>
                  <option>2X</option>
                  <option>4X</option>
                </select>
                <InputGroupAddon addonType="append">
                  <Button color="primary"><FontAwesomeIcon icon="play" /> Play</Button>
                </InputGroupAddon>
              </InputGroup>



            </div>
            <div>
              <Line data={this.state.chartData} options={{maintainAspectRatio: false}} />
            </div>
          </div>
        }
        </div>


    );
  }
  render2() {


    return (
      <div className="box-chart">

      </div>
    );
  }
}

export default App;
