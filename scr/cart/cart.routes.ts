import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  cancelCart,
} from "./cart.controller.js";

export const cartRouter = Router();
/**
 * @swagger
 * /cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get all carts
 *     description: Retrieve all carts
 *     parameters:
 *      - in: query
 *        name: status
 *        schema:   
 *         type: string
 *        description: Filter products by status  
 *        enum: [Pending | Cancelled | Completed]
 *      - in: query
 *        name: user
 *        schema:   
 *         type: string
 *        description: Filter products by user id
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
 *                   $ref: "#/components/schemas/cart"
 *       500:
 *         description: internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
cartRouter.get("/", findAll);

/**
 * @swagger
 * /cart/:id:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart by id
 *     description: Retrieve cart by id
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
 *                 $ref: "#/components/schemas/cart"
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
cartRouter.get("/:id", findOne);


/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Create cart
 *     description: Create cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/cart"
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
 *                 $ref: "#/components/schemas/cart"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *         content: {}
 *     security:
 *       - bearerAuth: []
 */
cartRouter.post("/", add);

/**
 * @swagger
 * /cart/complete/:id:
 *   put:
 *     tags:
 *       - Cart
 *     summary: Complete cart
 *     description: Complete cart, update status to completed and update stock of product 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/cart" 
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
 *                 $ref: "#/components/schemas/cart"
 *       404:
 *         description: Not found 
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
*/
cartRouter.put("complete/:id", update);

/**
 * @swagger
 * /cart/cancelCart/:id:
 *   patch:
 *     tags:
 *       - Cart
 *     summary: Cancel cart
 *     description: Cancel cart
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

cartRouter.patch("/cancelCart/:id", cancelCart);
/**
 * @swagger
 * /cart/:id:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Delete cart by id
 *     description: Remove cart by id
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
cartRouter.delete("/:id", remove);
