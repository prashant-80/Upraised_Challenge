const express = require('express');
const {
  getAllGadgets,
  createGadget,
  updateGadget,
  decommissionGadget,
  initiateSelfDestruct,
  completeSelfDestruct,
} = require('../controllers/gadgetController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/gadgets:
 *   get:
 *     summary: Get all gadgets with optional status filter
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *         description: Filter gadgets by status
 *     responses:
 *       200:
 *         description: List of gadgets with mission success probability
 */
router.get('/', authenticate, getAllGadgets);

/**
 * @swagger
 * /api/gadgets:
 *   post:
 *     summary: Create a new gadget
 *     tags: [Gadgets]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gadget created successfully
 */
router.post('/', authenticate, createGadget);

/**
 * @swagger
 * /api/gadgets/{id}:
 *   patch:
 *     summary: Update a gadget
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, DEPLOYED, DESTROYED, DECOMMISSIONED]
 *     responses:
 *       200:
 *         description: Gadget updated successfully
 *       404:
 *         description: Gadget not found
 */
router.patch('/:id', authenticate, updateGadget);

/**
 * @swagger
 * /api/gadgets/{id}:
 *   delete:
 *     summary: Decommission a gadget (soft delete)
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gadget decommissioned successfully
 *       404:
 *         description: Gadget not found
 */
router.delete('/:id', authenticate, decommissionGadget);

/**
 * @swagger
 * /api/gadgets/{id}/self-destruct:
 *   post:
 *     summary: Initiate self-destruct sequence
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Self-destruct sequence initiated
 *       404:
 *         description: Gadget not found
 */
router.post('/:id/self-destruct', authenticate, initiateSelfDestruct);

/**
 * @swagger
 * /api/gadgets/{id}/self-destruct/confirm:
 *   post:
 *     summary: Complete self-destruct sequence with confirmation code
 *     tags: [Gadgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - confirmationCode
 *             properties:
 *               confirmationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Self-destruct completed successfully
 *       400:
 *         description: Invalid or expired confirmation code
 *       404:
 *         description: Gadget not found
 */
router.post('/:id/self-destruct/confirm', authenticate, completeSelfDestruct);

module.exports = router;