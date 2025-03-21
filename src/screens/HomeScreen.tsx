import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Card,
  useTheme,
  FAB,
  ActivityIndicator,
} from "react-native-paper";
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (state.isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const getGroupProgress = (groupId: string) => {
    if (!state.progress || !state.flashcards) return { completed: 0, total: 0 };

    const groupCards = state.flashcards.filter(
      (card) => card.groupId === groupId
    );
    const completedCards = state.progress.cardProgress.filter(
      (progress) =>
        progress.status === "correct" &&
        groupCards.some((card) => card.id === progress.cardId)
    );

    return {
      completed: completedCards.length,
      total: groupCards.length,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>おぼえるカード</Text>
      </View>

      {state.groups.map((group) => {
        const progress = getGroupProgress(group.id);

        return (
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
                      width: `${(progress.completed / progress.total) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                進捗: {progress.completed}/{progress.total} カード
              </Text>
            </Card.Content>
          </Card>
        );
      })}

      <FAB
        icon="cog"
        style={styles.fab}
        onPress={() => navigation.navigate("Settings")}
        label="設定"
      />
    </View>
  );
}
