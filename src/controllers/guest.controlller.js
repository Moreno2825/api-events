import Event from "../models/event.js";
import User from "../models/user.js";
import Guest from "../models/guest.js";
import { handleNotFound } from "../helpers/validateHelper.js";
import user from "../models/user.js";

/**
 * Creates a new guest record in the database.
 *
 * @param {Object} req.body - The body of the request containing the guest data.
 * @param {string} req.body.id_user - The ID of the user.
 * @param {string} req.body.id_event - The ID of the event.
 */
export const postGuest = async (req, res) => {
  const { id_user, id_event } = req.body;

  console.log(req.body);

  if (!id_user || !id_event)
    return res.status(400).json({ message: "the field is empty" });

  const userFound = await User.findOne({ _id: id_user });
  if (!userFound) return handleNotFound(res, User);

  const eventFound = await Event.findOne({ _id: id_event });
  if (!eventFound) return handleNotFound(res, Event);

  try {
    const newGuest = new Guest({
      id_user,
      id_event,
    });

    await newGuest.save();

    return res.status(201).json({ message: "Guest created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering guest", error: error.message });
  }
};

export const getGuestsByEvent = async (req, res) => {
    try {
      const { id } = req.params;
  
      const eventFound = await Event.findOne({ _id: id });
      if (!eventFound)
        return res.status(404).json({ message: "Event not found" });
  
      const guests = await Guest.find({ id_event: id }).populate("id_user");
  
      const filterGuests = guests.map(guest => ({
        _id: guest._id,
        user: {
          fullname: `${guest.id_user.name} ${guest.id_user.lastname}`
        },
      }));
  
      const response = {
        event: filterGuests,
        total: filterGuests.length,
      };
  
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching guests", error: error.message });
    }
  };
  