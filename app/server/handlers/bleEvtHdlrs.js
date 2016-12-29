var chalk = require('chalk'),
    bipso = require('bipso');

var bleEvtHdlrs = {
    error: errorEvtHdlr,
    permitJoining: permitJoiningEvtHdlr,
    ind: indEvtHdlr
};

/**********************************************/
/* BLE Machine Server Event Handler           */
/**********************************************/
function errorEvtHdlr (rpcServer, err) {
    console.log(chalk.red('[         error ] ') + err.message);
    rpcServer.emit('error', { msg: err.message });
}

// 轉發 permitJoining 事件至 Web Client 端
function permitJoiningEvtHdlr (rpcServer, timeLeft) {
    console.log(chalk.green('[ permitJoining ] ') + timeLeft + ' sec');

    // [TODO]
}

// ind 事件為周邊裝置相關的所有事件，使用分派器處理
function indEvtHdlr (rpcServer, msg) {
    // [TODO]
}

/**********************************************/
/* Peripheral Event Handler                   */
/**********************************************/
function devIncomingHdlr (rpcServer, devInfo) {
    console.log(chalk.yellow('[   devIncoming ] ') + '@' + devInfo.addr);
    
    // [TODO]
}

function devStatusHdlr (rpcServer, devInfo, status) {
    if (status === 'online')
        status = chalk.green(status);
    else 
        status = chalk.red(status);

    console.log(chalk.magenta('[     devStatus ] ') + '@' + devInfo.addr + ', ' + status);

    if (devInfo.status === 'disc') return;

    // [TODO]
} 

function attChangeHdlr (rpcServer, devInfo, charInfo) {
    var oid = bipso.uo(charInfo.cid.uuid),
        value;

    if (oid === 'temperature') value = charInfo.value.sensorValue.toFixed(2);
    if (oid === 'pwrCtrl') value = charInfo.value.onOff;
    if (value !== undefined)
        console.log(chalk.blue('[   attrsChange ] ') + '@' + devInfo.addr + 
            ', type: ' + oid + ', value: ' + value);
    
    // [TODO]
}

module.exports = bleEvtHdlrs;
