var BleShepherd = require('ble-shepherd');
var sivannRelayPlugin = require('bshep-plugin-sivann-relay');
var sivannWeatherPlugin = require('bshep-plugin-sivann-weatherstation');

var central = new BleShepherd('noble'); 

central.support('sivannRelay', sivannRelayPlugin);
central.support('sivannWeather', sivannWeatherPlugin);

// event listeners
central.on('ready', bleApp);

central.start(); 


var relay, weatherStation;

function bleApp () {
    var blocker = central.blocker;
    
    blocker.enable('white');
    blocker.unblock('0xd05fb820ceef');
    blocker.unblock('0x20c38ff19403');

    central.permitJoin(60);

    central.on('ind', function (msg) {
        var dev = msg.periph;
        
        switch (msg.type) {
            case 'devIncoming':
                // 裝置加入網路
                // 你可以開始操作入網裝置        
                if (dev.name === 'sivannRelay') {
                	relay = dev;

                    setInterval(function () {
                        var relayValue = relay.dump('0xbb40', '0xcc0e').value;

                        relayValue.onOff = !relayValue.onOff;
                        relay.write('0xbb40', '0xcc0e', relayValue);
                    }, 5000);                    
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

            case 'attNotify': 
                if (dev.addr === '0x20c38ff19403') return;
                console.log(msg.data);
                break;
            case 'attChange':
                // console.log(msg.data);
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