var sivannRelayPlugin = require('bshep-plugin-sivann-relay');
var sivannWeatherPlugin = require('bshep-plugin-sivann-weatherstation');


var relay, weatherStation, readTemp;

function tempCtrlApp (central) {
    var blocker = central.blocker;

    central.support('sivannRelay', sivannRelayPlugin);
    central.support('sivannWeather', sivannWeatherPlugin);

    blocker.enable('white');
    blocker.unblock('0x689e192a8c8c');  // TODO
    blocker.unblock('0x20c38ff18bc3');  // TODO
}

function tempCtrlIndHdlr(msg) {
    var dev = msg.periph;
    
    switch (msg.type) {
        case 'devIncoming':
            // 裝置加入網路
            // 你已經可以存取到入網的裝置
            if (dev.name === 'sivannRelay') {
                // 現在加入網路的是 sivann 生產的 relay
                // console.log('Relay join the network'); 
            }
            if (dev.name === 'sivannWeather') {
                // 現在加入網路的是 sivann 生產的 weather station
                // console.log('Weather station join the network');
            }
            break;

        case 'devStatus': 
            if (dev.name === 'sivannRelay') {
                relay = (msg.data === 'online') ? dev : null;    
            }

            if (dev.name === 'sivannWeather') {
                weatherStation = (msg.data === 'online') ? dev : null; 

                if (!weatherStation) {
                    clearInterval(readTemp);
                    return;
                };

                // 讓 weather station 定時回報溫度值
                weatherStation.configNotify('0xbb80', '0xcc07', true, function (err) {
                    if (!err) {
                        // console.log('Temperature report setting success');
                    }
                });
                
                // 為回報溫度的 characteristic 註冊一隻處理函式
                weatherStation.onNotified('0xbb80', '0xcc07', tempChangedHdlr); 

                readTemp = setInterval(function () {
                    var tempCharInfo = weatherStation.dump('0xbb80', '0xcc07'),
                        tempValue = tempCharInfo.value.sensorValue;

                    // 若 weatherStation 為離線狀態，則不做任何事
                    if (weatherStation.dump().status !== 'online') return;

                }, 15000);

            }
            break;


    }
}

// 溫度回報之處理函式
function tempChangedHdlr (data) {
    // console.log('Temperature value: ' + data.sensorValue);

    // 若 relay 尚未入網，則不再做任何事
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

module.exports = { 
    app: tempCtrlApp,
    indHdlr: tempCtrlIndHdlr
}
