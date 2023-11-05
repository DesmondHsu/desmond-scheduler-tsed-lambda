import { Tasks } from "./Tasks";
import { TasksRepository, TaskModel, ScheduleModel } from "@tsed/prisma";
import { PlatformTest } from "@tsed/common";
import { Conflict, NotFound } from "@tsed/exceptions";
import { Prisma, Task } from "@prisma/client";

let instance: Tasks;
let findAllTaskMock: Promise<TaskModel[]>;
let findUniqueTaskMock: Promise<TaskModel | null>;
let createTaskMock: Promise<TaskModel>;
let updateTaskMock: Promise<TaskModel>;
let deleteTaskMock: Promise<TaskModel>;

describe("Tasks", () => {
  beforeAll(async () => {
    await PlatformTest.create();

    // Inject mock
    const locals = [
      {
        token: TasksRepository,
        use: {
          findMany: () => findAllTaskMock,
          findUnique: () => findUniqueTaskMock,
          create: () => createTaskMock,
          update: () => updateTaskMock,
          delete: () => deleteTaskMock
        }
      }
    ];
    instance = await PlatformTest.invoke(Tasks, locals);
  });

  afterEach(PlatformTest.reset);

  describe("getTask", () => {
    it("should return the found item", async () => {
      const expectedRespnose: TaskModel = {
        id: "id",
        account_id: 0,
        schedule_id: "schedule_id",
        start_time: new Date(),
        duration: 1,
        type: "break",
        schedule: {
          id: "id",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date(),
          tasks: []
        }
      };
      findUniqueTaskMock = Promise.resolve(expectedRespnose);

      const result = await instance.getTask("id");
      expect(result.status).toBe(200);
      expect(result.body).toBe(expectedRespnose);
    });
    it("should throw 404 if item is not found", async () => {
      findUniqueTaskMock = Promise.resolve(null);

      const result = await instance.getTask("id");
      expect(result).toBeInstanceOf(NotFound);
    });
  });

  describe("createTask", () => {
    it("should call create with supplied new item", async () => {
      const schedule_id = "schedule_id";
      const newId = "newId";
      const newItem = {
        agent_id: 0,
        start_time: new Date(),
        duration: 1,
        account_id: 0,
        type: "work"
      };
      const expectedResult = {
        ...newItem,
        id: newId,
        schedule_id,
        schedule: {
          id: "id",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date(),
          tasks: []
        }
      };
      createTaskMock = Promise.resolve(expectedResult);

      const result = await instance.createTask("scheduleId", newItem);
      expect(result.status).toBe(201);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw Conflict if it database fails to update", async () => {
      createTaskMock = Promise.reject();

      await expect(instance.createTask("scheduleId", {} as any)).rejects.toThrow(Conflict);
    });
  });

  describe("updateTask", () => {
    it("should call update with supplied attributes", async () => {
      const existingId = "newId";
      const updateBody: Prisma.TaskUpdateWithoutScheduleInput = {
        start_time: new Date(),
        duration: 1,
        account_id: 0,
        type: "work"
      };
      const expectedResult = {
        ...updateBody,
        schedule_id: "schedule_id",
        schedule: {
          id: "id",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date(),
          tasks: [] as TaskModel[]
        } as ScheduleModel
      } as TaskModel;
      updateTaskMock = Promise.resolve(expectedResult);

      const result = await instance.updateTask(existingId, updateBody);
      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw Conflict if it database fails to update item", async () => {
      updateTaskMock = Promise.reject();

      await expect(
        instance.updateTask("id", {
          id: "_",
          account_id: 0,
          start_time: new Date()
        })
      ).rejects.toThrow(Conflict);
    });
  });

  describe("deleteTask", () => {
    it("should call delete with the supplied ID", async () => {
      const existingId = "id";
      const expectedResult = {
        id: existingId,
        start_time: new Date(),
        duration: 1,
        account_id: 0,
        type: "work",
        schedule_id: "schedule_id",
        schedule: {
          id: "id",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date(),
          tasks: []
        }
      };
      deleteTaskMock = Promise.resolve(expectedResult);

      const result = await instance.deleteTask(existingId);
      expect(result.status).toBe(204);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw NotFound if it database fails to delete item", async () => {
      deleteTaskMock = Promise.reject();

      await expect(instance.deleteTask("id")).rejects.toThrow(NotFound);
    });
  });
});
