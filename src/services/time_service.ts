// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from "errors/DocumentNotFoundError";
import { BaseError } from "errors";
import { removeNull } from "util/removeNull";

import prisma from "db/prisma_client";
import { TimeInstance } from ".prisma/client";

export interface TimeParams {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dayId?: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  time?: number;
  words?: number;
}

const constructQuery = (params: TimeParams) => {
  return removeNull(params);
};

const getTimeInstances = async (
  params: TimeParams,
): Promise<TimeInstance[]> => {
  const query = constructQuery(params);

  try {
    return await prisma.timeInstance.findMany({
      where: {
        ...query,
      },
      // The above direct object syntax is equivalent to the following dynamic string-based query approach:
      // where: removeNull({
      //   id: query.id,
      //   resourceId: query.resourceId,
      //   name: query.name
      //   description: query.description,
      // })
      // You will find similar instances of this direct object syntax below in this file as well

      // https://www.prisma.io/docs/orm/reference/prisma-client-reference#filter-conditions-and-operators
      // include
      // take
      // skip
      // orderBy
    });
  } catch (e: any) {
    throw new BaseError(e.message, 500);
  }
};

const updateTimeInstance = async (
  id: string,
  params: TimeParams,
): Promise<TimeInstance> => {
  const item = await prisma.timeInstance.update({
    where: { id },
    data: {
      ...params,
    },
  });

  if (!item) throw new DocumentNotFoundError(id);
  return item;
};

const deleteTimeInstance = async (id: string): Promise<TimeInstance> => {
  const deletedItem = await prisma.timeInstance.delete({
    where: {
      id: id,
    },
  });

  if (!deletedItem) throw new DocumentNotFoundError(id);
  return deletedItem;
};

const createTimeInstance = async (
  item: Omit<TimeInstance, "id" | "createdAt" | "updatedAt">,
): Promise<TimeInstance> => {
  try {
    return await prisma.timeInstance.create({
      data: {
        ...item,
      },
    });
  } catch (e: any) {
    throw e;
  }
};

const timeService = {
  createTimeInstance,
  getTimeInstances,
  updateTimeInstance,
  deleteTimeInstance,
};

export default timeService;
