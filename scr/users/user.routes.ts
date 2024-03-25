import Router from "express";

import { add, findAll, findOne, remove, update } from "./user.controller.js";
import { auth, isAdmin } from "../middlewares/auth.js";
export const userRouter = Router();


/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users
 *     description: Retrieve all users
 *     parameters:
 *      - in: query
 *        name: status
 *        schema:   
 *         type: string
 *        description: Filter products by status  
 *        enum: [Actived | Archived]
 *      - in: query
 *        name: type
 *        schema:   
 *         type: string
 *        description: Filter products by user type
 *        enum: [User | Admin]
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
 *                   $ref: "#/components/schemas/user"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */
userRouter.get("/", isAdmin, findAll);

/**
 * @swagger
 * /user/:id:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id
 *     description: Retrieve user by id
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
 *                 $ref: "#/components/schemas/user"
 *       404:
 *         description: Not found
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */

userRouter.get("/:id", auth, findOne);

/**
 * @swagger
 * /user:
 *   post:
 *     tags:
 *       - User
 *     summary: Create user
 *     description: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
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
 *                 $ref: "#/components/schemas/user"
 *       400:
 *         description: Bad request
 *         content: {}
 *       500:
 *         description: Internal server error
 */


userRouter.post("/", add);

/**
 * @swagger
 * /user/:id:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by id
 *     description: Remove user by id
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
 *       400:
 *         description: Bad request
 *         content: {}
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

userRouter.delete("/:id", isAdmin, remove);


/**
 * @swagger
 * /user/:id:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user
 *     description: Update user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user" 
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
 *                 $ref: "#/components/schemas/user"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

userRouter.put("/:id", isAdmin, update);
userRouter.patch("/:id", isAdmin, update);
