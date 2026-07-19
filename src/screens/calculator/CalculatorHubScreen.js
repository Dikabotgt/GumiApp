/**
 * GumiGenk Journal — Calculator Hub Screen
 * Grid of 10 trading calculators
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';

const CALCULATORS = [
  { id: 'lotSize', name: 'Lot Size', icon: 'resize-outline', description: 'Calculate optimal lot size based on risk', color: '#00D4AA' },
  { id: 'positionSize', name: 'Position Size', icon: 'expand-outline', description: 'Determine position size from entry & SL', color: '#448AFF' },
  { id: 'risk', name: 'Risk', icon: 'shield-outline', description: 'Calculate risk amount in dollars', color: '#FF5252' },
  { id: 'riskPercent', name: 'Risk %', icon: 'pie-chart-outline', description: 'Convert risk amount to percentage', color: '#FFC107' },
  { id: 'pipValue', name: 'Pip Value', icon: 'cash-outline', description: 'Calculate value per pip movement', color: '#7C4DFF' },
  { id: 'margin', name: 'Margin', icon: 'lock-closed-outline', description: 'Required margin for a position', color: '#FF6D00' },
  { id: 'profit', name: 'Profit', icon: 'trending-up-outline', description: 'Calculate potential profit/loss', color: '#00E676' },
  { id: 'drawdown', name: 'Drawdown', icon: 'arrow-down-outline', description: 'Calculate drawdown from peak', color: '#FF1744' },
  { id: 'compound', name: 'Compound', icon: 'rocket-outline', description: 'Compound growth calculator', color: '#00BCD4' },
  { id: 'riskReward', name: 'Risk Reward', icon: 'swap-vertical-outline', description: 'Calculate risk-reward ratio', color: '#FFB800' },
];

const CalculatorHubScreen = ({ navigation }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Trading Calculator" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimatedView animation="fadeSlideUp">
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
            Professional trading calculators with industry-standard formulas
          </Text>
        </AnimatedView>

        <View style={styles.grid}>
          {CALCULATORS.map((calc, index) => (
            <AnimatedView
              key={calc.id}
              animation="fadeSlideUp"
              delay={index * 60}
              style={styles.gridItem}
            >
              <Card
                onPress={() => navigation.navigate('CalculatorDetail', { calculator: calc })}
                style={styles.calcCard}
              >
                <View style={[styles.iconContainer, { backgroundColor: calc.color + '20' }]}>
                  <Ionicons name={calc.icon} size={24} color={calc.color} />
                </View>
                <Text style={[styles.calcName, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                  {calc.name}
                </Text>
                <Text style={[styles.calcDesc, { color: colors.textTertiary, fontFamily: fontFamily.regular }]} numberOfLines={2}>
                  {calc.description}
                </Text>
              </Card>
            </AnimatedView>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  subtitle: { fontSize: 14, paddingHorizontal: 16, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridItem: { width: '50%', padding: 4 },
  calcCard: { alignItems: 'center', paddingVertical: 20 },
  iconContainer: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  calcName: { fontSize: 14, textAlign: 'center', marginBottom: 4 },
  calcDesc: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
});

export default CalculatorHubScreen;
