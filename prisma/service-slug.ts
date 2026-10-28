export function enumNameToSlug(enumName: string): string {
  return enumName.toLowerCase().replace(/_/g, "-");
}
