import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import styledMapType from './map_style';
import MarkerManager from '../../../util/marker_manager';



class SearchMap extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let _mapOptions = {
      center: {lat: this.props.bounds.center_lat || 41.9028,
        lng: this.props.bounds.center_lng || 12.4964},
      zoom: 13,
    };
    this.map = new google.maps.Map(this.mapNode, _mapOptions);
    if (this.props.bounds.southWest) {
      let latLngBounds = new google.maps.LatLngBounds(new google.maps.LatLng({lat: this.props.bounds.southWest.lat, lng: this.props.bounds.southWest.lng }),
      new google.maps.LatLng({lat: this.props.bounds.northEast.lat, lng: this.props.bounds.northEast.lng }));
      this.map.fitBounds(latLngBounds);
    }
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');
    this.MarkerManager = new MarkerManager(this.map);
    this._registerListeners();
    this.MarkerManager.updateMarkers(this.props.spots);
  }

  componentDidUpdate() {
    this.MarkerManager.updateMarkers(this.props.spots);
  }

  _registerListeners() {
    let address_function = () => this.props.bounds.address || "";
    google.maps.event.addListener(this.map, 'idle', () => {
      const { north, south, east, west } = this.map.getBounds().toJSON();
      const address = address_function();
      const bounds = {
        address,
        northEast: { lat: north, lng: east },
        southWest: { lat: south, lng: west } };
      this.props.fetchSearchSpots({bounds: bounds,
        start_date: this.props.start_date,
        end_date: this.props.end_date});
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.bounds === "") {
      return;
    } else if (nextProps.bounds.address && this.props.bounds.address !== nextProps.bounds.address) {
      let latLngBounds = new google.maps.LatLngBounds(new google.maps.LatLng({lat: nextProps.bounds.southWest.lat, lng: nextProps.bounds.southWest.lng }),
        new google.maps.LatLng({lat: nextProps.bounds.northEast.lat, lng: nextProps.bounds.northEast.lng }));
      this.map.fitBounds(latLngBounds);
    }
  }


  render() {
    return <div className="map" ref={ map => this.mapNode = map }>Map</div>;
  }
}

export default withRouter(SearchMap);
