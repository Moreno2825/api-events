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
    const { id_user, title, description, date, cost, location, b_concluido } = req.body;

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
      b_concluido,
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

    if (!events) return handleNotFound(res, Event);

    const today = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato 'YYYY-MM-DD'

    const filterEvents = await Promise.all(events.map(async (event) => {
      const eventDate = event.date.toISOString().split("T")[0]; // Obtiene la fecha del evento en formato 'YYYY-MM-DD'

      if (eventDate < today && !event.b_concluido) {
        event.b_concluido = true;
        await event.save();
      }

      return {
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
        b_activo: event.b_activo,
        b_concluido: event.b_concluido,
        b_cancelado: event.b_cancelado,
      };
    }));

    const activeEvents = filterEvents.filter(event => event.b_activo);

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

    if (!event) return handleNotFound(res, Event);

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
      b_activo: event.b_activo,
      b_concluido: event.b_concluido,
      b_cancelado: event.b_cancelado,
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
    const { id_user, title, description, date, cost, location, b_activo } = req.body;
    const updateFields = {};

    if(title) updateFields.title = title;
    if(description) updateFields.description = description;
    if(date) updateFields.date = date;
    if(cost) updateFields.cost = cost;
    if(location) updateFields.location = location;
    if(b_activo) updateFields.b_activo = b_activo;

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
 * @function Cancelar Evento
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

    existingEvent.b_cancelado = true;
    await existingEvent.save();

    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error", Error: error });
  }
}
