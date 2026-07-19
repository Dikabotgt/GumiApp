/**
 * GumiGenk Journal — About Screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';
import { APP_NAME, APP_VERSION, APP_TAGLINE } from '../../utils/constants';

const AboutScreen = ({ navigation }) => {
  const { colors, fontFamily } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="About" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimatedView animation="fadeScale">
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="analytics" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.appName, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{APP_NAME}</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>{APP_TAGLINE}</Text>
            <Text style={[styles.version, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>Version {APP_VERSION}</Text>
          </View>
        </AnimatedView>

        <AnimatedView animation="fadeSlideUp" delay={200}>
          <Card style={styles.infoCard}>
            <Text style={[styles.description, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
              GumiGenk Journal is a premium trading journal application designed for serious traders. 
              Track your trades, analyze your performance, and improve your trading strategy with 
              comprehensive analytics and professional-grade tools.
            </Text>
          </Card>
        </AnimatedView>

        <AnimatedView animation="fadeSlideUp" delay={300}>
          <Card style={styles.infoCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Features</Text>
            {[
              'Comprehensive Trade Journaling',
              'Advanced Performance Analytics',
              'Real-time Market Dashboard',
              '10 Professional Trading Calculators',
              'Dark & Light Premium Themes',
              'Export to PDF, CSV, Excel',
              'Backup & Restore',
            ].map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                <Text style={[styles.featureText, { color: colors.textPrimary, fontFamily: fontFamily.regular }]}>{feature}</Text>
              </View>
            ))}
          </Card>
        </AnimatedView>

        <AnimatedView animation="fadeSlideUp" delay={400}>
          <Card style={styles.infoCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Legal</Text>
            <Text style={[styles.legalText, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
              © 2024 GumiGenk Journal. All rights reserved.{'\n'}
              This application is for educational and informational purposes only. 
              Trading involves risk of loss.
            </Text>
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
  logoSection: { alignItems: 'center', paddingVertical: 32 },
  logoContainer: { width: 96, height: 96, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  appName: { fontSize: 24 },
  tagline: { fontSize: 14, marginTop: 4 },
  version: { fontSize: 12, marginTop: 8 },
  infoCard: { marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 22 },
  sectionTitle: { fontSize: 16, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureText: { fontSize: 14 },
  legalText: { fontSize: 12, lineHeight: 18 },
});

export default AboutScreen;
