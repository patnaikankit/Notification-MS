const amqplib = require("amqplib");
const serverConfig = require("./server-config");

let channel, connection;

const connectQueue = async () => {
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertQueue(serverConfig.QUEUE_NAME);
    } 
    catch(error){
        console.log(error);
    }
}

const sendData = async (data) => {
    try {
        await channel.sendToQueue(serverConfig.QUEUE_NAME, Buffer.from(JSON.stringify(data)));

    }
    catch(error){
        console.log("queue error", error);
    }
}

module.exports = {
    connectQueue,
    sendData
}