
export const cfgMandantory =
  (key: string, source?: {[key: string]: any}) => {
    const root = source ? source : process.env;
    if (!root[key]) {
      throw new Error(`Configuration not found: ${key}`);
    }
    return root[key];
  };

export const cfgOptional =
  (key: string, defaultValue?: any, source?: {[key: string]: any}) => {
    const root = source ? source : process.env;
    if (!root[key] && defaultValue === undefined) {
      throw new Error(`Configuration not found: ${key}`);
    } else if (!root[key] && defaultValue !== undefined) {
      return defaultValue;
    }
    return root[key];
  };
