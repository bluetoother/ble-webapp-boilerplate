import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import EventEmitter from 'events';

import NavBar from './components/NavBar/NavBar';
import CardBlock from './components/CardBlock/CardBlock';

var title = 'ble-shepherd',
    permitJoinTime = 60,
    internalEmitter = new EventEmitter();

var rpcClient = io('http://' + window.location.hostname + ':3030');

injectTapEventPlugin();
/*********************************************/
/* App component                             */
/*********************************************/
var App = React.createClass({
    getInitialState: function () {
        return {
            devs: {},
            timeLeft: 0,
            seqNum: 0
        };
    },

    nextSeqNum: function () {
        if (this.state.seqNum > 255)
            this.setState({
                seqNum: 0
            });

        return this.state.seqNum++;
    },

    getDevs: function () {
        // [TODO]
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

        // 監聽 server 發射的 rsp 事件
        // [TODO]

        // 監聽 server 發射的 ind 事件，並使用分派器處理
        // [TODO]

        // 每次網頁刷新時向 server 端取得所有裝置資料
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
                    <CardBlock devs={{}} onClick={function(){}}/>
                </div>     
            </MuiThemeProvider>
        );
    }
});

/*********************************************/
/* render                                    */
/*********************************************/
ReactDOM.render(<App title={title} />, document.getElementById('root'));