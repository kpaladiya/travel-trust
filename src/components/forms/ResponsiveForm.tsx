import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

const desktopBreakpoint = 768;
const labelColumnWidth = 180;
const controlColumnWidth = 560;
const secondaryContentWidth = controlColumnWidth + 48;

function useDesktopFormLayout() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= desktopBreakpoint;
}

export function ResponsiveForm({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const isDesktop = useDesktopFormLayout();

  return <View style={[styles.form, isDesktop && styles.desktopForm, style]}>{children}</View>;
}

export function FormField({
  label,
  children,
  style,
  labelStyle,
}: {
  label: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}) {
  const isDesktop = useDesktopFormLayout();

  return (
    <View style={[styles.field, isDesktop && styles.desktopField, style]}>
      <View style={[styles.labelColumn, isDesktop && styles.desktopLabelColumn]}>
        <Text style={[styles.label, labelStyle, isDesktop && styles.desktopLabel]}>{label}</Text>
      </View>
      <View style={[styles.controlColumn, isDesktop && styles.desktopControlColumn]}>{children}</View>
    </View>
  );
}

export function FormAction({
  children,
  centered = false,
  style,
}: {
  children: React.ReactNode;
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const isDesktop = useDesktopFormLayout();

  return <View style={[styles.action, isDesktop && styles.desktopAction, isDesktop && centered && styles.centeredAction, style]}>{children}</View>;
}

export function CenteredFormContent({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const isDesktop = useDesktopFormLayout();

  return <View style={[styles.form, isDesktop && styles.desktopSecondaryContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  desktopForm: {
    maxWidth: labelColumnWidth + 16 + controlColumnWidth,
    alignSelf: 'center',
  },
  field: {
    width: '100%',
    marginTop: 12,
  },
  desktopField: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelColumn: {
    width: '100%',
    marginBottom: 8,
  },
  desktopLabelColumn: {
    width: labelColumnWidth,
    marginRight: 16,
    marginBottom: 0,
    paddingTop: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  desktopLabel: {
    textAlign: 'right',
    marginTop: 0,
    marginBottom: 0,
  },
  controlColumn: {
    width: '100%',
  },
  desktopControlColumn: {
    width: 'auto',
    flex: 1,
    maxWidth: controlColumnWidth,
  },
  action: {
    width: '100%',
    marginTop: 20,
  },
  desktopAction: {
    width: controlColumnWidth,
    marginLeft: labelColumnWidth + 16,
  },
  centeredAction: {
    marginLeft: 0,
    alignSelf: 'center',
  },
  desktopSecondaryContent: {
    width: secondaryContentWidth,
    alignSelf: 'center',
  },
});
