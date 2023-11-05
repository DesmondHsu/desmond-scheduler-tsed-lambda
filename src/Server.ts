import { Configuration } from "@tsed/di";
import { Schedules, Tasks } from "./lambda";
import { WrapperResponseFilter } from "./utils/WrapperResponseFilter";
import "@tsed/ajv";

@Configuration({
  mount: {
    "/": [Schedules, Tasks]
  },
  jsonMapper: {
    additionalProperties: false,
    disableUnsecureConstructor: false
  },
  responseFilters: [WrapperResponseFilter],
  middlewares: ["json-parser"]
})
export class Server {}
