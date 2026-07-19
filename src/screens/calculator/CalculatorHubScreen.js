/**
 * GumiGenk Journal — Calculator Hub Screen
 * Grid of 10 trading calculators
 */

import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import Header from "../../components/common/Header";
import GlassCard from "../../components/common/GlassCard";
import GradientBackground from "../../components/common/GradientBackground";
import AnimatedView from "../../components/common/AnimatedView";

const CALCULATORS = [
  {
    id: "lotSize",
    name: "Lot Size",
    icon: "resize-outline",
    description: "Calculate optimal lot size based on risk",
    type: "neutral",
  },
  {
    id: "positionSize",
    name: "Position Size",
    icon: "expand-outline",
    description: "Determine position size from entry & SL",
    type: "neutral",
  },
  {
    id: "risk",
    name: "Risk",
    icon: "shield-outline",
    description: "Calculate risk amount in dollars",
    type: "loss",
  },
  {
    id: "riskPercent",
    name: "Risk %",
    icon: "pie-chart-outline",
    description: "Convert risk amount to percentage",
    type: "loss",
  },
  {
    id: "pipValue",
    name: "Pip Value",
    icon: "cash-outline",
    description: "Calculate value per pip movement",
    type: "profit",
  },
  {
    id: "margin",
    name: "Margin",
    icon: "lock-closed-outline",
    description: "Required margin for a position",
    type: "loss",
  },
  {
    id: "profit",
    name: "Profit",
    icon: "trending-up-outline",
    description: "Calculate potential profit/loss",
    type: "profit",
  },
  {
    id: "drawdown",
    name: "Drawdown",
    icon: "arrow-down-outline",
    description: "Calculate drawdown from peak",
    type: "loss",
  },
  {
    id: "compound",
    name: "Compound",
    icon: "rocket-outline",
    description: "Compound growth calculator",
    type: "profit",
  },
  {
    id: "riskReward",
    name: "Risk Reward",
    icon: "swap-vertical-outline",
    description: "Calculate risk-reward ratio",
    type: "profit",
  },
];

const CalculatorHubScreen = ({ navigation }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();

  const getColor = (type) => {
    if (type === "profit") return colors.profit;
    if (type === "loss") return colors.loss;
    return colors.accent;
  };

  return (
    <GradientBackground style={styles.container}>
      <Header
        title="Trading Calculator"
        titleStyle={{ fontFamily: fontFamily.serif, fontSize: 22 }}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedView animation="fadeSlideUp">
          <Text
            style={[
              styles.subtitle,
              { color: colors.textSecondary, fontFamily: fontFamily.regular },
            ]}
          >
            Professional trading calculators with industry-standard formulas
          </Text>
        </AnimatedView>

        <View style={styles.grid}>
          {CALCULATORS.map((calc, index) => {
            const iconColor = getColor(calc.type);
            return (
              <AnimatedView
                key={calc.id}
                animation="fadeSlideUp"
                delay={index * 60}
                style={styles.gridItem}
              >
                <GlassCard
                  variant="elevated"
                  onPress={() =>
                    navigation.navigate("CalculatorDetail", {
                      calculator: calc,
                    })
                  }
                  style={styles.calcCard}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: iconColor + "15",
                        borderWidth: 1,
                        borderColor: iconColor + "30",
                      },
                    ]}
                  >
                    <Ionicons name={calc.icon} size={22} color={iconColor} />
                  </View>
                  <Text
                    style={[
                      styles.calcName,
                      {
                        color: colors.textPrimary,
                        fontFamily: fontFamily.serif,
                      },
                    ]}
                  >
                    {calc.name}
                  </Text>
                  <Text
                    style={[
                      styles.calcDesc,
                      {
                        color: "rgba(255, 255, 255, 0.55)",
                        fontFamily: fontFamily.regular,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {calc.description}
                  </Text>
                </GlassCard>
              </AnimatedView>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  subtitle: { fontSize: 14, paddingHorizontal: 16, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12 },
  gridItem: { width: "50%", padding: 8 },
  calcCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  calcName: { fontSize: 16, textAlign: "center", marginBottom: 6 },
  calcDesc: { fontSize: 11, textAlign: "center", lineHeight: 16 },
});

export default CalculatorHubScreen;
