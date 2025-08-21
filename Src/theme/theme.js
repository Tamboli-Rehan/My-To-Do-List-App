import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    primary: "#000000",
    border: "#000000ff",
    floatingIcon: "#000000",
    placeholder: "#36282880",
    active: "#000000ff",
  },
};

export const DarkBWTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#000000",
    card: "#000000",
    text: "#FFFFFF",
    primary: "#FFFFFF",
    border: "#ffffffff",
    floatingIcon: "#FFFFFF",
    placeholder: "#ffffff80",
    active: "#161616",
  },
};
