var client = new Paho.MQTT.Client("m11.cloudmqtt.com", 39280,"hype_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
var options = {
    useSSL: true,
    userName: "zettlmtm",
    password: "VOUbRcmhjffA",
    onSuccess:onConnect,
    onFailure:doFail
}
client.connect(options);

function onConnect() {
    console.log("onConnect");
    client.subscribe("/outTopic");
    // message = new Paho.MQTT.Message("Hello CloudMQTT from websocket hype");
    // message.destinationName = "/outTopic";
    // client.send(message);
}

function doFail(e){
    console.log(e);
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
    try {
        msg = JSON.parse(message.payloadString);
        console.log(msg);
        addNewDataPoint(msg.source, msg.price);
    } catch (e) {
        console.log("error");
        console.log(e);
    }
}
