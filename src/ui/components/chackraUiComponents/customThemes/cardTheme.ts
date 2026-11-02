import { cardAnatomy } from "../chackraCompAnatomy";
import { createMultiStyleConfigHelpers } from "../chackraCompReact";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    marginBottom: "60px",
    marginTop: "60px",
    borderColor: "#2d2d2d",
    // gridColumnStart: 1,
    // gridColumnEnd: 3,
  },
});

const sizes = {
  md: definePartsStyle({
    container: {
      marginTop: "60px",
      marginBottom: "60px",
    },
  }),
  // sm should be used in mobile view but not is use now
  sm: definePartsStyle({
    container: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  }),
};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes });
