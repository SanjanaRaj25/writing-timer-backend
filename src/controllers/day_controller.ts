import { RequestHandler } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { BaseError } from "errors";
import { getSuccessfulDeletionMessage } from "util/constants";
import { CreateResourceRequest, UpdateResourceRequest } from "validation/day";
import { dayService } from "../services/day_service";

const createDay: RequestHandler = async (
  req: ValidatedRequest<CreateResourceRequest>,
  res,
  next,
) => {
  try {
    const savedResource = await dayService.createDay(req.body);
    res.status(201).json(savedResource);
  } catch (error) {
    next(error);
  }
};

const getDays: RequestHandler = async (req, res, next) => {
  try {
    const resources = await dayService.getDays({
      ...req.query,
    });
    res.status(200).json(resources);
  } catch (error) {
    next(error);
  }
};

const getDay: RequestHandler = async (req, res, next) => {
  try {
    const resources = await dayService.getDays({
      id: req.params.id,
      ...req.query,
    });

    if (resources.length === 0) throw new BaseError("Resource not found", 404);
    else if (resources.length > 1)
      throw new BaseError("Multiple Resource entries found", 404);
    else res.status(200).json(resources[0]);
  } catch (error) {
    next(error);
  }
};

const updateDay: RequestHandler = async (
  req: ValidatedRequest<UpdateResourceRequest>,
  res,
  next,
) => {
  try {
    // ! Don't let user update protected fields
    const { title, value } = req.body;

    const resource = await dayService.updateDay(req.params.id, {
      title,
      value,
    });
    res.status(200).json(resource);
  } catch (error) {
    next(error);
  }
};

const deleteDay: RequestHandler = async (req, res, next) => {
  try {
    await dayService.deleteDay(req.params.id);
    res
      .status(200)
      .json({ message: getSuccessfulDeletionMessage(req.params.id) });
  } catch (error) {
    next(error);
  }
};

const dayController = {
  createDay,
  getDay,
  getDays,
  updateDay,
  deleteDay,
};

export default dayController;
