import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./discount.controller.js";

export const discountRouter = Router();

/**
 * @swagger
 * /discount:
 *   get:
 *     tags:
 *       - Discount
 *     summary: Get all discounts
 *     description: Retrieve all discounts
 *     parameters:
 *      - in: query
 *        name: status
 *        schema:   
 *         type: string
 *        description: Filter products by status  
 *        enum: [Actived | Archived]
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
 *                  tpye: array
 *                  items:  
 *                   $ref: "#/components/schemas/discount"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
discountRouter.get("/", findAll);

/**
 * @swagger
 * /discount/:id:
 *   get:
 *     tags:
 *       - Discount
 *     summary: Get discount by id
 *     description: Retrieve discount by id
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
 *                 $ref: "#/components/schemas/discount"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

discountRouter.get("/:id", findOne);

/**
 * @swagger
 * /discount:
 *   post:
 *     tags:
 *       - Discount
 *     summary: Create discount
 *     description: Create discount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/discount"
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
 *                 $ref: "#/components/schemas/discount"
 *       400:
 *         description: Bad request
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

discountRouter.post("/", add);

/**
 * @swagger
 * /discount/:id:
 *   put:
 *     tags:
 *       - Discount
 *     summary: Update discount
 *     description: Update discount
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/discount"
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
 *                 $ref: "#/components/schemas/discount"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
discountRouter.put("/:id", update);
discountRouter.patch("/:id", update);

/**
 * @swagger
 * /discount/:id:
 *   delete:
 *     tags:
 *       - Discount
 *     summary: Delete discount
 *     description: Delete discount
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

discountRouter.delete("/:id", remove);
