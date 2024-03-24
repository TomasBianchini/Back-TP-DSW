import { findAll, findOne, add, update, remove } from "./order.controller.js";
import { Router } from "express";

export const orderRouter = Router();


/**
 * @swagger
 * /order:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders
 *     description: Retrieve all orders
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
 *                   $ref: "#/components/schemas/order"
 *       500:
 *         description: internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
orderRouter.get("/", findAll);

/**
 * @swagger
 * /order/:id:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get order by id
 *     description: Retrieve order by id
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
 *                 $ref: "#/components/schemas/order"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
orderRouter.get("/:id", findOne);

/**
 * @swagger
 * /order:
 *   post:
 *     tags:
 *       - Order
 *     summary: Create order
 *     description: Create order and if the user doesn't have a pending cart, it creates a pending cart for the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/order"
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
 *                 $ref: "#/components/schemas/order"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
orderRouter.post("/", add);


/**
 * @swagger
 * /order/:id:
 *   put:
 *     tags:
 *       - Order
 *     summary: Update order
 *     description: Update order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/order" 
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
 *                 $ref: "#/components/schemas/order"
 *       404:
 *         description: Not found 
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
*/
orderRouter.put("/:id", update);
orderRouter.patch("/:id", update);

/**
 * @swagger
 * /order/:id:
 *   delete:
 *     tags:
 *       - Order
 *     summary: Delete order by id
 *     description: Remove order by id
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
orderRouter.delete("/:id", remove);
