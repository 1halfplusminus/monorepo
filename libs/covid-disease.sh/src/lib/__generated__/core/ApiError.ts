/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResult } from './ApiResult';

export class ApiError extends Error {
  public url: string;
  public status: number;
  public statusText: string;
  public body: any;

  constructor(response: ApiResult, message: string) {
    super(message);

    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
    this.body = response.body;
  }
}
