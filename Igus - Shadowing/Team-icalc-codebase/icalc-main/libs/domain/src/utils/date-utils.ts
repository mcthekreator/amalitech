export class DateUtils {
  private static previousTimestampInEpoch = 0;

  public static getUniqueTimestamp(): Date {
    const currentTimeStampInEpoch = new Date().getTime();

    this.previousTimestampInEpoch = Math.max(currentTimeStampInEpoch, this.previousTimestampInEpoch + 1);
    return new Date(this.previousTimestampInEpoch);
  }
}
