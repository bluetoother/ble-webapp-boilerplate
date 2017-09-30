import React, { PropTypes } from 'react';
import RelayOnIcon from '../Icons/RelayOnIcon';
import RelayOffIcon from '../Icons/RelayOffIcon';

const Relay = React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        value: PropTypes.object.isRequired,
        onClick: PropTypes.func.isRequired,
        addr: PropTypes.string.isRequired,
        servUuid: PropTypes.string.isRequired,
        charUuid: PropTypes.string.isRequired
    },
    render: function () {
        let icon = this.props.onOff ? <RelayOnIcon /> : <RelayOffIcon />;
        // [TODO]
        
        return (
            <div style={{width: '100%', height: '100%', backgroundColor: '#72E599'}}>
                // [TODO]
            </div>
        );
    }

});

export default Relay