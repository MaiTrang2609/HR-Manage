const Job = require("../models/jobModel");
const factory = require("./handlerFactory");

const jobController = {
  getListJob: factory.getAll(Job, "title"),

  getJob: factory.getOne(Job, "_id"),

  createJob: factory.createOne(Job),

  updateJob: factory.updateOne(Job),

  deleteJob: factory.deleteOne(Job),
};

module.exports = jobController;
