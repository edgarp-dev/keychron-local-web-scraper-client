export default class ConsoleLogger {
  public static log(message: string) {
    console.log("#########################");
    console.log(message);
    console.log("#########################");
  }

  public static logError(errorMessage: string) {
    console.log("########## ERROR ##########");
    console.log(errorMessage);
    console.log("########## ERROR ##########");
  }
}
