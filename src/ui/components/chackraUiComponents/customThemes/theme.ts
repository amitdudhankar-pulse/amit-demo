import { extendTheme } from "../chackraCompReact";
import { cardTheme } from "../customThemes/cardTheme";

const theme = extendTheme({
  components: {
    Card: cardTheme,
  },
});

export default theme;
