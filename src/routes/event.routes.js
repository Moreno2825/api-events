import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import fileUpload from "express-fileupload";

//! inicializar la funcion
const router = Router();

router.post(
  "/event/post",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  eventController.postEvent
);
router.get("/events", eventController.getAllEvents);
router.get("/events/:id", eventController.getEventById);
router.put(
  "/event/update/:id",
  fileUpload({ useTempFiles: true, tempFileDir: "./uploads" }),
  eventController.updateEvent
);
router.delete("/event/delete/:id", eventController.deleteEvent);

export default router;
