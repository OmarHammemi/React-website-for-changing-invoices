export class DataTransformer {

  public static intToBoolean(value, obj, type) {
    if (typeof value === 'number') {
      return value === 1 ? true : false;
    }
    return value;
  }
}
