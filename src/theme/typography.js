import { Platform } from 'react-native';

export const fontFamily = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
  serif: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
};

export const lineHeight = {
  xs: 14,
  sm: 16,
  md: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 48,
};

export const textStyles = {
  // Display
  displayLg: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    fontWeight: '700',
  },
  displayMd: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: '700',
  },
  displaySm: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: '700',
  },
  
  // Headings
  h1: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: '600',
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
  },
  
  // Body
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
  },
  bodyMd: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  bodyXs: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  
  // Labels
  labelLg: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
  },
  labelMd: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
  },
  labelSm: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
  },
  labelXs: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
  },
  
  // Mono (for numbers/prices)
  monoLg: {
    fontFamily: fontFamily.monoBold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontVariant: ['tabular-nums'],
  },
  monoMd: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontVariant: ['tabular-nums'],
  },
  monoSm: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontVariant: ['tabular-nums'],
  },
};
