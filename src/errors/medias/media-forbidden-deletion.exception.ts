import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenMediaDeletion extends HttpException {
  private _title: string;

  constructor(title: string) {
    super(`Cannot delete media '${title}', there is a post associated with it`, HttpStatus.FORBIDDEN);
    this._title = title;
  }
}