import { HttpStatus } from "../http/statusCodes";

/**
 * @description Define a error which will be sent to client
 * @class ClientError
 * @extends {Error}
 */
export class ClientError extends Error {
  __type__ = "CLIENT_ERROR";
  payload?: {
    errObj?: object;
    errMsg?: string;
  };
  code?: HttpStatus;

  constructor(
    payload?: {
      errObj?: object;
      errMsg?: string;
    },
    code?: HttpStatus,
  ) {
    super();
    this.payload = { ...payload };
    this.code = code;
  }
}
