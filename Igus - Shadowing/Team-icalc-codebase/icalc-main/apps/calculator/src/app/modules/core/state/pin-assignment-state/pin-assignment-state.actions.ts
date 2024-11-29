export class SetBase64Image {
  public static readonly type = '[SetBase64Image] sets the the base64-encoded screenshot of the pin assignment';
  constructor(public payload: string) {}
}

export class SetBase64ImageSucceeded {
  public static readonly type =
    '[SetBase64ImageSucceeded] confirms base64-encoded screenshot has been set in pin assignment state';
}
