import React, { PropTypes } from 'react';
import TemperatureIcon from '../Icons/TemperatureIcon';

var bgColor = "#F5D76E",
    bgColorDisabled = "#BDBDBD";

const Temperature = React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        temp: PropTypes.number.isRequired
    },
    render: function() {
        let enable = !!this.props.enable;

        // background color 會根據裝置的網路連線狀態有所不同
        // [TODO]

        // 原件上的感測值會根據裝置的網路連線狀態決定是否顯示
        // [TODO]

        return (
            <div style={{width: "100%", height: "100%", backgroundColor: cardBgColor}}>
                <div style={{float: "left", width: "50%", height: "100%"}}>
                    <div style={{position: "relative", top: "15%", left: "15%", width: "70%", height: "70%"}}>
                        // [TODO]
                    </div>
                </div>

                <div style={{float: "left", width: "50%", height: "100%"}}>
                    <div style={{position: "absolute", top: "30%", bottom: "0", left: "50%", right: "0", margin: "0", textAlign: "center", fontSize: "2.2em", color: "white"}}>
                        // [TODO]
                    </div>
                </div>
            </div>
        );
    }
});

export default Temperature
