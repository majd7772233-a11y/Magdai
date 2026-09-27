import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';

export interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glow?: boolean;
  glowColor?: string;
  gradientColors?: string[];
  borderRadius?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  glow = false,
  glowColor = 'rgba(99, 102, 241, 0.35)',
  gradientColors,
  borderRadius = 20,
}) => {
  const theme = useTheme();
  const isDark = theme.dark;

  const defaultGradient = isDark
    ? ['rgba(30, 35, 55, 0.75)', 'rgba(18, 20, 32, 0.65)']
    : ['rgba(255, 255, 255, 0.85)', 'rgba(240, 243, 250, 0.75)'];

  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(255, 255, 255, 0.6)';

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderColor,
          boxShadow: glow ? `0px 4px 20px ${glowColor}` : '0px 2px 10px rgba(0,0,0,0.08)',
        },
        style,
      ]}>
      <LinearGradient
        colors={gradientColors || defaultGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.gradient, {borderRadius}]}>
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
});
