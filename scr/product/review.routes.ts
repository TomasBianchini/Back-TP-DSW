import Router from "express";
import { findAll, findOne, add, update, remove } from "./review.controller.js";
import { isAppropriate } from "../middlewares/chat_gpt.js";

export const reviewRouter = Router();


/**
 * @swagger
 * /review:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get all reviews
 *     description: Retrieve all reviews
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
 *                   $ref: "#/components/schemas/review"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
reviewRouter.get("/", findAll);

/**
 * @swagger
 * /review/:id:
 *   get:
 *     tags:
 *       - Review
 *     summary: Get review by id
 *     description: Retrieve review by id
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *       500:
 *         description: Internal server error 
 *       404:
 *         description: Not found
 *     security:
 *       - bearerAuth: [] 
 */
reviewRouter.get("/:id", findOne);

/**
 * @swagger
 * /review:
 *   post:
 *     tags:
 *       - Review
 *     summary: Create review
 *     description: Create review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/review"
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
 *                 $ref: "#/components/schemas/review"
 *       404:
 *         description: Bad request
 *         content: {}
 *       400: 
 *         description: Inappropriate language detected
 *     security:
 *       - bearerAuth: []
 */
reviewRouter.post("/", isAppropriate, add);

/**
 * @swagger
 * /review/:id:
 *   put:
 *     tags:
 *       - Review
 *     summary: Update review by id
 *     description: Update review by id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/review" 
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
 *                 $ref: "#/components/schemas/review"
 *       404:
 *         description: Review Not found
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
reviewRouter.put("/:id", update);
reviewRouter.patch("/:id", update);

/**
 * @swagger
 * /review/:id:
 *   delete:
 *     tags:
 *       - Review
 *     summary: Delete review by id
 *     description: Remove review by id
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
 *         description: Review not found
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
reviewRouter.delete("/:id", remove);
