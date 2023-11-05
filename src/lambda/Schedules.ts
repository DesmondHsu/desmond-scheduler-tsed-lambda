import { Controller, Inject } from "@tsed/di";
import { ContentType, Delete, Get, Post, Put } from "@tsed/schema";
import { PathParams, BodyParams } from "@tsed/platform-params";
import { SchedulesRepository } from "@tsed/prisma";
import { Prisma } from "@prisma/client";
import { Conflict, NotFound } from "@tsed/exceptions";
import { Success, Created, NoContent } from "../utils";

@Controller("/schedules")
export class Schedules {
  @Inject() private readonly scheduleRepository: SchedulesRepository;

  @Get("/")
  async getSchedules() {
    const allSchedules = await this.scheduleRepository.findMany();
    return new Success(allSchedules);
  }

  @Get("/:id")
  async getSchedule(@PathParams("id") id: string) {
    const result = await this.scheduleRepository.findUnique({ where: { id }, include: { tasks: true } });
    if (!result) {
      return new NotFound("Schedule not found.");
    }
    return new Success(result);
  }

  @Post("/")
  async createSchedule(@BodyParams() dto: Prisma.ScheduleCreateWithoutTasksInput) {
    const result = await this.scheduleRepository.create({ data: dto, include: { tasks: false } }).catch((err) => {
      throw new Conflict(`Failed to create schedule with reason ${JSON.stringify(err)}`);
    });
    return new Created(result);
  }

  @Put("/:id")
  async updateSchedule(@PathParams("id") id: string, @BodyParams() partialSchedule: Prisma.ScheduleUpdateWithoutTasksInput) {
    const query = {
      data: partialSchedule,
      where: { id },
      include: { tasks: true }
    };
    const result = await this.scheduleRepository.update(query).catch((err) => {
      throw new Conflict(`Failed to update schedule with reason ${JSON.stringify(err)}`);
    });
    return new Success(result);
  }

  @Delete("/:id")
  async deleteSchedule(@PathParams("id") id: string) {
    const result = await this.scheduleRepository.delete({ where: { id } }).catch((err) => {
      throw new NotFound(`Failed to delete schedule specified with reason ${JSON.stringify(err)}`);
    });
    return new NoContent(result);
  }
}
