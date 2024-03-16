export function mapStyles(styles: CSSModuleClasses, object: Record<string, unknown>, template: string) {
  const entries = Object.entries(object);

  return entries.map(([key, value]) => {
    const mapped = template.replace('$key', key).replace('$value', String(value));

    return styles[mapped];
  });
}
