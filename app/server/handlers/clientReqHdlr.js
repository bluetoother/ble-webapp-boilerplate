/**********************************************/
/* RPC Client Request Handler                 */
/**********************************************/
// 實作 Web Client 請求事件的處理函式
function clientReqHdlr (central, rpcServer, msg) {
	var args = msg.args,
                rspMsg = {
            seq: msg.seq,
            rspType: msg.reqType,
            status: null,
            data: {}
        };

    // [TODO]
}

module.exports = clientReqHdlr;