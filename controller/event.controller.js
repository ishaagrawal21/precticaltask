const Event = require('../model/EventModel');
const Booking = require('../model/BookingModel');

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const { name, date, capacity } = req.body;

    if (!name || !date || !capacity) {
      return res.status(400).send({ message: 'Name, date, and capacity are required' });
    }

    const event = await Event.create({
      name,
      date,
      capacity,
      availableSeats: capacity,
      createdBy: req.user._id,
    });

    return res.status(200).send({
      message: 'Event created successfully',
      result: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const { start, end, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let filter = {};

    if (start || end) {
      filter.date = {};
      if (start) {
        filter.date.$gte = new Date(start);
      }
      if (end) {
        filter.date.$lte = new Date(end);
      }
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).send({
      message: 'success',
      result: {
        events,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalEvents: total,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// GET SINGLE EVENT
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Event.findById(id).populate('createdBy', 'name email');

    if (!result) return res.status(404).send({ message: 'Event not found' });

    return res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, capacity } = req.body;

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).send({ message: 'Event not found' });
    }

    // Update fields
    if (name) existingEvent.name = name;
    if (date) existingEvent.date = date;
    if (capacity !== undefined) {
      const capacityDiff = capacity - existingEvent.capacity;
      existingEvent.capacity = capacity;
      existingEvent.availableSeats = Math.max(0, existingEvent.availableSeats + capacityDiff);
    }

    await existingEvent.save();

    return res.status(200).send({
      message: 'Event updated successfully',
      result: existingEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).send({ message: 'Event not found' });
    }

    await Booking.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(id);

    return res.status(200).send({ message: 'Event deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
