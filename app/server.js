var http = require('http');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var _ = require('busyman');
var BleShepherd = require('ble-shepherd');
var sivannRelayPlugin = require('bshep-plugin-sivann-relay');
var sivannWeatherPlugin = require('bshep-plugin-sivann-weatherstation');

var ioServer = require('./helpers/ioServer');

var central = new BleShepherd('noble'); 
var server = http.createServer();

server.listen(3030);
ioServer.start(server);

central.support('sivannRelay', sivannRelayPlugin);
central.support('sivannWeather', sivannWeatherPlugin);

var relay, weatherStation;

function serverApp () {
    // show Welcome Msg               
    showWelcomeMsg();

    // set Leave Msg
    setLeaveMsg();

    // register Req handler
    ioServer.regReqHdlr('getDevs', function (args, cb) { 
        var devs = {};

        _.forEach(central.list(), function (devInfo) {
            devs[devInfo.addr] = cookRawDev(central.find(devInfo.addr));
        });

        cb(null, devs);
    });

    ioServer.regReqHdlr('permitJoin', function (args, cb) { 
        central.permitJoin(args.time);
        cb(null, args);
    });

    ioServer.regReqHdlr('write', function (args, cb) { 
        var dev = central.find(args.permAddr),
            uuids = args.auxId.split('.'),
            sid = uuids[0],
            cid = _.parseInt(uuids[2]),
            gad = dev.dump(sid, cid);

        gad.value[getGadProp(gad).valueName] = args.value;

        dev.write(sid, cid, gad.value, function (err) {
            if (err)
                cb(err);
            else
                cb(null, args.value);
        });
    });

    // start ble-shepherd
    var dbPath = path.resolve(__dirname, '../node_modules/ble-shepherd/lib/database/ble.db');
    fs.exists(dbPath, function (isThere) {
        if (isThere) { fs.unlink(dbPath); }
    });

    central.start(); 

    // event listeners
    central.on('ready', function () {
        bleApp();
        readyInd();
    });

    central.on('permitJoining', function (timeLeft) {
        permitJoiningInd(timeLeft);
    });

    central.on('error', function (err) {
        errorInd(err.message);
    });

    central.on('ind', function (msg) {
        var dev = msg.periph;

        switch (msg.type) {
            /*** devIncoming      ***/
            case 'devIncoming':
                devIncomingInd(cookRawDev(dev));
                break;

            /*** devStatus        ***/
            case 'devStatus':
                devStatusInd(dev.addr, msg.data);
                break;

            /*** attrsChange      ***/
            case 'attChange':
                var sid = msg.data.sid,
                    cid = msg.data.cid,
                    gad = dev.dump(sid.uuid, cid.handle),
                    gadInfo = getGadProp(gad);

                if (!gadInfo) return;
         
                valueName = gadInfo.valueName;

                if (!_.isNil(valueName) && !_.isNil(msg.data.value[valueName])) 
                    attrsChangeInd(dev.addr, cookRawGad(gad, sid.uuid));
                
                break;
        }
    });

    
}

function bleApp () {
    var blocker = central.blocker;
    
    blocker.enable('white');
    blocker.unblock('0xd05fb820ceef');
    blocker.unblock('0x20c38ff19403');

    // central.permitJoin(60);

    central.on('ind', function (msg) {
        var dev = msg.periph;
        
        switch (msg.type) {
            case 'devIncoming':
                // 裝置加入網路
                // 你可以開始操作入網裝置        
                if (dev.name === 'sivannRelay') {
                	relay = dev;
                }

                if (dev.name === 'sivannWeather') {
                    // 將 weather station 裝置指定到 weatherStation 變數
                    weatherStation = dev;
                    
                    // 當 weather station 入網時，讀取當下溫度值
               		weatherStation.read('0xbb80', '0xcc07', function (err, data) {
                        console.log('Temperature value: ' + data.sensorValue);
                    });

             		// 讓 weather station 定時回報溫度值
                    weatherStation.configNotify('0xbb80', '0xcc07', true, function (err) {
                        console.log('setting success');
                    });
                    
             		// 為回報溫度的 characteristic 註冊一隻處理函式
                    weatherStation.onNotified('0xbb80', '0xcc07', tempChangedHdlr); 
                }
                break;
        }
    });
}

function tempChangedHdlr (data) {
    // 若 relay 尚未入網，則不做任何事
    if (!relay)
        return;

    var relayValue = relay.dump('0xbb40', '0xcc0e').value;

    if (data.sensorValue > 28) {
        // 當溫度過高，則開啟 relay
        relayValue.onOff = true;
        relay.write('0xbb40', '0xcc0e', relayValue);
    } else if (data.sensorValue < 26) {
        // 當溫度過低，則開啟 relay
        relayValue.onOff = false;
        relay.write('0xbb40', '0xcc0e', relayValue);
    }
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
/* Indication funciton            */
/**********************************/
function readyInd () {
    ioServer.sendInd('ready', {});
    console.log(chalk.green('[         ready ] '));
}

function permitJoiningInd (timeLeft) {
    ioServer.sendInd('permitJoining', { timeLeft: timeLeft });
    console.log(chalk.green('[ permitJoining ] ') + timeLeft + ' sec');
}

function errorInd (msg) {
    ioServer.sendInd('error', { msg: msg });
    console.log(chalk.red('[         error ] ') + msg);
}

function devIncomingInd (dev) {
     ioServer.sendInd('devIncoming', { dev: dev });
    console.log(chalk.yellow('[   devIncoming ] ') + '@' + dev.permAddr);
}

function devStatusInd (permAddr, status) {
    ioServer.sendInd('devStatus', { permAddr: permAddr, status: status });

    if (status === 'online')
        status = chalk.green(status);
    else 
        status = chalk.red(status);

    console.log(chalk.magenta('[     devStatus ] ') + '@' + permAddr + ', ' + status);
}

function attrsChangeInd (permAddr, gad) {
    ioServer.sendInd('attrsChange', { permAddr: permAddr, gad: gad });
    console.log(chalk.blue('[   attrsChange ] ') + '@' + permAddr + ', auxId: ' + gad.auxId + ', value: ' + gad.value);
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
            prop.name = 'Fan';
            prop.valueName = 'onOff';
            break;

        default:
            return;
    }

    return prop;
}

module.exports = serverApp;