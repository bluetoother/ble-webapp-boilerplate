import React, { PropTypes } from 'react';
import PlugOnIcon from '../Icons/PlugOnIcon';
import PlugOffIcon from '../Icons/PlugOffIcon';

var fgColor = "#FFF",
    bgColor = '#72E599',
    fgColorDisabled = "#EEEEEE",
    bgColorDisabled = "#BDBDBD",
    fgColorOn = "#FFF",
    fgColorOff = "#FFF";

const Plug = ({ enable, onOff, onClick }) => {
    enable = !!enable;
    onOff = !!onOff;
    onClick = enable ? onClick || function () {
        console.log('Plug clicked');
    } : null;

    let cardBgColor = enable ? bgColor : bgColorDisabled;
    let cardFgColor = enable ? (onOff ? fgColorOn : fgColorOff) : fgColorDisabled;

    let reallyOn = enable && onOff;
    let icon = reallyOn ? <PlugOnIcon fill={cardFgColor} /> : <PlugOffIcon fill={cardFgColor} />;

    return (
        <div style={{width: '100%', height: '100%', backgroundColor: cardBgColor }} onClick={onClick}>
            {icon}
        </div>
    );
}

Plug.propTypes = {
    enable: PropTypes.bool.isRequired,
    onOff: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Plug
