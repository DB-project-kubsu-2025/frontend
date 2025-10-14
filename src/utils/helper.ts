export const safeText = (str: any, replace: string = ''): string => {
  return str || replace;
};