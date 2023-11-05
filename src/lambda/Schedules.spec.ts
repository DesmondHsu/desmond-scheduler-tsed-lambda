import { Schedules } from "./Schedules";
import { SchedulesRepository, ScheduleModel } from "@tsed/prisma";
import { PlatformTest } from "@tsed/common";
import { Conflict, NotFound } from "@tsed/exceptions";

let instance: Schedules;
let findAllScheduleMock: Promise<ScheduleModel[]>;
let findUniqueScheduleMock: Promise<ScheduleModel | null>;
let createScheduleMock: Promise<ScheduleModel>;
let updateScheduleMock: Promise<ScheduleModel>;
let deleteScheduleMock: Promise<ScheduleModel>;

describe("Schedules", () => {
  beforeAll(async () => {
    await PlatformTest.create();

    // Inject mock
    const locals = [
      {
        token: SchedulesRepository,
        use: {
          findMany: () => findAllScheduleMock,
          findUnique: () => findUniqueScheduleMock,
          create: () => createScheduleMock,
          update: () => updateScheduleMock,
          delete: () => deleteScheduleMock
        }
      }
    ];
    instance = await PlatformTest.invoke(Schedules, locals);
  });

  afterEach(PlatformTest.reset);

  describe("getSchedules", () => {
    it("should return empty list if none is found", async () => {
      findAllScheduleMock = Promise.resolve([]);

      const result = await instance.getSchedules();
      expect(result.status).toEqual(200);
      expect(result.body.length).toEqual(0);
    });
    it("should return list of schedules if the list is not empty", async () => {
      const expectedResponse: ScheduleModel[] = [
        {
          id: "id",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date(),
          tasks: []
        }
      ];
      findAllScheduleMock = Promise.resolve(expectedResponse);

      const result = await instance.getSchedules();
      expect(result.status).toBe(200);
      expect(result.body).toBe(expectedResponse);
    });
  });

  describe("getSchedule", () => {
    it("should return the found schdule", async () => {
      const expectedRespnose: ScheduleModel = {
        id: "id",
        account_id: 0,
        agent_id: 0,
        start_time: new Date(),
        end_time: new Date(),
        tasks: []
      };
      findUniqueScheduleMock = Promise.resolve(expectedRespnose);

      const result = await instance.getSchedule("id");
      expect(result.status).toBe(200);
      expect(result.body).toBe(expectedRespnose);
    });
    it("should throw 404 if schedule is not found", async () => {
      findUniqueScheduleMock = Promise.resolve(null);

      const result = await instance.getSchedule("id");
      expect(result).toBeInstanceOf(NotFound);
    });
  });

  describe("createSchedule", () => {
    it("should call create with supplied new schedule", async () => {
      const newId = "newId";
      const newItem = {
        id: "_",
        account_id: 0,
        agent_id: 0,
        start_time: new Date(),
        end_time: new Date(),
        tasks: []
      };
      const expectedResult = {
        ...newItem,
        id: newId
      };
      createScheduleMock = Promise.resolve(expectedResult);

      const result = await instance.createSchedule(newItem as any);
      expect(result.status).toBe(201);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw Conflict if it database fails to update", async () => {
      createScheduleMock = Promise.reject();

      await expect(
        instance.createSchedule({
          id: "_",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date()
        })
      ).rejects.toThrow(Conflict);
    });
  });

  describe("updateSchedule", () => {
    it("should call update with supplied attributes", async () => {
      const existingId = "newId";
      const expectedResult = {
        id: existingId,
        account_id: 0,
        agent_id: 0,
        start_time: new Date(),
        end_time: new Date(),
        tasks: []
      };
      updateScheduleMock = Promise.resolve(expectedResult);

      const result = await instance.updateSchedule(existingId, expectedResult);
      expect(result.status).toBe(200);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw Conflict if it database fails to update schedule", async () => {
      updateScheduleMock = Promise.reject();

      await expect(
        instance.updateSchedule("id", {
          id: "_",
          account_id: 0,
          agent_id: 0,
          start_time: new Date(),
          end_time: new Date()
        })
      ).rejects.toThrow(Conflict);
    });
  });

  describe("deleteSchedule", () => {
    it("should call delete with the supplied ID", async () => {
      const existingId = "id";
      const expectedResult = {
        id: existingId,
        account_id: 0,
        agent_id: 0,
        start_time: new Date(),
        end_time: new Date(),
        tasks: []
      };
      deleteScheduleMock = Promise.resolve(expectedResult);

      const result = await instance.deleteSchedule(existingId);
      expect(result.status).toBe(204);
      expect(result.body).toStrictEqual(expectedResult);
    });
    it("should throw NotFound if it database fails to delete schedule", async () => {
      deleteScheduleMock = Promise.reject();

      await expect(instance.deleteSchedule("id")).rejects.toThrow(NotFound);
    });
  });
});
