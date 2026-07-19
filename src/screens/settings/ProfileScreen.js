/**
 * GumiGenk Journal — Profile Screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useTrades } from '../../context/TradeContext';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import AnimatedView from '../../components/common/AnimatedView';
import { APP_NAME } from '../../utils/constants';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { calculateStats } from '../../utils/calculations';

const ProfileScreen = ({ navigation }) => {
  const { colors, fontFamily } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { trades } = useTrades();
  const stats = calculateStats(trades, settings?.accountBalance || 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimatedView animation="fadeSlideUp">
          <View style={styles.avatarSection}>
            <View style={[styles.avatar, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="person" size={40} color={colors.accent} />
            </View>
            <Text style={[styles.appName, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{APP_NAME}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>Premium Trading Journal</Text>
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeSlideUp" delay={100}>
          <Card style={styles.statsCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Overview</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Total Trades', value: formatNumber(stats.totalTrades, 0) },
                { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%` },
                { label: 'Net P/L', value: formatCurrency(stats.netProfit) },
                { label: 'Best Streak', value: `${stats.maxWinStreak}` },
              ].map((s, i) => (
                <View key={i} style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.accent, fontFamily: fontFamily.bold }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </AnimatedView>

        <AnimatedView animation="fadeSlideUp" delay={200}>
          <Card style={styles.settingsCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Account Settings</Text>
            <Input
              label="Starting Balance (modal awal sebelum trade pertama)"
              value={settings.accountBalance.toString()}
              onChangeText={(v) => updateSettings({ accountBalance: parseFloat(v) || 0 })}
              keyboardType="decimal-pad"
              icon="wallet-outline"
            />
            <Input
              label="Default Lot Size"
              value={settings.defaultLotSize.toString()}
              onChangeText={(v) => updateSettings({ defaultLotSize: parseFloat(v) || 0.01 })}
              keyboardType="decimal-pad"
              icon="resize-outline"
            />
            <Input
              label="Leverage"
              value={settings.leverage.toString()}
              onChangeText={(v) => updateSettings({ leverage: parseInt(v) || 100 })}
              keyboardType="number-pad"
              icon="speedometer-outline"
            />
            <Input
              label="Default Risk %"
              value={settings.defaultRiskPercent.toString()}
              onChangeText={(v) => updateSettings({ defaultRiskPercent: parseFloat(v) || 1 })}
              keyboardType="decimal-pad"
              icon="shield-outline"
            />
          </Card>
        </AnimatedView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName: { fontSize: 20 },
  subtitle: { fontSize: 13, marginTop: 2 },
  statsCard: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, marginBottom: 14 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 18, marginBottom: 4 },
  statLabel: { fontSize: 11 },
  settingsCard: { marginBottom: 12 },
});

export default ProfileScreen;
