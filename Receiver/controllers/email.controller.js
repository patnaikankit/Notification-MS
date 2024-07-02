const { MailService  } = require('../service/index')

const createMail = async(req, res) => {
    try{
        const response = await MailService.createTicket({
            subject: req.body.subject,
            content: req.body.content,
            recepientEmail: req.body.recepientEmail
        })

        return res.status(201).json({
            "success": true,
            "data": response
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            "error": err
        })
    }
}

module.exports = {
    createMail
}