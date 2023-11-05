import { ResponseFilter, ResponseFilterMethods } from "@tsed/common";

// To add response header for type application/json
@ResponseFilter("application/json")
export class WrapperResponseFilter implements ResponseFilterMethods {
  transform(data: any) {
    return data;
  }
}
