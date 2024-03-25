import { findAll, findOne, remove, update, add } from "./product.controller.js";
import { Router } from "express";
import { auth, isSeller } from "../middlewares/auth.js";
export const productRouter = Router();

/**
 * @swagger
 * /product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieve all products
 *     parameters:
 *      - in: query
 *        name: status
 *        schema:   
 *         type: string
 *        description: Filter products by status  
 *        enum: [Actived | Archived]
 *      - in: query
 *        name: seller
 *        schema:   
 *         type: string
 *        description: Filter products by seller id
 *      - in: query
 *        name: category
 *        schema:   
 *         type: string
 *        description: Filter products by category id
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
 *                   $ref: "#/components/schemas/product"
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
productRouter.get("/", auth, findAll);

/**
 * @swagger
 * /product/:id:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product by id
 *     description: Retrieve product by id
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
 *                 $ref: "#/components/schemas/product"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *          description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
productRouter.get("/:id", auth , findOne);

/**
 * @swagger
 * /product:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create product
 *     description: Create product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/product"
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/product"
 *       404:
 *         description: Bad request
 *         content: {}
 *       400: 
 *         description: Inappropriate language detected
 *     security:
 *       - bearerAuth: []
 */
productRouter.post("/", isSeller, add);
/**
 * @swagger
 * /product/:id:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete product by id
 *     description: Remove product by id
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
 *         description: Product not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
productRouter.delete("/:id", isSeller, remove);

/**
 * @swagger
 * /product/:id:
 *   put:
 *     tags:
 *       - Product
 *     summary: Update product
 *     description: Update product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/product" 
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
 *                 $ref: "#/components/schemas/product"
 *       404:
 *        description: Product not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
productRouter.put("/:id", isSeller, update);
productRouter.patch("/:id",isSeller, update);
