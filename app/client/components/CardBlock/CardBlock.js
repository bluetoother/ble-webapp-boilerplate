import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import GridLayout from 'react-grid-layout';
import {WidthProvider} from 'react-grid-layout';
import bipso from 'bipso';

import {Temperature, Relay} from '../Card/Card';

var ReactGridLayout = WidthProvider(GridLayout);

var keyCounter,
    layoutDataGrids;

var CardBlock = React.createClass({
    propTypes: {
        devs: PropTypes.object.isRequired
    },

    getCard: function (addr, status, servUuid, charUuid, value) {
        var type = bipso.uo(charUuid), 
            enable,
            card,
            cardProps = {};

        enable = (status === 'online') ? true : false;

        switch (type) {
            case 'temperature':
                // [TODO]
                break;
            case 'pwrCtrl':
                // [TODO]
                break;
            default:
                return;
        }

        return (
            <div key={cardProps.key} data-grid={cardProps.dataGrid}>
                {card}
            </div>
        );
    },

    getRowHeight: function () {
        var rowHeight;

        if (window.matchMedia("(min-width: 1800px)").matches) {
            rowHeight = 70;
        } else if (window.matchMedia("(min-width: 1400px)").matches) {
            rowHeight = 60;
        } else if (window.matchMedia("(min-width: 1000px)").matches) {
            rowHeight = 45;
        } else if (window.matchMedia("(min-width: 600px)").matches) {
            rowHeight = 35;
        } else {
            rowHeight = 20;
        }

        return rowHeight;
    },

    render: function () {
        var self = this,
            allCards = [],
            rowHeight = this.getRowHeight(),
            devs = this.props.devs;

        // 遍歷 device 中的所有 Characteristic，獲取相關資訊
        for (var addr in devs) {
            var devInfo = devs[addr];
            devInfo.servList.forEach(function (servInfo) {
                servInfo.charList.forEach(function (charInfo) {
                    // [TODO]
                });
            });    
        }        

        return (
            <div style={{margin:'1% 0%'}}>
                <ReactGridLayout cols={9} rowHeight={rowHeight} isDraggable={false}>
                    {allCards}
                </ReactGridLayout>
            </div>
        );
    }
});

export default CardBlock