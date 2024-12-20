// src/utils/colorUtils.ts
export function getRandomDarkColor(existingColors: string[]): string {
  let color;
  do {
    color = "#";
    for (let i = 0; i < 3; i++) {
      // Generate a brighter value by limiting the random value closer to 255
      const part = Math.floor(128 + Math.random() * 128); // 128-255 range
      color += ("0" + part.toString(16)).slice(-2);
    }
  } while (existingColors.includes(color));

  return color;
}
