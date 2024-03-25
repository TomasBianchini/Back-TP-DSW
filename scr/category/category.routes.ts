import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./category.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";

export const categoryRouter = Router();

/**
 * @swagger
 * /category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieve all categories
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
 *                   $ref: "#/components/schemas/category"
 *       404:
 *         description: Bad request
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

categoryRouter.get("/", isAdmin, findAll);

/**
 * @swagger
 * /category/:id:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get category by id
 *     description: Retrieve category by id
 *     responses:
 *       200:
 *         description: Found category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/category"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
categoryRouter.get("/:id", isAdmin , findOne);
/**
 * @swagger
 * /category:
 *   post:
 *     tags:
 *       - Category
 *     summary: Create category
 *     description: Create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/category"
 *     responses:
 *       201:
 *         description: Cateogry created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message: 
 *                 type: string
 *                data:
 *                 $ref: "#/components/schemas/category"
 *       400:
 *         description: Bad request
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */

categoryRouter.post("/", isAdmin , add);

/**
 * @swagger
 * /category/:id:
 *   put:
 *     tags:
 *       - Category
 *     summary: Update category
 *     description: Update category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/category" 
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
 *                 $ref: "#/components/schemas/category"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
categoryRouter.put("/:id" ,  isAdmin , update);
categoryRouter.patch("/:id",  isAdmin, update);

/**
 * @swagger
 * /category/:id:
 *   delete:
 *     tags:
 *       - Category
 *     summary: Delete category
 *     description: Delete category
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
 *                 $ref: "#/components/schemas/category"
 *       404:
 *         description: Not found
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
categoryRouter.delete("/:id", isAdmin, remove);
