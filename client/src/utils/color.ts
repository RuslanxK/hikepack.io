// src/utils/colorUtils.ts
export function getRandomSolidColor(existingColors: string[]): string {
  let color;
  do {
    color = "#";
    for (let i = 0; i < 3; i++) {
      // Generate a solid, muted color value in the range of 80-160
      const part = Math.floor(80 + Math.random() * 80); // 80-160 range
      color += ("0" + part.toString(16)).slice(-2);
    }
  } while (existingColors.includes(color));

  return color;
}
