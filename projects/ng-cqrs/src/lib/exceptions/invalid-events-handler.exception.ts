export class InvalidEventsHandlerException extends Error {
  constructor() {
    super(
      `Invalid event handler exception (missing @NgEventsHandler() decorator?)`,
    );
  }
}
