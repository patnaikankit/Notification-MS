const TicketRepository = require('../repositories/ticket.repository')
const { mailsender } = require('../config/email-config')
const { error } = require('winston')

const ticketRepo = new TicketRepository();

const sendMail = async (from, to, subject, text) => {
    try{
        const response = await mailsender.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text
        })
    }
    catch(err){
        console.log(err)
        throw error;
    }
}

const createTicket = async (data) => {
    try{
        const response = ticketRepo.create(data);
        return response;
    }
    catch(err){
        console.log(err);
        throw error;
    }
}

const fetchPendingMails = async () => {
    try{
        const response = await ticketRepo.getPendingTickets();
        return response;
    }
    catch(err){
        console.log(err);
        throw error;
    }
}

module.exports = {
    sendMail,
    createTicket,
    fetchPendingMails
}