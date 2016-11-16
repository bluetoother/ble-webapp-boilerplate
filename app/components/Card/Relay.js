import React, { PropTypes } from 'react';
import PlugOnIcon from '../Icons/PlugOnIcon';
import PlugOffIcon from '../Icons/PlugOffIcon';

const Relay = React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        onOff: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        permAddr: PropTypes.string.isRequired,
        auxId: PropTypes.string.isRequired,
    },
    render: function () {
        let enable = !!this.props.enable;
        let onOff = !!this.props.onOff;
        let onClick = enable ? this.props.onClick : function () {
            console.log('Relay clicked');
        };

        // background color 與 fg color 會根據裝置的網路連線狀態有所不同
        // [TODO]

        // icon 會根據裝置的開關狀態有所不同
        // [TODO]

        return (
            // [TODO]
        );
    }
});

export default Relay;
