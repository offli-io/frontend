export const getNavigatorLanguage = () =>
  navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : // : navigator.userLanguage ||
      navigator.language ||
      //   navigator.browserLanguage ||
      "sk";

// export const getCurrentLocale = () => {
//   const localeString = "en-US"; // The string representing the locale

//   const locale: Locale = new Intl.Locale(localeString);
//   return locale;
// };
