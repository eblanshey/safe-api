// Add a restore method to global object to easily restore all needed sinon modifications
export function restore() {
  const args = Array.prototype.slice.call(arguments);

  args.forEach(func => func.restore());
}
