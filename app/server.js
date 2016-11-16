var http = require('http');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var _ = require('busyman');
var BleShepherd = require('ble-shepherd');

// 使用 ioServer 作為與 Web Client 溝通的介面
// [TODO]
// 溫控系統的應用程式
// [TODO]

// 建立 central
// [TODO]
// 建立 HTTP Server
// [TODO]

server.listen(3030);

// 啟動 ioServer
// [TODO]


function serverApp () {
    // show Welcome Msg               
    showWelcomeMsg();

    // set Leave Msg
    setLeaveMsg();

    // register Req handler
    // 註冊 permitJoin 處理函式
    ioServer.regReqHdlr('permitJoin', function (args, cb) { 
        // [TODO]
    });

    // 註冊 getDevs 處理函式
    ioServer.regReqHdlr('getDevs', function (args, cb) { 
        // [TODO]
    });

    ioServer.regReqHdlr('write', function (args, cb) { 
        // [TODO]
    });

    // event listeners
    central.on('ready', function () {
        console.log(chalk.green('[         ready ] '));

        // 當 ble-shepherd 啟動完畢，執行溫控應用
        // [TODO]
    });

    // 監聽 permitJoining 事件，並轉發至 Client端
    central.on('permitJoining', function (timeLeft) {
        console.log(chalk.green('[ permitJoining ] ') + timeLeft + ' sec');

        // [TODO]
    });

    central.on('error', function (err) {
        console.log(chalk.red('[         error ] ') + err.message);
    });

    central.on('ind', function (msg) {
        var dev = msg.periph;
        
        switch (msg.type) {
            /*** devIncoming      ***/
            // 監聽 devIncoming 事件，並轉發至 Client端
            case 'devIncoming':
                console.log(chalk.yellow('[   devIncoming ] ') + '@' + dev.addr);

                // [TODO]
                break;

            /*** devStatus        ***/
            // 監聽 devStatus 事件，並轉發至 Client端
            case 'devStatus':
                var status = msg.data;

                if (status === 'online')
                    status = chalk.green(status);
                else 
                    status = chalk.red(status);

                console.log(chalk.magenta('[     devStatus ] ') + '@' + dev.addr + ', ' + status);

                // [TODO]
                break;

            /*** attrChange      ***/
            case 'attChange':
                // [TODO]                
                break;
        }
    });

    // 清除 ble-shepherd 資料庫中的檔案
    var dbPath = '../node_modules/ble-shepherd/lib/database/ble.db';

    dbPath = path.resolve(__dirname, dbPath);
    fs.exists(dbPath, function (isThere) {
        if (isThere) { fs.unlink(dbPath); }
    });

    // 啟動 ble-shepherd
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

/**********************************/
/* Cook funciton                  */
/**********************************/
function cookRawDev (dev) {
    var cooked = {
            permAddr: dev.addr,
            status: dev.status,
            gads: {}
        };

    _.forEach(dev.dump().servList, function (serv) {
        _.forEach(serv.charList, function (char) {
            var cookedGad = cookRawGad(char, serv.uuid);

            if (!_.isNil(cookedGad)) {
                cooked.gads[cookedGad.auxId] = cookedGad;
                if (dev._controller)
                    dev.configNotify(serv.uuid, char.handle, true);
            }
        });
    });

    return cooked;
}

function cookRawGad (gad, sid) {
    var cooked = {
            type: null,
            auxId: null,
            value: null
        },
        gadInfo = getGadProp(gad),
        gadValue;

    if (!gadInfo) return;

    gadValue = gad.value[gadInfo.valueName];

    if (_.isNumber(gadValue))
        gadValue = Math.round(gadValue);

    cooked.type = gadInfo.name;
    cooked.auxId = sid + '.' + gad.uuid + '.' + gad.handle;
    cooked.value = gadValue;

    return cooked;
}

function getGadProp (gad) {
    var prop = {
            name: null,
            valueName: null
        };

    switch (gad.uuid) {
        case '0xcc07':
            prop.name = 'Temperature';
            prop.valueName = 'sensorValue';
            break;
        case '0xcc0e':
            prop.name = 'Relay';
            prop.valueName = 'onOff';
            break;

        default:
            return;
    }

    return prop;
}

module.exports = serverApp;