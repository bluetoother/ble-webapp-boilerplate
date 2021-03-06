import React, { PropTypes } from 'react';
import TemperatureIcon from '../Icons/TemperatureIcon';

const Temperature = React.createClass({
    propTypes: {
        enable: PropTypes.bool.isRequired,
        value: PropTypes.object.isRequired,
        addr: PropTypes.string.isRequired,
        servUuid: PropTypes.string.isRequired,
        charUuid: PropTypes.string.isRequired
    },
    render: function() {
        // [TODO]
        return (
            <div style={{width: "100%", height: "100%", backgroundColor: "#F5D76E"}}>
                <div style={{float: "left", width: "50%", height: "100%"}}>
                    // [TODO]
                </div>

                <div style={{float: "left", width: "50%", height: "100%"}}>
                    <div style={{position: "absolute", top: "30%", bottom: "0", 
                                 left: "50%", right: "0", margin: "0", textAlign: "center", 
                                 fontSize: "2.2em", color: "white"}}>
                        // [TODO]
                    </div>
                </div>
            </div>
        );
    }
});

export default Temperature
