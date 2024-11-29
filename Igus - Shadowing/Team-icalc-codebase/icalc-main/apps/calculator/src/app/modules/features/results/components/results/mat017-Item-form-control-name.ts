export class Mat017ItemFormControlName {
  private static separator = '|';

  #mat017ItemMatNumber: string;
  #configurationMatNumber: string;

  private constructor(mat017ItemMatNumber: string, configurationMatNumber: string) {
    this.#mat017ItemMatNumber = mat017ItemMatNumber;
    this.#configurationMatNumber = configurationMatNumber;
  }

  public get mat017ItemMatNumber(): string {
    return this.#mat017ItemMatNumber;
  }

  public get configurationMatNumber(): string {
    return this.#configurationMatNumber;
  }

  public static fromValues(mat017ItemMatNumber: string, configurationMatNumber: string): Mat017ItemFormControlName {
    return new Mat017ItemFormControlName(mat017ItemMatNumber, configurationMatNumber);
  }

  public static fromString(mat017ItemFormControlName: string): Mat017ItemFormControlName {
    if (mat017ItemFormControlName.indexOf(Mat017ItemFormControlName.separator) === -1) {
      throw new Error(`Mat017ItemFormControlName needs to be separated by ${Mat017ItemFormControlName.separator}.`);
    }
    const splitted = mat017ItemFormControlName.split(Mat017ItemFormControlName.separator);

    return new Mat017ItemFormControlName(splitted[0], splitted[1]);
  }

  public getName(): string {
    return `${this.#mat017ItemMatNumber}${Mat017ItemFormControlName.separator}${this.#configurationMatNumber}`;
  }
}
