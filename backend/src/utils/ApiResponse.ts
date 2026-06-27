export class ApiResponse<T = any> {
  public readonly success: boolean = true;
  public readonly message: string;
  public readonly data: T;

  constructor(message: string = '', data: T = {} as T) {
    this.message = message;
    this.data = data;
  }
}
