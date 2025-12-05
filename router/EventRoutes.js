const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require('../controller/event.controller');
const { authenticate, isAdmin, isAdminOrCreator } = require('../middleware/auth');

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 description: Event name
 *                 example: Summer Music Festival
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Event date (must be in the future)
 *                 example: 2025-12-25
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total number of seats available
 *                 example: 100
 *     responses:
 *       200:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event created successfully
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Summer Music Festival
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2025-12-25T00:00:00.000Z
 *                     capacity:
 *                       type: integer
 *                       example: 100
 *                     availableSeats:
 *                       type: integer
 *                       description: Automatically set equal to capacity
 *                       example: 100
 *                     createdBy:
 *                       type: string
 *                       description: User ID who created the event
 *                       example: 507f1f77bcf86cd799439012
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:30:00.000Z
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticate, isAdmin, createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events with filtering and pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (YYYY-MM-DD)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (YYYY-MM-DD)
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
 *         description: Number of events per page
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 */
router.get('/', getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Event Name
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2023-12-26
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 150
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not admin or event creator
 *       404:
 *         description: Event not found
 */
router.put('/:id', authenticate, isAdminOrCreator, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not admin or event creator
 *       404:
 *         description: Event not found
 */
router.delete('/:id', authenticate, isAdminOrCreator, deleteEvent);

module.exports = router;
