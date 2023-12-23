//Capitalize word - Variant-1 =========
function toTitleCapitalize(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((letter: string) => letter.charAt(0).toUpperCase() + letter.slice(1))
    .join(' ');
}

//Capitalize word - Variant-2 =========

//function toTitleCapitalize(str: string): string {
//   const splitStr = str.toLowerCase().split(' ');

//   for (let i = 0; i < splitStr.length; i++) {
//     splitStr[i] =
//       splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
//   }
//   return splitStr.join(' ');
// }
//=====================================

export { toTitleCapitalize };
