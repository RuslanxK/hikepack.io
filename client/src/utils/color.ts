// src/utils/colorUtils.ts
export function getRandomDarkColor(existingColors: string[]): string {
    let color;
    do {
      color = "#";
      for (let i = 0; i < 3; i++) {
        const part = Math.floor(Math.random() * 256 * 0.6);
        color += ("0" + part.toString(16)).slice(-2);
      }
    } while (existingColors.includes(color));
  
    return color;
  }
  