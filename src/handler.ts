import { PlatformServerless } from "@tsed/platform-serverless";
import { Schedules } from "./lambda";

const platform = PlatformServerless.bootstrap({
  lambda: [Schedules]
});

// then export the lambda
export = platform.callbacks();
