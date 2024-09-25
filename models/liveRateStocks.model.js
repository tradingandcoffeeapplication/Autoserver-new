const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const liveRateStockSchema = new Schema({ 
    _id: String,
    symbol: String, 
    close: Number, 
    operation: String, 
    startDate: String, 
    endDate: String, 
    startPrice: Number,
    endPrice: Number,
    succeeded: Boolean,
    pipsed: Number,
    openPosId: String,
    insertTime: Number
});

module.exports = liveRateStockSchema;