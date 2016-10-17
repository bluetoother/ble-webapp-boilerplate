import React, { PropTypes } from 'react';
import FanOffIcon from '../Icons/FanOffIcon'

var csshake = require('../../styles/csshake.css');

var fgColor = "#FFF",
    bgColor = '#8ED4E8',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FFF",
    fgColorOff = "#FFF";

const Fan = React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        permAddr: PropTypes.string.isRequired,
        auxId: PropTypes.string.isRequired,
        onOff: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired
    },

    render: function () {
        let enable = this.props.enable;
        let onOff = this.props.onOff;
        let onClick = enable ? this.props.onClick : function () {
            return null;
        };

        let cardBgColor = enable ? bgColor : bgColorDisabled;
        let cardFgColor = enable ? (onOff ? fgColorOn : fgColorOff) : fgColorDisabled;

        let reallyOn = enable && onOff;
        let icon = reallyOn ? <FanOffIcon fill={cardFgColor} /> : <FanOffIcon fill={cardFgColor} />;
        let shakeClass = reallyOn ? csshake['shake-rotate'] + ' ' + csshake['shake-constant'] + ' ' + csshake['shake-constant--hover'] : '';

        return (
            <div className={shakeClass} 
                 style={{width: '100%', height: '100%', backgroundColor: cardBgColor }} 
                 onClick={onClick(this.props.permAddr, this.props.auxId, !onOff)} >
                {icon}
            </div>
        );
    }
});

export default Fan
