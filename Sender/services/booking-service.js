const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const { ServerConfig, Queue } = require('../config')
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const {Enums} = require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const bookingRepository = new BookingRepository();
const fs = require('fs').promises;
const path = require('path');

const getFlightData = async (flightId) => {
    try {
        const dataPath = path.join(__dirname, 'flight.json');
        console.log(`Reading file from: ${dataPath}`);

        const fileContent = await fs.readFile(dataPath, 'utf-8');
        console.log('File content read successfully.');

        const flights = JSON.parse(fileContent);
        console.log('Parsed flight data:', flights);

        const numericFlightId = Number(flightId);
        console.log(`Searching for numeric flightId: ${numericFlightId}`);
        console.log(`Type of numericFlightId: ${typeof numericFlightId}`);

        const flight = flights.find(flight => {
            console.log(`Checking flightId: ${flight.flightId}, Type: ${typeof flight.flightId}`);
            return flight.flightId === numericFlightId;
        });

        if(!flight){
            throw new Error('Flight not found');
        }

        console.log('Flight found:', flight);
        return flight;
    } 
    catch(error){
        console.error('Error reading flight data:', error);
        throw error;
    }
};

const createBooking = async (data, transaction) => {
    try {
        const flightData = await getFlightData(data.flightId);

        if (data.noofSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }

        const totalBillingAmount = data.noofSeats * flightData.price;
        const bookingPayload = { ...data, totalCost: totalBillingAmount };

        const booking = await bookingRepository.create(bookingPayload, transaction);

        flightData.totalSeats -= data.noofSeats;
        console.log(`Updated flight ${data.flightId} seats to ${flightData.totalSeats}`);

        return booking;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};


const makePayment = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        const bookingDetails = await bookingRepository.get(data.bookingId, transaction);
        if(bookingDetails.status == CANCELLED) {
            throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
        }
        console.log(bookingDetails);
        const bookingTime = new Date(bookingDetails.createdAt);
        const currentTime = new Date();
        if(bookingDetails.totalCost != data.totalCost) {
            throw new AppError('The amount of the payment doesnt match', StatusCodes.BAD_REQUEST);
        }
        if(bookingDetails.userId != data.userId) {
            throw new AppError('The user corresponding to the booking doesnt match', StatusCodes.BAD_REQUEST);
        }

        await bookingRepository.update(data.bookingId, {status: BOOKED}, transaction);
        Queue.sendData({
            recepientEmail: 'ankit.123patnaik123@gmail.com',
            subject: 'Flight booked',
            text: `Booking successfully done for the booking ${data.bookingId}`
        });
        await transaction.commit();
        
    } 
    catch(error){
        await transaction.rollback();
        throw error;
    }
}


module.exports = {
    createBooking,
    makePayment,
}