import React from 'react';
import { Link } from 'react-router';
import reqwest from 'reqwest';
import bbox from '@turf/bbox'

import MapComponent from './Map';

const config = require('../config');
const apiRoot = config.API_URL;


class Aoi extends React.Component {
  constructor() {
    super();
    this.handleOnDrawCreate = this.handleOnDrawCreate.bind(this);
  }
 componentWillMount () {
    const component = this;
    const id = component.props.location.pathname.replace('/aois/', '');
    
    reqwest({
      url: apiRoot + '/aois/' + id,
      type: 'json',
      method: 'GET',
      error: (error) => {
        this.setState({
            done: true,
            error
        });
        console.error('error', err, msg);
      },
      success: (data) => {
        component.setState({
          aoi: data,
          id: id
        });
      }
    });

  }

   handleOnDrawCreate({ features: [feature] }) {

    switch (feature.geometry.type) {
      case 'Point':
        console.log("POINT", feature);
        this.setState({cdrawing: feature})
        break;
      default:
        console.log(feature)
      if (this.state.cdrawing) {
        const cdrawing = {
          features: [this.state.cdrawing].concat(feature),
          type: 'FeatureCollection',
        }
        this.setState({cdrawing: cdrawing})
      } else {
        this.setState({cdrawing: feature})
      }
      
    }
  }

  render () {
    const component = this;
    if (component.state && component.state.aoi) {

      const aoi = component.state.aoi[0];
      const rows = JSON.stringify(aoi);

      const landuse = aoi.analysis.landuse.map(x => {
        return (
          <tr key={x.landuse}>
            <td>{x.landuse}</td>
            <td>{x.count}</td>
            <td>{x.hectares}</td>
            <td>{x.m}</td>
          </tr>
        )
      })

      const barriers = aoi.analysis.barriers.map(x => {
        return (
          <tr key={x.barrier}>
            <td>{x.barrier}</td>
            <td>{x.count}</td>
            <td>{x.m}</td>
          </tr>
        )
      })

      const natural = aoi.analysis.natural.map(x => {
        return (
          <tr key={x.natural}>
          <td>{x.natural}</td>
          <td>{x.count}</td>
          <td>{x.hectares}</td>
          <td>{x.km}</td>
          </tr>
        )
      })

      const buildings = aoi.analysis.buildings.map(x => {
        return (
          <tr key={x.building}>
          <td>{x.building}</td>
          <td>{x.count}</td>
          <td>{x.sqm}</td>
          <td>{x.perimiter}</td>
          </tr>
        )
      })

      const highways = aoi.analysis.highways.map(x => {
        return (
          <tr key={x.highway}>
          <td>{x.highway}</td>
          <td>{x.count}</td>
          <td>{x.km}</td>
          </tr>
        )
      })

      const amenities = aoi.analysis.amenities.map(x => {
        return (
          <tr key={x.amenity}>
          <td>{x.amenity}</td>
          <td>{x.count}</td>
          </tr>
        )
      })

      let mapcontent = null;
      if (aoi.search_geo != null) {
        mapcontent = <MapComponent 
              center={[28.267822265625,-29.583011690377486]}
              bbox={bbox(aoi.search_geo)}
              geo={aoi.search_geo}
              onDrawCreate={this.handleOnDrawCreate}
              >
            </MapComponent>
      } else {
        mapcontent = ''
      }




      return (
        <div className="section">
         <div className="limiter">
          <h1 className="header-page-main">AOI {aoi.name}</h1>
          <p>{aoi.info}</p>
          <Link className="button button--primary button-section-header" to={`/aois/${component.state.id}/edit`}>Edit</Link>
          
          <div id="location" className="contain">
            <h1>Location</h1>
            <div className="container">
              { mapcontent }
            </div>
          </div>
          
          <div id="tables">
            <div className="table-section">
              <table className="table">
                <thead>
                  <tr><th>landuse</th><th>Count</th><th>hectares</th><th>perimiter (m)</th></tr>
                </thead>
                <tbody>
                  { landuse }
                </tbody>
              </table>
            </div>

            <div className="table-section">
              <table className="table">
                <thead>
                  <tr><th>Buildings</th><th>Count</th><th>SQM</th><th>Len (m)</th></tr>
                </thead>
                <tbody>
                  { buildings }
                </tbody>
              </table>
            </div>

            <div className="table-section">
            <table className="table">
              <thead>
                <tr><th>natural</th><th>Count</th><th>hectares</th><th>km</th></tr>
              </thead>
              <tbody>
                { natural }
              </tbody>
            </table>
            </div>

            <div className="table-section">
            <table className="table">
              <thead>
                <tr><th>barrier</th><th>Count</th><th>length (m)</th></tr>
              </thead>
              <tbody>
                { barriers }
              </tbody>
            </table>
            </div>
            
            <div className="table-section">
              <table className="table">
                <thead>
                  <tr><th>highway</th><th>Count</th><th>km</th></tr>
                </thead>
                <tbody>
                  { highways }
                </tbody>
              </table>
            </div>

            <div className="table-section">
              <table className="table">
                <thead>
                  <tr><th>Amenity</th><th>Count</th></tr>
                </thead>
                <tbody>
                  { amenities }
                </tbody>
              </table>
            </div>
          </div>
          

          

          
        </div>
        </div>
      );

    } else {
      return <div></div>
    }
  }
}

export default Aoi;
