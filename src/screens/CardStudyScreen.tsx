import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  IconButton,
  Button,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { NavigationProps } from "../types/navigation";
import { useApp } from "../contexts/AppContext";
import { Flashcard } from "../types/models";

type Props = NavigationProps<"CardStudy">;

export function CardStudyScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const { state, dispatch } = useApp();
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
    explanationText: {
      fontSize: 14,
      color: colors.secondary,
      marginTop: 16,
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

  const groupCards = state.flashcards.filter(
    (card) => card.groupId === groupId
  );
  const currentGroup = state.groups.find((group) => group.id === groupId);

  if (groupCards.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>カードが見つかりません</Text>
      </View>
    );
  }

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const currentCard = groupCards[currentIndex];

      // 進捗を更新
      dispatch({
        type: "UPDATE_CARD_PROGRESS",
        payload: {
          cardId: currentCard.id,
          isCorrect,
        },
      });

      // 設定に応じて自動で次のカードに進む
      if (state.settings.autoProgress) {
        handleNext();
      }
    },
    [currentIndex, groupCards, dispatch, state.settings.autoProgress]
  );

  const handleNext = () => {
    if (currentIndex < groupCards.length - 1) {
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

  const currentCard = groupCards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{currentGroup?.name}</Text>
      </View>

      <Text style={styles.progressText}>
        {currentIndex + 1} / {groupCards.length}
      </Text>

      <View style={styles.card} onTouchEnd={() => setIsFlipped(!isFlipped)}>
        <Text style={styles.cardText}>
          {isFlipped ? currentCard.answer : currentCard.question}
        </Text>
        {isFlipped && currentCard.explanation && (
          <Text style={styles.explanationText}>{currentCard.explanation}</Text>
        )}
      </View>

      <View style={styles.controls}>
        <IconButton
          icon="arrow-left"
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        />
        <Button mode="contained" onPress={() => handleAnswer(true)}>
          覚えた
        </Button>
        <Button mode="outlined" onPress={() => handleAnswer(false)}>
          まだ
        </Button>
        <IconButton
          icon="arrow-right"
          onPress={handleNext}
          disabled={currentIndex === groupCards.length - 1}
        />
      </View>
    </View>
  );
}
