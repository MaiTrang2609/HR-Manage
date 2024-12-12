const Position = require("../models/positionModel");
const factory = require("./handlerFactory");

const PositionController = {
  getListPosition: factory.getAll(Position, "title"),

  getPosition: factory.getOne(Position, "_id"),

  createPosition: factory.createOne(Position),

  updatePosition: factory.updateOne(Position),

  deletePosition: factory.deleteOne(Position),
};

module.exports = PositionController;
