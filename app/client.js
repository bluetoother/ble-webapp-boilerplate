import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import io from 'socket.io-client';

import NavBar from './components/NavBar/NavBar';
import CardBlock from './components/CardBlock/CardBlock';

var title = 'ble-shepherd',
    permitJoinTime = 60;

var rpcClient = io('http://' + window.location.hostname + ':3030');


/*********************************************/
/* App component                             */
/*********************************************/
var App = React.createClass({
    getInitialState: function () {
        return {
            devs: {},
            timeLeft: 0
        };
    },

    permitJoiningHdlr: function (data) {
        // [TODO]
    },

    devIncomingHdlr: function (data) {
        // [TODO]
    },

    devStatusHdlr: function (data) {
        // [TODO]
    },

    attChangeHdlr: function (data) {
        // [TODO]
    },

    componentDidMount: function () {
        var self = this;

        // 監聽 server 發射的 ind 事件，並使用分派器處理
        // [TODO]
    },

    // 需傳入 PERMITJOIN 按鈕的 callback
    onPermitCallback: function () {
        // [TODO]
    },

    onWriteCallback: function (addr, sid, cid, value) {
        // [TODO]
    },

    render: function () {
        return (
            <MuiThemeProvider>
                <div>
                    <NavBar title={this.props.title} timeLeft={0} onClick={function(){}}  />
                    <CardBlock devs={{}}/>
                </div>     
            </MuiThemeProvider>
        );
    }
});

/*********************************************/
/* render                                    */
/*********************************************/
ReactDOM.render(<App title={title} />, document.getElementById('root'));