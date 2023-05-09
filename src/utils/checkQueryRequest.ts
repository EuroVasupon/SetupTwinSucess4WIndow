export default (
  value: unknown // string | ParsedQs | string[] | QueryString.ParsedQs[] | undefined
): string | null => {
  if (value && typeof value === 'string' && value.length > 0) {
    return value;
  }

  return null;
};
