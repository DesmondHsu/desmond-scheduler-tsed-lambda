import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put } from "@tsed/schema";
import { PathParams, BodyParams } from "@tsed/platform-params";
import { TasksRepository } from "@tsed/prisma";
import { Prisma } from "@prisma/client";
import { Conflict, NotFound } from "@tsed/exceptions";
import { Success, Created, NoContent } from "../utils";

@Controller("/schedules/:scheduleId/tasks")
export class Tasks {
  @Inject() private readonly tasksRepository: TasksRepository;

  @Get("/:id")
  async getTask(@PathParams("id") id: string) {
    const result = await this.tasksRepository.findUnique({ where: { id } });
    if (!result) {
      return new NotFound("Task not found.");
    }
    return new Success(result);
  }

  @Post("/")
  async createTask(@PathParams("scheduleId") scheduleId: string, @BodyParams() dto: Prisma.TaskCreateWithoutScheduleInput) {
    const data: Prisma.TaskCreateInput = {
      ...dto,
      schedule: {
        connect: { id: scheduleId }
      }
    };
    const result = await this.tasksRepository.create({ data }).catch((err) => {
      throw new Conflict(`Failed to create task with reason ${JSON.stringify(err)}`);
    });
    return new Created(result);
  }

  @Put("/:id")
  async updateTask(@PathParams("id") id: string, @BodyParams() partialTask: Prisma.TaskUpdateWithoutScheduleInput) {
    const query: Prisma.TaskUpdateArgs = {
      data: partialTask,
      where: { id }
    };
    const result = await this.tasksRepository.update(query).catch((err) => {
      throw new Conflict(`Failed to update task with reason ${JSON.stringify(err)}`);
    });
    return new Success(result);
  }

  @Delete("/:id")
  async deleteTask(@PathParams("id") id: string) {
    const result = await this.tasksRepository.delete({ where: { id } }).catch((err) => {
      throw new NotFound(`Failed to delete task specified with reason ${JSON.stringify(err)}`);
    });
    return new NoContent(result);
  }
}
