import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Text, IconButton, Button, useTheme } from "react-native-paper";
import { NavigationProps } from "../types/navigation";
import { useApp } from "../contexts/AppContext";

type Props = NavigationProps<"CardStudy">;

export function CardStudyScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { state } = useApp();
  const { groupId } = route.params;

  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      marginLeft: 8,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      justifyContent: "center",
      alignItems: "center",
    },
    cardText: {
      fontSize: 18,
      textAlign: "center",
    },
    controls: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
    },
    progressText: {
      textAlign: "center",
      marginBottom: 16,
      color: colors.secondary,
    },
  });

  // 仮のフラッシュカードデータ
  const cards = [
    {
      id: "1",
      question: "Pega Platform とは何か？",
      answer:
        "ローコード開発プラットフォームで、ビジネスプロセス管理（BPM）とカスタマーエンゲージメントを実現するためのツール",
    },
    {
      id: "2",
      question: "Case Management とは？",
      answer:
        "ビジネスプロセスを管理・追跡するための機能で、作業の進捗状況や関連データを一元管理する仕組み",
    },
  ];

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      navigation.navigate("Result", { studySessionId: "session-1" });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Pega CSA</Text>
      </View>

      <Text style={styles.progressText}>
        {currentIndex + 1} / {cards.length}
      </Text>

      <View style={styles.card} onTouchEnd={() => setIsFlipped(!isFlipped)}>
        <Text style={styles.cardText}>
          {isFlipped ? currentCard.answer : currentCard.question}
        </Text>
      </View>

      <View style={styles.controls}>
        <IconButton
          icon="arrow-left"
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        />
        <Button
          mode="contained"
          onPress={() => {
            // 正解として記録
            handleNext();
          }}
        >
          覚えた
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            // 不正解として記録
            handleNext();
          }}
        >
          まだ
        </Button>
        <IconButton
          icon="arrow-right"
          onPress={handleNext}
          disabled={currentIndex === cards.length - 1}
        />
      </View>
    </View>
  );
}
