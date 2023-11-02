import { Controller } from "@tsed/di";
import { Get, Post } from "@tsed/schema";
import { PathParams } from "@tsed/platform-params";

@Controller("/schedules")
export class Schedules {
  @Get("/")
  findAll() {
    return "Schedules";
  }

  @Get("/:id")
  findOne(@PathParams("id") id: string) {
    return "Schedule";
  }

  @Post("/")
  createSchedule() {
    return "create";
  }
}
