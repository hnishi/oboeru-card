import React, { useRef } from "react";
import {
  StyleSheet,
  Animated,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, useTheme } from "react-native-paper";

interface FlashCardProps {
  question: string;
  answer: string;
  explanation?: string;
  isFlipped: boolean;
  onFlip: () => void;
  showAnimation: boolean;
}

export function FlashCard({
  question,
  answer,
  explanation,
  isFlipped,
  onFlip,
  showAnimation,
}: FlashCardProps) {
  const { colors } = useTheme();
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginBottom: 16,
    },
    cardContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 16,
      elevation: 4,
      position: "absolute",
      backfaceVisibility: "hidden",
    },
    cardContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      textAlign: "center",
    },
    explanation: {
      fontSize: 14,
      color: colors.secondary,
      marginTop: 16,
      textAlign: "center",
    },
  });

  React.useEffect(() => {
    if (showAnimation) {
      Animated.spring(flipAnimation, {
        toValue: isFlipped ? 1 : 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      flipAnimation.setValue(isFlipped ? 1 : 0);
    }
  }, [isFlipped, showAnimation]);

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onFlip}>
        <View style={styles.cardContainer}>
          <Animated.View style={[styles.card, frontAnimatedStyle]}>
            <View style={styles.cardContent}>
              <Text style={styles.text}>{question}</Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, backAnimatedStyle]}>
            <View style={styles.cardContent}>
              <Text style={styles.text}>{answer}</Text>
              {explanation && (
                <Text style={styles.explanation}>{explanation}</Text>
              )}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
