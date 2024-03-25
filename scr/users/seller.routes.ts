import { Router } from "express";
import { findAll, findOne, remove, update, add } from "./seller.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
export const sellerRouter = Router();

/**
 * @swagger
 * /seller:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get all sellers
 *     description: Retrieve all sellers
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
 *                   $ref: "#/components/schemas/seller"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

sellerRouter.get("/", isAdmin, findAll);

/**
 * @swagger
 * /seller/:id:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get seller by id
 *     description: Retrieve seller by id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                   $ref: "#/components/schemas/seller" 
  *      404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

sellerRouter.get("/:id", auth, findOne);

/**
 * @swagger
 * /seller:
 *   post:
 *     tags:
 *       - Seller
 *     summary: Create seller
 *     description: Create seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/seller"
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
 *                 $ref: "#/components/schemas/seller"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *         content: {}
 */

sellerRouter.post("/", add);

/**
 * @swagger
 * /seller/:id:
 *   delete:
 *     tags:
 *       - Seller
 *     summary: Delete seller by id
 *     description: Remove seller by id
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
 *     security:
 *       - bearerAuth: []
 */
sellerRouter.delete("/:id", isAdmin, remove);

/**
 * @swagger
 * /seller/:id:
 *   put:
 *     tags:
 *       - Seller
 *     summary: Update seller
 *     description: Update seller
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/seller" 
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
 *                 $ref: "#/components/schemas/seller"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
sellerRouter.put("/:id",isAdmin, update);
sellerRouter.patch("/:id", isAdmin, update);
