import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, List, Switch, useTheme, IconButton } from "react-native-paper";
import { NavigationProps } from "../types/navigation";
import { useApp } from "../contexts/AppContext";
import { Theme } from "../types/models";

type Props = NavigationProps<"Settings">;

export function SettingsScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { state, dispatch } = useApp();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      padding: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      marginLeft: 8,
    },
  });

  const handleThemeChange = (theme: Theme) => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  const handleToggleSetting = (
    setting: keyof Omit<typeof state.settings, "theme">
  ) => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: {
        [setting]: !state.settings[setting],
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>設定</Text>
      </View>

      <List.Section>
        <List.Subheader>アピアランス</List.Subheader>
        <List.Item
          title="テーマ"
          description="ライト / ダーク / システム"
          onPress={() => {
            const themes: Theme[] = ["light", "dark", "system"];
            const currentIndex = themes.indexOf(state.theme);
            const nextTheme = themes[(currentIndex + 1) % themes.length];
            handleThemeChange(nextTheme);
          }}
          right={() => <Text>{state.theme}</Text>}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>カード設定</List.Subheader>
        <List.Item
          title="カードアニメーション"
          description="カードをめくる時のアニメーション"
          right={() => (
            <Switch
              value={state.settings.cardAnimation}
              onValueChange={() => handleToggleSetting("cardAnimation")}
            />
          )}
        />
        <List.Item
          title="自動進行"
          description="正解/不正解選択後に自動で次のカードへ"
          right={() => (
            <Switch
              value={state.settings.autoProgress}
              onValueChange={() => handleToggleSetting("autoProgress")}
            />
          )}
        />
      </List.Section>
    </View>
  );
}
