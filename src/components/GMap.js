 /* global google */
import React, { Component } from 'react';
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} = require("react-google-maps");


//
//const MyMapComponent = withScriptjs(withGoogleMap((props) =>/
//  <GoogleMap
//    defaultZoom={15}
//    defaultCenter={{ lat: 37.78352, lng:-121.22567 }}
//    center={props.center}
//    zoom={props.zoom}
//  >
//    {props.isMarkerShown && <Marker position={props.marker} />}
//  </GoogleMap>
//))
const MyMapComponent = compose(

  withProps({
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      this.props.onRef(this)
    },
    componentWillUnmount() {
      this.props.onRef(undefined)
    },
    renderRoutes() {
      console.log('componentDidUpdate');

      if(this.props.routes.length>1){
        const DirectionsService = new google.maps.DirectionsService();
        DirectionsService.route({
          origin:{lat:this.props.routes[0].Lat,lng:this.props.routes[0].Lng},
          destination: {lat :this.props.routes[this.props.routes.length-1].Lat, lng:this.props.routes[this.props.routes.length-1].Lng},
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            console.log(result);
            this.setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        });
      }else{
        this.setState({
          directions: null,
        });
      }

    }
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={{lat:41.8507300, lng:-87.6512600}}
    center={props.center}
    zoom={props.zoom}

  >
    {props.directions && <DirectionsRenderer directions={props.directions} options={{suppressMarkers: true}} />}
    {props.isMarkerShown && <Marker position={props.marker} />}
  </GoogleMap>
);

class GMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11,
    routes:[]
  };
  constructor(props) {
    super(props);
    this.MapComponent = React.createRef();
  }
  componentDidUpdate() {
    this.MapComponent.renderRoutes();
  }
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
      <MyMapComponent
        onRef={ref => (this.MapComponent = ref)}
        isMarkerShown={this.props.isMarkerShown}
        marker={this.props.marker}
        center={this.props.center}
        zoom={this.props.zoom}
        routes={this.props.routes}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAO591CAzXPaz3GtVDHe_PwaqPIkDqXgIQ&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      </div>
    );
  }
}

export default GMap;
