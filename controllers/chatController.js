const { StatusCodes } = require('http-status-codes');
const chatModel = require('../models/chatModel');

const findMsgs = async (_req, res) => {
    const allMsgs = await chatModel.findMsgs();
    if (!allMsgs) {
        return res.status(StatusCodes.NOT_FOUND);
    }
    return res.status(StatusCodes.OK).json(allMsgs);
};

module.exports = { findMsgs };
