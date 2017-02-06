import React from 'react';

import AoiList from './AoiList';

class Index extends React.Component {

  render () {
    return (
      <div className="section">
        <div className="limiter">
          <p className="prose prose--responsive">
            Welcome to the MapLesotho analysis box. 
            Below you can explore the areas of interest already analyised. 
            They're handly organised by date. As we all know we hate stale data ;).</p>
          <AoiList limit={20} />
        </div>
      </div>
    );
  }
}

export default Index;