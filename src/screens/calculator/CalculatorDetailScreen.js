/**
 * GumiGenk Journal — Calculator Detail Screen
 * Dynamic calculator screen that renders inputs based on calculator type
 */

import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import {
  calculateLotSize, calculatePositionSize, calculateRisk,
  calculateRiskPercentage, calculatePipValue, calculateMargin,
  calculateProfit, calculateDrawdown, calculateCompound,
  calculateRiskReward, INSTRUMENT_LIST,
} from '../../utils/calculators';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AnimatedView from '../../components/common/AnimatedView';

// Calculator field definitions
const CALC_FIELDS = {
  lotSize: [
    { key: 'balance', label: 'Account Balance', placeholder: '10000', type: 'decimal' },
    { key: 'riskPercent', label: 'Risk Percentage (%)', placeholder: '1', type: 'decimal' },
    { key: 'slPips', label: 'Stop Loss (Pips)', placeholder: '50', type: 'decimal' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  positionSize: [
    { key: 'balance', label: 'Account Balance', placeholder: '10000', type: 'decimal' },
    { key: 'riskPercent', label: 'Risk Percentage (%)', placeholder: '1', type: 'decimal' },
    { key: 'entryPrice', label: 'Entry Price', placeholder: '1.0890', type: 'decimal' },
    { key: 'stopLoss', label: 'Stop Loss Price', placeholder: '1.0840', type: 'decimal' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  risk: [
    { key: 'lotSize', label: 'Lot Size', placeholder: '0.10', type: 'decimal' },
    { key: 'slPips', label: 'Stop Loss (Pips)', placeholder: '50', type: 'decimal' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  riskPercent: [
    { key: 'balance', label: 'Account Balance', placeholder: '10000', type: 'decimal' },
    { key: 'riskAmount', label: 'Risk Amount ($)', placeholder: '100', type: 'decimal' },
  ],
  pipValue: [
    { key: 'lotSize', label: 'Lot Size', placeholder: '1.00', type: 'decimal' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  margin: [
    { key: 'lotSize', label: 'Lot Size', placeholder: '1.00', type: 'decimal' },
    { key: 'price', label: 'Current Price', placeholder: '1.0890', type: 'decimal' },
    { key: 'leverage', label: 'Leverage', placeholder: '100', type: 'number' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  profit: [
    { key: 'entryPrice', label: 'Entry Price', placeholder: '1.0890', type: 'decimal' },
    { key: 'exitPrice', label: 'Exit Price', placeholder: '1.0940', type: 'decimal' },
    { key: 'lotSize', label: 'Lot Size', placeholder: '1.00', type: 'decimal' },
    { key: 'direction', label: 'Direction', placeholder: 'BUY', type: 'direction' },
    { key: 'instrument', label: 'Instrument', placeholder: 'EUR/USD', type: 'text' },
  ],
  drawdown: [
    { key: 'peakBalance', label: 'Peak Balance', placeholder: '10000', type: 'decimal' },
    { key: 'currentBalance', label: 'Current Balance', placeholder: '8500', type: 'decimal' },
  ],
  compound: [
    { key: 'initialBalance', label: 'Initial Balance', placeholder: '10000', type: 'decimal' },
    { key: 'ratePercent', label: 'Monthly Return (%)', placeholder: '5', type: 'decimal' },
    { key: 'periods', label: 'Number of Periods', placeholder: '12', type: 'number' },
    { key: 'contribution', label: 'Monthly Addition ($)', placeholder: '0', type: 'decimal' },
  ],
  riskReward: [
    { key: 'entryPrice', label: 'Entry Price', placeholder: '1.0890', type: 'decimal' },
    { key: 'stopLoss', label: 'Stop Loss', placeholder: '1.0840', type: 'decimal' },
    { key: 'takeProfit', label: 'Take Profit', placeholder: '1.0990', type: 'decimal' },
    { key: 'direction', label: 'Direction', placeholder: 'BUY', type: 'direction' },
  ],
};

const CalculatorDetailScreen = ({ navigation, route }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const { settings } = useSettings();
  const calculator = route.params?.calculator;

  if (!calculator) {
    navigation.goBack();
    return null;
  }

  const fields = CALC_FIELDS[calculator.id] || [];
  const [values, setValues] = useState(() => {
    const initial = {};
    fields.forEach(f => {
      if (f.key === 'balance') initial[f.key] = settings.accountBalance.toString();
      else if (f.key === 'leverage') initial[f.key] = settings.leverage.toString();
      else if (f.key === 'riskPercent') initial[f.key] = settings.defaultRiskPercent.toString();
      else if (f.key === 'instrument') initial[f.key] = 'EUR/USD';
      else if (f.key === 'direction') initial[f.key] = 'BUY';
      else initial[f.key] = '';
    });
    return initial;
  });

  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const params = {};
    fields.forEach(f => {
      if (f.type === 'decimal') params[f.key] = parseFloat(values[f.key]) || 0;
      else if (f.type === 'number') params[f.key] = parseInt(values[f.key]) || 0;
      else params[f.key] = values[f.key];
    });

    let calcResult;
    switch (calculator.id) {
      case 'lotSize': calcResult = calculateLotSize(params); break;
      case 'positionSize': calcResult = calculatePositionSize(params); break;
      case 'risk': calcResult = calculateRisk(params); break;
      case 'riskPercent': calcResult = calculateRiskPercentage(params); break;
      case 'pipValue': calcResult = calculatePipValue(params); break;
      case 'margin': calcResult = calculateMargin(params); break;
      case 'profit': calcResult = calculateProfit(params); break;
      case 'drawdown': calcResult = calculateDrawdown(params); break;
      case 'compound': calcResult = calculateCompound(params); break;
      case 'riskReward': calcResult = calculateRiskReward(params); break;
      default: calcResult = {};
    }

    setResult(calcResult);
  };

  const handleReset = () => {
    const initial = {};
    fields.forEach(f => {
      if (f.key === 'balance') initial[f.key] = settings.accountBalance.toString();
      else if (f.key === 'leverage') initial[f.key] = settings.leverage.toString();
      else if (f.key === 'riskPercent') initial[f.key] = settings.defaultRiskPercent.toString();
      else if (f.key === 'instrument') initial[f.key] = 'EUR/USD';
      else if (f.key === 'direction') initial[f.key] = 'BUY';
      else initial[f.key] = '';
    });
    setValues(initial);
    setResult(null);
  };

  const formatResultKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatResultValue = (key, value) => {
    if (typeof value === 'object') return JSON.stringify(value);
    if (key.includes('ercent') || key.includes('Return')) return `${value}%`;
    if (key.includes('alance') || key.includes('mount') || key.includes('argin') || 
        key.includes('rofit') || key.includes('alue') || key.includes('ain')) {
      return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={calculator.name + ' Calculator'}
        showBack
        onBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AnimatedView animation="fadeSlideUp">
          <Card variant="accent" style={styles.infoCard}>
            <View style={[styles.iconCircle, { backgroundColor: calculator.color + '20' }]}>
              <Ionicons name={calculator.icon} size={28} color={calculator.color} />
            </View>
            <Text style={[styles.calcDesc, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
              {calculator.description}
            </Text>
          </Card>
        </AnimatedView>

        {/* Input Fields */}
        <AnimatedView animation="fadeSlideUp" delay={100}>
          <Card style={styles.inputCard}>
            {fields.map((field, index) => {
              if (field.type === 'direction') {
                return (
                  <View key={field.key} style={styles.directionContainer}>
                    <Text style={[styles.directionLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
                      {field.label}
                    </Text>
                    <View style={styles.directionRow}>
                      {['BUY', 'SELL'].map(dir => (
                        <Pressable
                          key={dir}
                          onPress={() => setValues(prev => ({ ...prev, [field.key]: dir }))}
                          style={[
                            styles.directionBtn,
                            {
                              backgroundColor: values[field.key] === dir
                                ? (dir === 'BUY' ? colors.profitLight : colors.lossLight)
                                : colors.card,
                              borderColor: values[field.key] === dir
                                ? (dir === 'BUY' ? colors.profit : colors.loss)
                                : colors.border,
                              borderRadius: br.md,
                            },
                          ]}
                        >
                          <Text style={[
                            styles.directionText,
                            {
                              color: values[field.key] === dir
                                ? (dir === 'BUY' ? colors.profit : colors.loss)
                                : colors.textSecondary,
                              fontFamily: values[field.key] === dir ? fontFamily.bold : fontFamily.medium,
                            },
                          ]}>
                            {dir}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              }

              return (
                <Input
                  key={field.key}
                  label={field.label}
                  value={values[field.key]}
                  onChangeText={(v) => setValues(prev => ({ ...prev, [field.key]: v }))}
                  placeholder={field.placeholder}
                  keyboardType={field.type === 'decimal' ? 'decimal-pad' : field.type === 'number' ? 'number-pad' : 'default'}
                />
              );
            })}
          </Card>
        </AnimatedView>

        {/* Actions */}
        <AnimatedView animation="fadeSlideUp" delay={200} style={styles.actionRow}>
          <Button
            title="Calculate"
            onPress={handleCalculate}
            variant="primary"
            size="lg"
            icon="calculator"
            fullWidth
            style={{ marginBottom: 8 }}
          />
          <Button
            title="Reset"
            onPress={handleReset}
            variant="ghost"
            size="md"
            icon="refresh-outline"
          />
        </AnimatedView>

        {/* Results */}
        {result && (
          <AnimatedView animation="fadeScale" delay={0}>
            <Card variant="elevated" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
                <Text style={[styles.resultTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                  Results
                </Text>
              </View>
              {Object.entries(result)
                .filter(([key, value]) => typeof value !== 'object' || !Array.isArray(value))
                .filter(([key]) => key !== 'schedule')
                .map(([key, value]) => (
                  <View key={key} style={[styles.resultRow, { borderBottomColor: colors.divider }]}>
                    <Text style={[styles.resultKey, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                      {formatResultKey(key)}
                    </Text>
                    <Text style={[styles.resultValue, { color: colors.accent, fontFamily: fontFamily.bold }]}>
                      {formatResultValue(key, value)}
                    </Text>
                  </View>
                ))}
              
              {/* Compound schedule preview */}
              {result.schedule && result.schedule.length > 0 && (
                <View style={styles.scheduleSection}>
                  <Text style={[styles.scheduleTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                    Growth Schedule
                  </Text>
                  {result.schedule.slice(0, 12).map((entry) => (
                    <View key={entry.period} style={[styles.scheduleRow, { borderBottomColor: colors.divider }]}>
                      <Text style={[styles.schedulePeriod, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
                        Period {entry.period}
                      </Text>
                      <Text style={[styles.scheduleBalance, { color: colors.profit, fontFamily: fontFamily.semiBold }]}>
                        ${entry.balance.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          </AnimatedView>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  infoCard: { marginBottom: 16, alignItems: 'center', paddingVertical: 20 },
  iconCircle: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  calcDesc: { fontSize: 14, textAlign: 'center' },
  inputCard: { marginBottom: 16 },
  directionContainer: { marginBottom: 16 },
  directionLabel: { fontSize: 13, marginBottom: 6, marginLeft: 2 },
  directionRow: { flexDirection: 'row', gap: 12 },
  directionBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5 },
  directionText: { fontSize: 14 },
  actionRow: { marginBottom: 16 },
  resultCard: { marginBottom: 16 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resultTitle: { fontSize: 16 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  resultKey: { fontSize: 14 },
  resultValue: { fontSize: 16 },
  scheduleSection: { marginTop: 16 },
  scheduleTitle: { fontSize: 14, marginBottom: 8 },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1 },
  schedulePeriod: { fontSize: 13 },
  scheduleBalance: { fontSize: 13 },
});

export default CalculatorDetailScreen;
