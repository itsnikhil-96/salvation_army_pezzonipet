const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  dateOfEvent: {
    type: Date,
    required: true,
  },
  mainLogo: {
    type: String, 
    required: true,
  },
  images: [
    {
      type: String, 
      required: true,
    }
  ],
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
