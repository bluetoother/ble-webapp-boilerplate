var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

// Machine Server
// [TODO]
// RPC Server 啟動函式
// [TODO]
// HTTP Server 啟動函式
// [TODO]

// 載入溫控系統應用
// [TODO]

// 新增 central 實例
// [TODO]

var rpcServer,
    httpServer;

function start () {
    var dbPath = path.resolve(__dirname, '../node_modules/ble-shepherd/lib/database/ble.db');
    fs.exists(dbPath, function (isThere) {
        if (isThere) { fs.unlink(dbPath); }
    });

    showWelcomeMsg();
    setLeaveMsg();

    // 依序啟動 Machine Server, RPC Server 和 HTTP Server
    // [TODO]  

    // 需要轉接 Machine Server 的事件至 Web Client 端
    // [TODO]
}


/**********************************************/
/* RPC Client Request Handler                 */
/**********************************************/
// 實作 Web Client 請求事件的處理函式, 
function clientReqHdlr (msg) {
    // [TODO]
}

/**********************************************/
/* Machine Server Event Handler               */
/**********************************************/
function errorEvtHdlr (err) {
    console.log(chalk.red('[         error ] ') + err.message);
    rpcServer.emit('error', { msg: err.message });
}

// 轉發 permitJoining 事件至 Web Client 端
function permitJoiningEvtHdlr (timeLeft) {
    console.log(chalk.green('[ permitJoining ] ') + timeLeft + ' sec');

    // [TODO]
}

// ind 事件為周邊裝置相關的所有事件，使用分派器處理
function indEvtHdlr (msg) {
    // [TODO]
}

/**********************************************/
/* Peripheral Event Handler               */
/**********************************************/
function devIncomingHdlr (devInfo) {
    console.log(chalk.yellow('[   devIncoming ] ') + '@' + devInfo.addr);
    
    // [TODO]
}

function devStatusHdlr (devInfo, status) {
    if (devInfo.status === 'disc') return;

    if (status === 'online')
        status = chalk.green(status);
    else 
        status = chalk.red(status);

    // [TODO]
} 

function attChangeHdlr (devInfo, charInfo) {
    var oid = bipso.uo(charInfo.cid.uuid),
        value;

    if (oid === 'temperature') value = charInfo.value.sensorValue.toFixed(2);
    if (oid === 'pwrCtrl') value = charInfo.value.onOff;
    if (value)
        console.log(chalk.blue('[   attrsChange ] ') + '@' + devInfo.addr + 
            ', type: ' + oid + ', value: ' + value);
    
    // [TODO]
}

/**********************************/
/* welcome function               */
/**********************************/
function showWelcomeMsg() {
var blePart1 = chalk.blue('       ___   __    ____      ____ __ __ ____ ___   __ __ ____ ___   ___ '),
    blePart2 = chalk.blue('      / _ ) / /   / __/____ / __// // // __// _ \\ / // // __// _ \\ / _ \\'),
    blePart3 = chalk.blue('     / _  |/ /__ / _/ /___/_\\ \\ / _  // _/ / ___// _  // _/ / , _// // /'),
    blePart4 = chalk.blue('    /____//____//___/     /___//_//_//___//_/   /_//_//___//_/|_|/____/ ');

    console.log('');
    console.log('');
    console.log('Welcome to ble-shepherd webapp... ');
    console.log('');
    console.log(blePart1);
    console.log(blePart2);
    console.log(blePart3);
    console.log(blePart4);
    console.log(chalk.gray('         A network server and manager for the BLE machine network'));
    console.log('');
    console.log('   >>> Author:     Hedy Wang (hedywings@gmail.com)');
    console.log('   >>> Version:    ble-shepherd v1.0.0');
    console.log('   >>> Document:   https://github.com/bluetoother/ble-shepherd');
    console.log('   >>> Copyright (c) 2016 Hedy Wang, The MIT License (MIT)');
    console.log('');
    console.log('The server is up and running, press Ctrl+C to stop server.');
    console.log('');
    console.log('---------------------------------------------------------------');
}

/**********************************/
/* goodBye function               */
/**********************************/
function setLeaveMsg() {
    process.stdin.resume();

    function showLeaveMessage() {
        console.log(' ');
        console.log(chalk.blue('      _____              __      __                  '));
        console.log(chalk.blue('     / ___/ __  ___  ___/ /____ / /  __ __ ___       '));
        console.log(chalk.blue('    / (_ // _ \\/ _ \\/ _  //___// _ \\/ // // -_)   '));
        console.log(chalk.blue('    \\___/ \\___/\\___/\\_,_/     /_.__/\\_, / \\__/ '));
        console.log(chalk.blue('                                   /___/             '));
        console.log(' ');
        console.log('    >>> This is a simple demonstration of how the shepherd works.');
        console.log('    >>> Please visit the link to know more about this project:   ');
        console.log('    >>>   ' + chalk.yellow('https://github.com/bluetoother/ble-shepherd'));
        console.log(' ');
        process.exit();
    }

    process.on('SIGINT', showLeaveMessage);
}



module.exports = start;