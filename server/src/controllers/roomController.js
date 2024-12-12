const Room = require("../models/roomModel");
const factory = require("./handlerFactory");

const roomController = {
  getListRoom: factory.getAll(Room, "name"),

  getRoom: factory.getOne(Room, "_id"),

  createRoom: factory.createOne(Room),

  updateRoom: factory.updateOne(Room),

  deleteRoom: factory.deleteOne(Room),
};

module.exports = roomController;
