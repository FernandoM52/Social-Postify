import { HttpException, HttpStatus } from "@nestjs/common";

export class MediaUsernameConflict extends HttpException {
  private _titles: string;
  private _username: string;

  constructor(title: string, username: string) {
    super(`The username '${username}' is unvaible on ${title}`, HttpStatus.CONFLICT);
    this._titles = title;
    this._username = username;
  }
}