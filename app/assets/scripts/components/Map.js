'use strict';
import React from 'react';
import { render } from 'react-dom';
import mapboxgl from 'mapbox-gl';
import Draw from 'mapbox-gl-draw'

import config from '../config';
mapboxgl.accessToken = config.mapbox.token;

const MapComponent = React.createClass({

  generateSourceData: function () {
    console.log(JSON.stringify(this.props.geo))
    return {
      type: 'FeatureCollection',
      features: [{
        "type": "Feature",
        "geometry": this.props.geo
      }]
    };
  },

  setupMapData: function () {
    const source = this.props.geo;

    this.map.addSource('aois', {
      'type': 'geojson',
      'data': source
    });

    this.map.addLayer({
        'id': 'aoi',
        'type': 'fill',
        'source': 'aois',
        'layout': {},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.8
        }
    });
  },

  //
  // Start life-cycle methods
  //
  componentWillMount() {

  },
  componentDidUpdate: function (prevProps) {
    // if (this.props.parameter.id !== prevProps.parameter.id) {
    //   this.setupMapData();
    // }
  },

  componentDidMount: function () {
    const {
      onDrawCreate,
      onDrawCreated,
      onDrawUpdated,
      onDrawDelete
    } = this.props;

    if (!this.props.center && !this.props.bbox) {
      throw new Error('At least center or bbox has to be provided to MapComponent');
    }

    this.map = new mapboxgl.Map({
      container: this.refs.map,
      center: this.props.center || [0, 0],
      zoom: 7,
      style: config.mapbox.baseStyle,
      maxBounds: [[-180, -84], [180, 84]]
    });

    let draw = new Draw({
        drawing: false,
        displayControlsDefault: false,
        controls: {
            // point: true,
            polygon: true,
            trash: true
        }
      });

    this.map.addControl(draw);
    if (this.props.bbox) {
      this.map.fitBounds([
        [this.props.bbox[0], this.props.bbox[1]],
        [this.props.bbox[2], this.props.bbox[3]]
      ], {padding: 20});
    }

    this.map.addControl(new mapboxgl.NavigationControl());

    if (this.props.disableScrollZoom) {
      this.map.scrollZoom.disable();
    }

    // this.map.on('draw.create', (...args) => onDrawCreate(...args));
    this.map.on('draw.create', (...args)  => onDrawCreated(draw.getAll()))

    this.map.on('draw.update', (...args)  => onDrawUpdated(draw.getAll()))
    this.map.on('draw.delete', (...args)  => onDrawDelete(draw.getAll()))

    this.map.on('load', () => {
      if (this.props.geo) {
      this.setupMapData();
    }
      // this.setupMapEvents();
      // // There is probably a better test for this if statement.
      // if (this.props.highlightLoc) {
      //   this.locationPageSetup();
      // }
    });
  },
  //
  // Start render methods
  //

  render: function () {
    return (
      <div className='map'>
        <div className='map__container' ref='map'>
          {/* Map renders on componentDidMount. */}
        </div>
        <div className='map__legend'>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = MapComponent;