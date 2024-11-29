// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDbSeedResponse = (status: string, message: string, data?: any, error?: any): string => {
  return JSON.stringify(
    {
      status,
      message,
      ...(data !== undefined && { data }),
      ...(error !== undefined && { error }),
    },
    null,
    2
  );
};
