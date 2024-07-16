import { handleNotFound } from "../helpers/validateHelper.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

/**
 * @function Crear Evento
 * app.post('/api/events/create');
 */
export const postEvent = async (req, res) => {
  try {
    const { id_user, title, description, date, cost, location } = req.body;

    if (!id_user || !title || !description || !date || !cost || !location)
      return res.status(400).json({ message: "the field is empty" });

    const userFound = await User.findOne({ _id: req.body.id_user });
    if (!userFound)
      return res.status(400).json({ message: "user is not found" });

    const newEvent = new Event({
      id_user,
      title,
      description,
      date,
      cost,
      location,
    });

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      newEvent.image = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const eventSave = await newEvent.save();
    return res.status(201).json({ event: eventSave });
  } catch (error) {
    console.error("Error en postEvent:", error.message);
    return res
      .status(500)
      .json({ message: "Error interno al procesar la solicitud" });
  }
};

/**
 * @function Consultar Eventos
 * app.post('/api/events/getAll');
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("id_user");

    if(!events) return handleNotFound(res, Event);

    const filterEvents = events.map((event) => ({
      _id: event._id,
      user: {
        _id: event.id_user._id,
        name: event.id_user.name,
      },
      title: event.title,
      description: event.description,
      date: event.date,
      cost: event.cost,
      image: event.image,
      location: event.location,
    }));

    const response = {
      events: filterEvents,
      total: filterEvents.length,
    };


    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Error", Error: error });
  }
};

/**
 * @function Consultar Evento por ID
 * app.post('/api/events/getById');
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate("id_user");

    const response = {
      _id: event._id,
      user: {
        _id: event.id_user._id,
        name: event.id_user.name,
      },
      title: event.title,
      description: event.description,
      date: event.date,
      cost: event.cost,
      image: event.image,
      location: event.location,
    };
    return res.status(200).json({ response });
  } catch (error) {
    return res.status(500).json({ message: "Error", Error: error });
  }
};

/**
 * @function Actualizar Evento
 * app.post('/api/events/update');
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user, title, description, date, cost, location } = req.body;
    const updateFields = {};

    if(title) updateFields.title = title;
    if(description) updateFields.description = description;
    if(date) updateFields.date = date;
    if(cost) updateFields.cost = cost;
    if(location) updateFields.location = location;

    const existingEvent = await Event.findById(id);
    if(!existingEvent) return handleNotFound(res, Event);

    if(existingEvent.id_user.toString() !== id_user){
      return res.status(401).json({ message: "No autorizado" });
    }

    if(req.files?.image){
      const result = await uploadImage(req.files.image.tempFilePath);
      updateFields.image = {
        publicId: result.public_id,
        secureUrl: result.secure_url,
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    Object.assign(existingEvent, updateFields);

    const updateEvent = await existingEvent.save();

    return res.status(200).json({ message: "Update successfully", event: updateEvent });
  } catch (error){
    return res.status(500).json({ message: "Error", Error: error });
  }
};

/**
 * @function Eliminar Evento
 * app.post('/api/events/delete');
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingEvent = await Event.findById(id).populate("id_user");
    if(!existingEvent) return handleNotFound(res, Event);

    if(existingEvent.id_user._id.toString() !== userId){
      return res.status(401).json({ message: "No autorizado" });
    }

    const deleteEvent = await Event.findByIdAndDelete(id);
    if(!deleteEvent) return handleNotFound(res, Event);

    if(deleteEvent.image && deleteEvent.image.publicId){
      await deleteImage(deleteEvent.image.publicId);
    }

    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error", Error: error });
  }
}
