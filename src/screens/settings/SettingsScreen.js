/**
 * GumiGenk Journal — Settings Screen
 * Premium grouped settings with categories
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useTrades } from '../../context/TradeContext';
import { APP_NAME, APP_VERSION } from '../../utils/constants';
import AnimatedView from '../../components/common/AnimatedView';
import { createBackup, restoreBackup, parseCSV } from '../../utils/storage';
import { exportPDF, exportCSV } from '../../utils/export';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const SettingsScreen = ({ navigation }) => {
  const { colors, fontFamily, isDark, toggleTheme, borderRadius: br } = useTheme();
  const { settings, updateSettings } = useSettings();
  const { trades, bulkImport } = useTrades();

  const handleBackup = async () => {
    try {
      const backupStr = await createBackup();
      if (!backupStr) {
        Alert.alert('Backup Failed', 'Could not compile backup data.');
        return;
      }
      const { uri } = await Print.printToFileAsync({
        html: `<html><body><pre>${backupStr}</pre></body></html>`
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('Backup Error', 'An error occurred during backup creation.');
    }
  };

  const handleRestore = () => {
    Alert.prompt(
      'Restore Backup',
      'Paste the backup JSON string below:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: async (jsonStr) => {
            if (jsonStr) {
              const success = await restoreBackup(jsonStr);
              if (success) {
                Alert.alert('Restore Success', 'All settings and trades have been restored. Please restart the app.');
              } else {
                Alert.alert('Restore Failed', 'Invalid backup format or content.');
              }
            }
          }
        }
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        {
          text: 'PDF Report',
          onPress: async () => {
            const success = await exportPDF(trades);
            if (success) Alert.alert('Export Success', 'Report exported.');
          }
        },
        {
          text: 'CSV File',
          onPress: async () => {
            const success = await exportCSV(trades);
            if (success) Alert.alert('Export Success', 'CSV exported.');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleImport = () => {
    Alert.alert(
      'Import Data',
      'Choose source:',
      [
        {
          text: 'Load Demo CSV Template',
          onPress: () => {
            const demoCSV = `Date,Time,Instrument,Direction,Entry,Exit,Lot,Profit/Loss,RR Ratio,Strategy,Session\n2024-07-20,10:30,GBP/USD,BUY,1.2650,1.2720,0.5,350.00,2.1,Breakout,London\n2024-07-21,15:45,XAU/USD,SELL,2415.00,2400.00,0.2,300.00,3.0,Order Block,New York`;
            const parsed = parseCSV(demoCSV);
            if (parsed && parsed.length > 0) {
              bulkImport(parsed);
              Alert.alert('Import Success', `${parsed.length} trades imported.`);
            }
          }
        },
        {
          text: 'Paste CSV Manually',
          onPress: () => {
            Alert.prompt(
              'Paste CSV Data',
              'Paste CSV text below:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Import',
                  onPress: (text) => {
                    if (text) {
                      const parsed = parseCSV(text);
                      if (parsed && parsed.length > 0) {
                        bulkImport(parsed);
                        Alert.alert('Import Success', `${parsed.length} trades imported.`);
                      } else {
                        Alert.alert('Import Failed', 'Invalid CSV format.');
                      }
                    }
                  }
                }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleLanguageSelect = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language:',
      [
        {
          text: 'English',
          onPress: () => {
            updateSettings({ language: 'en' });
            Alert.alert('Language Updated', 'Language set to English.');
          }
        },
        {
          text: 'Bahasa Indonesia',
          onPress: () => {
            updateSettings({ language: 'id' });
            Alert.alert('Bahasa Diperbarui', 'Bahasa diubah ke Bahasa Indonesia.');
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      `GumiGenk Journal values your privacy.\n\nAll your trading data, settings, and uploaded screenshots are stored locally on your device's secure storage. We do not transmit or sell any of your information to external servers.\n\nThank you for trusting GumiGenk Journal!`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const handleJournalConfig = () => {
    Alert.alert(
      'Journal Configuration',
      `Manage your journal preferences:\n\n• Show P/L in Pips: ${settings.showProfitInPips ? 'Yes' : 'No'}\n• Default Session: ${settings.defaultSession}\n• Date Format: ${settings.dateFormat}`,
      [
        {
          text: `Toggle Pips Display (${settings.showProfitInPips ? 'Turn Off' : 'Turn On'})`,
          onPress: () => {
            updateSettings({ showProfitInPips: !settings.showProfitInPips });
            Alert.alert('Settings Saved', 'Profit/loss display mode updated.');
          }
        },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const handleMarketConfig = () => {
    Alert.alert(
      'Market Config',
      `Customize your market ticker instruments and refresh rate. Currently utilizing demo pricing engine.`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const handleAccountOverview = () => {
    Alert.alert(
      'Account Overview',
      `Account Summary:\n\n• Initial Balance: $${settings.accountBalance.toLocaleString()}\n• Total Trades Logged: ${trades.length}\n• Current Net Profit: $${trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0).toFixed(2)}`,
      [
        { text: 'Adjust Balance', onPress: () => navigation.navigate('Profile') },
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  const sections = [
    {
      title: 'ACCOUNT',
      items: [
        { icon: 'person-circle-outline', label: 'Profile', screen: 'Profile', chevron: true },
        { icon: 'document-text-outline', label: 'Trading Journal', onPress: handleJournalConfig, chevron: true },
        { icon: 'trending-up-outline', label: 'Market Dashboard', onPress: handleMarketConfig, chevron: true },
        { icon: 'notifications-outline', label: 'Notifications', toggle: 'notificationsEnabled' },
        { icon: 'wallet-outline', label: 'Account Overview', onPress: handleAccountOverview, chevron: true },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { icon: 'calculator-outline', label: 'Trading Calculator', screen: 'CalculatorHub', chevron: true },
      ],
    },
    {
      title: 'APPEARANCE',
      items: [
        { icon: isDark ? 'moon' : 'sunny', label: 'Dark Theme', toggleTheme: true },
        { icon: 'language-outline', label: 'Language', value: settings.language === 'en' ? 'English' : 'Bahasa', onPress: handleLanguageSelect, chevron: true },
      ],
    },
    {
      title: 'DATA',
      items: [
        { icon: 'cloud-upload-outline', label: 'Backup', onPress: handleBackup, chevron: true },
        { icon: 'cloud-download-outline', label: 'Restore', onPress: handleRestore, chevron: true },
        { icon: 'download-outline', label: 'Export', onPress: handleExport, chevron: true },
        { icon: 'push-outline', label: 'Import', onPress: handleImport, chevron: true },
      ],
    },
    {
      title: 'INFO',
      items: [
        { icon: 'information-circle-outline', label: 'About', screen: 'About', chevron: true },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', onPress: handlePrivacyPolicy, chevron: true },
        { icon: 'code-slash-outline', label: 'Version', value: APP_VERSION },
      ],
    },
    {
      title: '',
      items: [
        { icon: 'log-out-outline', label: 'Logout', danger: true, onPress: () => {
          Alert.alert('Logout', 'This is a local-only app. Logout will clear your session.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK' },
          ]);
        }},
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedView animation="fadeSlideUp">
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
              Settings
            </Text>
          </View>
        </AnimatedView>

        {/* Profile Card */}
        <AnimatedView animation="fadeSlideUp" delay={50}>
          <Pressable
            onPress={() => navigation.navigate('Profile')}
            style={[styles.profileCard, { backgroundColor: colors.card, borderRadius: br.xl }]}
          >
            <View style={[styles.avatar, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="person" size={28} color={colors.accent} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Trader
              </Text>
              <Text style={[styles.profileEmail, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                {APP_NAME}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
          </Pressable>
        </AnimatedView>

        {/* Settings Sections */}
        {sections.map((section, sIndex) => (
          <AnimatedView key={sIndex} animation="fadeSlideUp" delay={100 + sIndex * 60}>
            {section.title ? (
              <Text style={[styles.sectionTitle, { color: colors.textTertiary, fontFamily: fontFamily.semiBold }]}>
                {section.title}
              </Text>
            ) : null}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderRadius: br.lg }]}>
              {section.items.map((item, iIndex) => (
                <Pressable
                  key={iIndex}
                  onPress={() => {
                    if (item.onPress) {
                      item.onPress();
                    } else if (item.screen) {
                      navigation.navigate(item.screen);
                    } else if (item.toggleTheme) {
                      toggleTheme();
                    }
                  }}
                  style={[
                    styles.settingItem,
                    {
                      borderBottomColor: colors.divider,
                      borderBottomWidth: iIndex < section.items.length - 1 ? 1 : 0,
                    },
                  ]}
                >
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.settingIcon,
                      {
                        backgroundColor: item.danger ? colors.lossLight : colors.accentLight,
                      },
                    ]}>
                      <Ionicons
                        name={item.icon}
                        size={20}
                        color={item.danger ? colors.loss : colors.accent}
                      />
                    </View>
                    <Text style={[
                      styles.settingLabel,
                      {
                        color: item.danger ? colors.loss : colors.textPrimary,
                        fontFamily: fontFamily.medium,
                      },
                    ]}>
                      {item.label}
                    </Text>
                  </View>

                  <View style={styles.settingRight}>
                    {item.value && (
                      <Text style={[styles.settingValue, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                        {item.value}
                      </Text>
                    )}
                    {item.toggle && (
                      <Switch
                        value={settings[item.toggle]}
                        onValueChange={(v) => updateSettings({ [item.toggle]: v })}
                        trackColor={{ false: colors.border, true: colors.accentLight }}
                        thumbColor={settings[item.toggle] ? colors.accent : colors.textTertiary}
                      />
                    )}
                    {item.toggleTheme && (
                      <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: colors.border, true: colors.accentLight }}
                        thumbColor={isDark ? colors.accent : colors.textTertiary}
                      />
                    )}
                    {item.chevron && (
                      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          </AnimatedView>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  headerTitle: { fontSize: 26 },
  profileCard: { marginHorizontal: 16, marginBottom: 24, padding: 16, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17 },
  profileEmail: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 12, letterSpacing: 1, marginLeft: 32, marginBottom: 8, marginTop: 16 },
  sectionCard: { marginHorizontal: 16, marginBottom: 8, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 14 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  settingLabel: { fontSize: 15 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 13 },
});

export default SettingsScreen;
