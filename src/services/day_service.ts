// eslint-disable-next-line import/no-extraneous-dependencies
import DocumentNotFoundError from "errors/DocumentNotFoundError";
import { BaseError } from "errors";
import { removeNull } from "util/removeNull";
import prisma from "db/prisma_client";
import { Day } from ".prisma/client";

export interface DayParams {
  id?: string;
  title?: string;
  value?: number;
  year?: number;
  month?: number;
  date?: number;
  totalTime?: number;
  totalWords?: number;
}

const constructQuery = (params: DayParams): Partial<DayParams> => {
  return removeNull(params);
};

const getDays = async (params: DayParams): Promise<Day[]> => {
  const query = constructQuery(params);

  try {
    return await prisma.day.findMany({
      where: {
        ...query,
      },
      // The above direct object syntax is equivalent to the following dynamic string-based query approach:
      // where: removeNull({
      //   id: query.id,
      //   title: query.title,
      //   description: query.description,
      //   value: query.value
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

const updateDay = async (id: string, params: DayParams): Promise<Day> => {
  const day = await prisma.day.update({
    where: { id },
    data: {
      ...params,
    },
  });

  if (!day) throw new DocumentNotFoundError(id);
  return day;
};

const deleteDay = async (id: string): Promise<Day> => {
  const deletedDay = await prisma.day.delete({
    where: {
      id: id,
    },
  });

  if (!deletedDay) throw new DocumentNotFoundError(id);
  return deletedDay;
};

const createDay = async (
  day: Pick<
    Day,
    "title" | "year" | "month" | "date" | "value" | "totalTime" | "totalWords"
  >,
): Promise<Day> => {
  try {
    return await prisma.day.create({
      data: {
        ...day,
      },
    });
  } catch (e: any) {
    throw e;
  }
};

export const dayService = {
  createDay,
  getDays,
  updateDay,
  deleteDay,
};
