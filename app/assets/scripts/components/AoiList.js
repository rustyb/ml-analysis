import React, {PropTypes as T} from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import reqwest from 'reqwest';


const config = require('../config');
const apiRoot = config.API_URL;

class AoiList extends React.Component {
  // static contextTypes = {
  //   router: T.object
  // }

  componentWillMount () {
    const component = this;
    reqwest({
        url: apiRoot + '/aois',
        type: 'json',
        method: 'GET',
        error: (error) => {
          this.setState({
              done: true,
              error
          });
        },
        success: (data) => {
          component.setState({
            aois: data
          });
        }
    });
  }

  render () {
    const component = this;
    if (!component.state) {
      return (<div></div>);
    }
    const {aois} = component.state;
    const aoiItems = aois.map((item) => {
      return (
        <tr key={item.id}>
          <td><Link to={`/aois/${item.id}`}>{item.name}</Link></td>
          <td>{item.owner}</td>
          <td>{item.info}</td>
          <td>{moment(item.updated_at).format('YYYY-MM-DD')}</td>
          <td>{moment(item.created_at).format('YYYY-MM-DD')}</td>
        </tr>
      );
    }).filter((item, i) => {
      // filter out items if we have a limit
      return component.props.limit ? i < component.props.limit : true;
    });

    return (
      <div className="section">
        <div className="limiter">
        <h2 className="header-page-main">Recently Added areas of interest</h2>
        <Link to='aois/new' className="button button--primary button-section-header button--small">Create an AOI</Link>
        <Link to='aois' className="button button--primary button-section-header button--small">View All</Link>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Info</th>
              <th>Updated</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {aoiItems}
          </tbody>
        </table>
        </div>
      </div>
    );
  }
}

export default AoiList;