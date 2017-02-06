import React, { PropTypes as T } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
// import Joi from 'joi';
import reqwest from 'reqwest';

import MapComponent from './Map';
import Notifications from './notifications';

const config = require('../config');
const apiRoot = config.API_URL;



class NewAoi extends React.Component {
  static contextTypes = {
      router: T.object
    };

  constructor(props) {
    super(props);
    
    this.state = {
      loading: false,
      name: '',
      owner: '',
      info: '',
      geo: '',
      notification: { type: null, message: null },
      message: ''
    };
    // this.handleOnDrawCreate = this.handleOnDrawCreate.bind(this);
    this.handleOnDrawCreated = this.handleOnDrawCreated.bind(this);
    this.handleOnDrawUpdated = this.handleOnDrawUpdated.bind(this);
    this.handleOnDrawDeleted = this.handleOnDrawDeleted.bind(this);
    this.dismissNotification = this.dismissNotification.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    // Come back and add in valdation again another day.
    // this.validatorTypes = {
    //   name: Joi.string().label('Name').required(),
    //   owner:  Joi.string().label('Owner').required(),
    //   info: Joi.string().label('Extra Info')
    // }
  }
  

  handleOnDrawCreate({ features: [feature] }) {
    console.log(feature);
    switch (feature.geometry.type) {
      case 'Point':
        console.log("POINT", feature);
        this.setState({geo: feature})
        break;
      case 'Polygon':
        console.log("Polygon", feature);
        this.setState({geo: feature})
        break;
      default:
        console.log(feature)
      
    }
  }

  onValueChange (event) {
    var data = {};
    data[event.target.name] = event.target.value;
    this.setState(data);
  }
  
  handleSubmit(e){
    e.preventDefault()
    const component = this;
    // component.dismissNotification();

    let data = {
      name: this.state['name'],
      owner: this.state['owner'],
      info: this.state['info'],
      geo: this.state['geo']
    }

    console.log('DATA: ', data)
    
    if (!data.name || !data.owner || !data.info || !data.geo) {
      return component.onNotificationShow('error', "You haven't filled in all the fields" );
    }

    if (data.name == "" || data.person  == "" || data.info == "" ) {
      console.log('You haven\'t filled in all the fields')
      component.setState({ message: "You haven\'t filled in all the fields" });
      component.onNotificationShow('error', "Missing data" );
    }

    if (!this.state.geo || this.state.geo.features.length === 0) {
      component.setState({ message: "You must draw an area to analyse" });
      component.onNotificationShow('error', "You must draw an area to analyse" )
    }

    if (this.state.geo.features.length > 1) {
      component.onNotificationShow('error', "You can only draw one polygon." )
    }

    this.setState({loading: true});

    component.onNotificationShow('info', ( <span>Begin processing</span>))
    // console.log(JSON.stringify(data));
    reqwest({
      url: `${apiRoot}/aois`, 
      method: 'post', 
      type: 'json', 
      contentType: 'application/json', 
      data: JSON.stringify(data)
    }).then((resp) => {
      component.onNotificationShow('success', ( <span>Processing done! <a href={'#/aois/' + resp.id}>View Report</a></span>))
      if (resp.id) {
        component.context.router.push(`/aois/${resp.id}`);
        // component.props.history.push(`/aois/${resp.id}`);
      }
      console.log('boom success');
      this.setState({loading: false});

    }).fail(function (err, msg) {
      console.error('error', err, msg);
      component.onNotificationShow('error', msg )
    });

  }

  handleOnDrawCreated(features) {
    console.log(features);
    this.setState({geo: features})
  }

  handleOnDrawUpdated(features) {
    console.log(features);
    this.setState({geo: features})
  }

  handleOnDrawDeleted(features) {
    console.log(features);
    this.setState({geo: features})
  }

  onNotificationShow(type, message) {
    this.setState({
      notification: { type: type, message: message }
    });
  }

  dismissNotification(time) {
    if (!time) {
      time = 0;
    }

    // setTimeout(function () {
    //   this.setState({
    //     notification: { type: null, message: null }
    //   });
    // }.bind(this), time);
  }

  render() {
    let component = this;
    return (
      <div className="section">
        <div id="location"  className="limiter contain">
          <h2>Create a new area of intertest</h2>
          <div className="col4 p1">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <span className='message-error'>{this.state.message}</span>
            <fieldset className="form__fieldset">
              <legend className="form__legend">Analysis Details</legend>
              <div className="form__group">
                <label className="form__label">Area Name</label>
                <input type="text" name="name" onChange={this.onValueChange} value={this.state['name']} className="form__control form__control--medium" id="form-name" ref="name" placeholder="This will help you find it later" required=""/>
              </div>
              <div className="form__group">
                <label className="form__label">Your name</label>
                <input type="text" name="owner" onChange={this.onValueChange} value={this.state['owner']} className="form__control form__control--medium" id="form-name" ref="owner" placeholder="So we can keep track of who's doing this" required="" />
              </div>
              <div className="form__group">
                <label className="form__label">Any other info?</label>
                <textarea className="form__control" name="info" onChange={this.onValueChange} value={this.state['info']} ref="info" id="form-textarea-1" rows="4" placeholder="Use this to add some notes about your purpose for doing this." required=""></textarea>
              </div>
              <input type='submit' value='Start Analysis' className='button button--primary-bounded'  />
            </fieldset>
          </form>
          </div>

          <div className="container">
            <MapComponent 
                center={[28.267822265625,-29.583011690377486]}
                
                onDrawCreated={this.handleOnDrawCreated}
                onDrawUpdated={this.handleOnDrawUpdated}
                onDrawDelete={this.handleOnDrawDeleted}
                >
              </MapComponent>
          </div>
        </div>
        <Notifications type={this.state.notification.type} onNotificationDismiss={this.dismissNotification}>{this.state.notification.message}</Notifications>
        {this.state.loading ? <p className='loading revealed'>Loading</p> : null}
      </div>
    );
  }

}

export default NewAoi;
