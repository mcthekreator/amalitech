global.fail = (reason: unknown = 'fail was called in a test.'): never => {
  throw typeof reason === 'string' ? new Error(reason) : reason;
};
