import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./shipping.controller.js";
import { Router } from "express";
import { auth, isAdmin } from "../middlewares/auth.js";
export const shippingRouter = Router();

/**
 * @swagger
 * /shipping:
 *   get:
 *     tags:
 *       - Shipping
 *     summary: Get all shippings
 *     description: Retrieve all shippings, the cancellationDeadline and estimatedTime are in hours
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                  type: array
 *                  items:  
 *                   $ref: "#/components/schemas/shipping"
 *       500:
 *         description: internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */

shippingRouter.get("/", auth, findAll);

/**
 * @swagger
 * /shipping/:id:
 *   get:
 *     tags:
 *       - Shipping
 *     summary: Get shipping by id, the cancellationDeadline and estimatedTime are in hours
 *     description: Retrieve shipping by id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/shipping"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */

shippingRouter.get("/:id", auth, findOne);

/**
 * @swagger
 * /shipping:
 *   post:
 *     tags:
 *       - Shipping
 *     summary: Create shipping
 *     description: Create shipping, the cancellationDeadline and estimatedTime must be in hours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/shipping"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/shipping"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
shippingRouter.post("/", isAdmin, add);

/**
 * @swagger
 * /shipping/:id:
 *   put:
 *     tags:
 *       - Shipping
 *     summary: Update shipping
 *     description: Update shipping, the cancellationDeadline and estimatedTime must be in hours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/shipping" 
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/shipping"
 *       404:
 *         description: Not found 
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
shippingRouter.put("/:id", isAdmin, update);
shippingRouter.patch("/:id", isAdmin, update);



/**
 * @swagger
 * /shipping/:id:
 *   delete:
 *     tags:
 *       - Shipping
 *     summary: Delete shipping by id
 *     description: Remove shipping by id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
shippingRouter.delete("/:id", isAdmin, remove);
