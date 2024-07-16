import { Router } from "express";
import * as guestController from "../controllers/guest.controlller.js";


//! inicializar la funcion
const router = Router();

router.post(
  "/guest/create",
  guestController.postGuest
);
router.get("/guest/:id", guestController.getGuestsByEvent);

export default router;