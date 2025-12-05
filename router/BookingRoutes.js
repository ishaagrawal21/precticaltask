const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  exportBookings,
} = require('../controller/booking.controller');
const { authenticate, isAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking for an event
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - numberOfTickets
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               numberOfTickets:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error or insufficient seats
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, createBooking);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (user's own bookings or all if admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of bookings per page
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getBookings);

/**
 * @swagger
 * /bookings/export:
 *   get:
 *     summary: Export all bookings as CSV (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/export', authenticate, isAdmin, exportBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.get('/:id', authenticate, getBookingById);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', authenticate, cancelBooking);

/**
 * @swagger
 * /bookings/export:
 *   get:
 *     summary: Export all bookings as CSV (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/export', authenticate, isAdmin, exportBookings);

module.exports = router;
