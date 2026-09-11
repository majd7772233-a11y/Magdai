export type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital';

export class UnitConverterTool {
  static convert(
    category: UnitCategory,
    value: number,
    fromUnit: string,
    toUnit: string,
  ): number {
    if (fromUnit === toUnit) return value;

    if (category === 'temperature') {
      if (fromUnit === 'C' && toUnit === 'F') return (value * 9) / 5 + 32;
      if (fromUnit === 'F' && toUnit === 'C') return ((value - 32) * 5) / 9;
      if (fromUnit === 'C' && toUnit === 'K') return value + 273.15;
      if (fromUnit === 'K' && toUnit === 'C') return value - 273.15;
    }

    if (category === 'length') {
      const meters: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        inch: 0.0254,
        ft: 0.3048,
      };
      if (meters[fromUnit] && meters[toUnit]) {
        const inMeters = value * meters[fromUnit];
        return inMeters / meters[toUnit];
      }
    }

    if (category === 'digital') {
      const bytes: Record<string, number> = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
      };
      if (bytes[fromUnit] && bytes[toUnit]) {
        const inBytes = value * bytes[fromUnit];
        return inBytes / bytes[toUnit];
      }
    }

    return value;
  }
}
