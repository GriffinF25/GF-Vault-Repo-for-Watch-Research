import { useWindowDimensions } from "react-native";

// The app was originally designed mobile-first (max 480px column). These
// breakpoints let specific screens opt into a wider, multi-column layout
// when actually viewed on the web instead of stretching the same narrow
// column across a desktop browser.
export function useResponsive() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 700;
  const isDesktop = width >= 1000;
  const containerMaxWidth = isDesktop ? 1100 : isTablet ? 760 : 480;
  return { width, isTablet, isDesktop, containerMaxWidth };
}
