import { Router } from "express";
import * as userController from "../controllers/user.controller";
import authenticateToken from "../middlewares/authenticateToken";
import { asyncHandler } from "../utils/asyncHandler";
const router = Router();

router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await userController.getUser(id);
    res.status(200).json({ user });
  }),
);

router.put(
  "edit/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedUser = await userController.updateUser(req.body, id);
    res.status(200).json(updatedUser);
  }),
);

router.delete(
  "/delete/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleteUser = await userController.deleteUser(id);
    res.status(200).json(deleteUser);
  }),
);

export default router;
