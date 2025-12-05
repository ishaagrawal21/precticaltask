const Booking = require('../model/BookingModel');
const Event = require('../model/EventModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    if (!eventId || !numberOfTickets) {
      return res.status(400).send({ message: 'Event ID and number of tickets are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send({ message: 'Event not found' });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).send({ message: 'Cannot book for past events' });
    }

    const existingBooking = await Booking.findOne({
      user: req.user._id,
      event: eventId,
    });

    if (existingBooking) {
      return res.status(400).send({ message: 'You have already booked this event' });
    }

    if (event.availableSeats < numberOfTickets) {
      return res.status(400).send({ message: `Only ${event.availableSeats} seats available` });
    }

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      numberOfTickets,
    });

    event.availableSeats -= numberOfTickets;
    await event.save();

    await booking.populate('event', 'name date capacity');
    await booking.populate('user', 'name email');

    return res.status(200).send({
      message: 'Booking created successfully',
      result: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// GET ALL BOOKINGS
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('event', 'name date capacity')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).send({
      message: 'success',
      result: {
        bookings,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalBookings: total,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// GET SINGLE BOOKING
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('event', 'name date capacity');

    if (!result) return res.status(404).send({ message: 'Booking not found' });

    if (req.user.role !== 'admin' && result.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Access denied' });
    }

    return res.status(200).send({ message: 'success', result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// DELETE BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('event');

    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Access denied' });
    }

    const event = booking.event;
    event.availableSeats += booking.numberOfTickets;
    await event.save();

    await Booking.findByIdAndDelete(id);

    return res.status(200).send({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

// EXPORT BOOKINGS
const exportBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event', 'name date capacity')
      .sort({ bookingDate: -1 });

    if (bookings.length === 0) {
      return res.status(404).send({ message: 'No bookings found to export' });
    }

    const csvData = bookings.map((booking) => ({
      'Booking ID': booking._id.toString(),
      'User Name': booking.user.name,
      'User Email': booking.user.email,
      'Event Name': booking.event.name,
      'Event Date': booking.event.date.toISOString().split('T')[0],
      'Number of Tickets': booking.numberOfTickets,
      'Booking Date': booking.bookingDate.toISOString().split('T')[0],
    }));

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '../exports/bookings.csv'),
      header: [
        { id: 'Booking ID', title: 'Booking ID' },
        { id: 'User Name', title: 'User Name' },
        { id: 'User Email', title: 'User Email' },
        { id: 'Event Name', title: 'Event Name' },
        { id: 'Event Date', title: 'Event Date' },
        { id: 'Number of Tickets', title: 'Number of Tickets' },
        { id: 'Booking Date', title: 'Booking Date' },
      ],
    });

    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    await csvWriter.writeRecords(csvData);

    res.download(
      path.join(__dirname, '../exports/bookings.csv'),
      `bookings-${new Date().toISOString().split('T')[0]}.csv`,
      (err) => {
        if (err) {
          return res.status(500).send({ message: 'Error downloading file' });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  exportBookings,
};
