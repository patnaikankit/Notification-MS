'use strict';

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const config = require('./config/server-config.js');
const { PORT, SENDER_MAIL } = config;
const apiRoutes = require('./routes/index.js')
const amqplib = require('amqplib');
const { MailService } = require('./service/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectQueue = async () => {
    try{
        const connection = await amqplib.connect("amqp://localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME);
        channel.consume(process.env.QUEUE_NAME, async (data) => {
            try{
                if(data !== null){
                    const messageContent = data.content.toString('utf-8');
                    const messageObject = JSON.parse(messageContent);

                    console.log('Received message:', messageObject);
                    await MailService.sendMail(
                        SENDER_MAIL,
                        messageObject.recepientEmail,
                        messageObject.subject,
                        messageObject.text
                    );
                    channel.ack(data);
                    console.log('Message processed and acknowledged.');
                }
            } 
            catch(err){
                console.error('Error processing message:', err.message);
                // Optionally, use channel.nack(data) to requeue the message for later processing
            }
        });  
    } 
    catch(err){
        console.error('Error connecting to the queue:', err.message);
    }
};

app.use('/api', apiRoutes)

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectQueue();
    console.log("Queue is working");
});
