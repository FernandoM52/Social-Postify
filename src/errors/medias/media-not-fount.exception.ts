import { HttpException, HttpStatus } from "@nestjs/common";

export class MediaNotFound extends HttpException {
  private _id: number;

  constructor(id: number) {
    super(`The media with id '${id}' does not exist`, HttpStatus.NOT_FOUND);
    this._id = id;
  }
}