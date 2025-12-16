export class ExistingLinkError extends Error {
  constructor() {
    super("Já existe um link encurtado com essa URL.");
  }
}
