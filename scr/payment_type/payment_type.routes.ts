import { Router } from "express";
import {
  add,
  findAll,
  findOne,
  remove,
  update,
} from "./payment_type.controller.js";

export const payment_typeRouter = Router();

/**
 * @swagger
 * /payment_type:
 *   get:
 *     tags:
 *       - Payment_type
 *     summary: Get all payment_types
 *     description: Retrieve all payment_types
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
 *                  tpye: array
 *                  items:  
 *                   $ref: "#/components/schemas/payment_type"
 *       500:
 *         description: internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
payment_typeRouter.get("/", findAll);

/**
 * @swagger
 * /payment_type/:id:
 *   get:
 *     tags:
 *       - Payment_type
 *     summary: Get payment_type by id
 *     description: Retrieve payment_type by id
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
 *                 $ref: "#/components/schemas/payment_type"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
payment_typeRouter.get("/:id", findOne);

/**
 * @swagger
 * /payment_type:
 *   post:
 *     tags:
 *       - Payment_type
 *     summary: Create payment_type
 *     description: Create payment_type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/payment_type"
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
 *                 $ref: "#/components/schemas/payment_type"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
payment_typeRouter.post("/", add);

/**
 * @swagger
 * /payment_type/:id:
 *   delete:
 *     tags:
 *       - Payment_type
 *     summary: Delete payment_type by id
 *     description: Remove payment_type by id
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
payment_typeRouter.delete("/:id", remove);

/**
 * @swagger
 * /payment_type/:id:
 *   put:
 *     tags:
 *       - Payment_type
 *     summary: Update payment_type
 *     description: Update payment_type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/payment_type" 
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
 *                 $ref: "#/components/schemas/payment_type"
 *       404:
 *         description: Not found 
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
payment_typeRouter.put("/:id", update);
payment_typeRouter.patch("/:id", update);
