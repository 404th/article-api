function createError(value, msg, param, location) {
  return { value, msg, param, location };
}

module.exports = createError;
