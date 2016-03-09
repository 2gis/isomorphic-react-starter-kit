require('./MyDivComponent.css');

import React from 'react';

class MyDivComponent extends React.Component {
    render() {
        return <div className="MyDivComponent">{this.props.data}</div>;
    }
}

export default MyDivComponent;
