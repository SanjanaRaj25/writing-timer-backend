import joi from "joi";
import { ValidatedRequestSchema, ContainerTypes } from "express-joi-validation";
import { Day } from ".prisma/client";
import { BaseError, getFieldNotFoundError } from "errors";

export const CreateDaySchema = joi.object<Day>({
  title: joi
    .string()
    .required()
    .error(() => {
      throw new BaseError(getFieldNotFoundError("title"), 400);
    }),
  value: joi
    .number()
    .required()
    .error(() => {
      throw new BaseError(getFieldNotFoundError("value"), 400);
    }),
});

export interface CreateResourceRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Day;
}

export const UpdateResourceSchema = joi.object<Day>({
  id: joi.string(),
  title: joi.string(),
  value: joi.number(),
});

export interface UpdateResourceRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<Day>;
}
