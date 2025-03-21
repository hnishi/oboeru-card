import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button, useTheme, Card } from "react-native-paper";
import { NavigationProps } from "../types/navigation";
import { useApp } from "../contexts/AppContext";

type Props = NavigationProps<"Result">;

export function ResultScreen({ navigation, route }: Props) {
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
      alignItems: "center",
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
    },
    resultCard: {
      marginBottom: 16,
      padding: 16,
    },
    statValue: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.primary,
      textAlign: "center",
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 16,
      color: colors.secondary,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 24,
    },
  });

  const calculateResults = () => {
    if (!state.progress) {
      return {
        totalCards: 0,
        correctCount: 0,
        accuracy: 0,
      };
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayProgress = state.progress.cardProgress.filter(
      (progress) => new Date(progress.lastReviewed) >= todayStart
    );

    const correctCount = todayProgress.filter(
      (progress) => progress.status === "correct"
    ).length;

    return {
      totalCards: todayProgress.length,
      correctCount,
      accuracy:
        todayProgress.length > 0
          ? Math.round((correctCount / todayProgress.length) * 100)
          : 0,
    };
  };

  const results = calculateResults();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>学習完了！</Text>
      </View>

      <Card style={styles.resultCard}>
        <Card.Content>
          <Text style={styles.statValue}>{results.totalCards}</Text>
          <Text style={styles.statLabel}>学習したカード</Text>
        </Card.Content>
      </Card>

      <Card style={styles.resultCard}>
        <Card.Content>
          <Text style={styles.statValue}>{results.correctCount}</Text>
          <Text style={styles.statLabel}>覚えたカード</Text>
        </Card.Content>
      </Card>

      <Card style={styles.resultCard}>
        <Card.Content>
          <Text style={styles.statValue}>{results.accuracy}%</Text>
          <Text style={styles.statLabel}>正答率</Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => navigation.navigate("Home")}>
          ホームに戻る
        </Button>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          もう一度
        </Button>
      </View>
    </View>
  );
}
