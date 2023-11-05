import { Property } from "@tsed/schema";

export class Response<T> {
  @Property()
  readonly status: number;

  @Property()
  readonly body: T;

  constructor(result: T) {
    this.body = result;
  }
}

export class Success<T> extends Response<T> {
  status = 200;
}
export class Created<T> extends Response<T> {
  status = 201;
}
export class NoContent<T> extends Response<T> {
  status = 204;
}
