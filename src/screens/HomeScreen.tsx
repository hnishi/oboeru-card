import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, useTheme, FAB } from "react-native-paper";
import { NavigationProps } from "../types/navigation";
import { useApp } from "../contexts/AppContext";

type Props = NavigationProps<"Home">;

export function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { state } = useApp();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      marginBottom: 24,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
    },
    card: {
      marginBottom: 16,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.primary + "40",
      borderRadius: 2,
      marginTop: 8,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    progressText: {
      marginTop: 8,
      color: colors.secondary,
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
    },
  });

  // 仮のフラッシュカードグループデータ
  const cardGroups = [
    {
      id: "pega-csa",
      name: "Pega Certified System Architect",
      totalCards: 50,
      completedCards: 0,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>おぼえるカード</Text>
      </View>
      {cardGroups.map((group) => (
        <Card
          key={group.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate("CardStudy", { groupId: group.id })
          }
        >
          <Card.Title title={group.name} />
          <Card.Content>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (group.completedCards / group.totalCards) * 100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              進捗: {group.completedCards}/{group.totalCards} カード
            </Text>
          </Card.Content>
        </Card>
      ))}
      <FAB
        icon="cog"
        style={styles.fab}
        onPress={() => navigation.navigate("Settings")}
        label="設定"
      />
    </View>
  );
}
