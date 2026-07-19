/**
 * GumiGenk Journal — Trade Detail Screen
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTrades } from '../../context/TradeContext';
import { formatPL, formatDate, formatPercent } from '../../utils/formatters';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import AnimatedView from '../../components/common/AnimatedView';

const TradeDetailScreen = ({ navigation, route }) => {
  const { colors, fontFamily } = useTheme();
  const { deleteTrade } = useTrades();
  const trade = route.params?.trade;

  if (!trade) {
    navigation.goBack();
    return null;
  }

  const pl = trade.profitLoss || 0;
  const isProfit = pl >= 0;

  const handleDelete = () => {
    Alert.alert(
      'Delete Trade',
      `Are you sure you want to delete this ${trade.instrument} trade?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTrade(trade.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const DetailRow = ({ label, value, valueColor }) => (
    <View style={[styles.detailRow, { borderBottomColor: colors.divider }]}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor || colors.textPrimary, fontFamily: fontFamily.medium }]}>{value || '-'}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Trade Detail"
        showBack
        onBack={() => navigation.goBack()}
        rightActions={[
          { icon: 'create-outline', onPress: () => navigation.navigate('AddTrade', { trade }), color: colors.accent },
          { icon: 'trash-outline', onPress: handleDelete, color: colors.loss },
        ]}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <AnimatedView animation="fadeSlideUp" delay={0}>
          <Card variant="accent" style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={[styles.heroInstrument, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                  {trade.instrument}
                </Text>
                <Text style={[styles.heroDate, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                  {formatDate(trade.date, 'medium')} {trade.time && `at ${trade.time}`}
                </Text>
              </View>
              <Badge
                label={trade.direction || 'N/A'}
                variant={trade.direction === 'BUY' ? 'buy' : 'sell'}
                size="md"
              />
            </View>
            <Text style={[
              styles.heroPL,
              { color: isProfit ? colors.profit : colors.loss, fontFamily: fontFamily.bold },
            ]}>
              {formatPL(pl)}
            </Text>
            {trade.rrRatio ? (
              <Text style={[styles.heroRR, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
                RR: {trade.rrRatio.toFixed(2)}R
              </Text>
            ) : null}
          </Card>
        </AnimatedView>

        {/* Price Data */}
        <AnimatedView animation="fadeSlideUp" delay={100}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Price Data</Text>
            </View>
            <DetailRow label="Entry" value={trade.entry} />
            <DetailRow label="Exit" value={trade.exit} />
            <DetailRow label="Stop Loss" value={trade.stopLoss} />
            <DetailRow label="Take Profit" value={trade.takeProfit} />
          </Card>
        </AnimatedView>

        {/* Size & Risk */}
        <AnimatedView animation="fadeSlideUp" delay={200}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Size & Risk</Text>
            </View>
            <DetailRow label="Lot Size" value={trade.lot} />
            <DetailRow label="Risk %" value={trade.riskPercent ? `${trade.riskPercent}%` : '-'} />
          </Card>
        </AnimatedView>

        {/* Analysis */}
        <AnimatedView animation="fadeSlideUp" delay={300}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Analysis</Text>
            </View>
            <DetailRow label="Strategy" value={trade.strategy} />
            <DetailRow label="Session" value={trade.session} />
            <DetailRow label="Confluence" value={trade.confluence} />
            <DetailRow label="Emotion" value={trade.emotion} />
            <DetailRow label="Mistake" value={trade.mistake} />
          </Card>
        </AnimatedView>

        {/* Notes */}
        {(trade.lessonLearned || trade.notes) && (
          <AnimatedView animation="fadeSlideUp" delay={400}>
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="create" size={18} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Notes</Text>
              </View>
              {trade.lessonLearned && (
                <View style={styles.noteBlock}>
                  <Text style={[styles.noteLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>Lesson Learned</Text>
                  <Text style={[styles.noteText, { color: colors.textPrimary, fontFamily: fontFamily.regular }]}>{trade.lessonLearned}</Text>
                </View>
              )}
              {trade.notes && (
                <View style={styles.noteBlock}>
                  <Text style={[styles.noteLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>Notes</Text>
                  <Text style={[styles.noteText, { color: colors.textPrimary, fontFamily: fontFamily.regular }]}>{trade.notes}</Text>
                </View>
              )}
            </Card>
          </AnimatedView>
        )}

        {/* Tags */}
        {trade.tags && trade.tags.length > 0 && (
          <AnimatedView animation="fadeSlideUp" delay={500}>
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pricetags" size={18} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Tags</Text>
              </View>
              <View style={styles.tagsRow}>
                {trade.tags.map((tag, i) => (
                  <Badge key={i} label={tag} variant="accent" size="sm" style={{ marginRight: 6, marginBottom: 4 }} />
                ))}
              </View>
            </Card>
          </AnimatedView>
        )}

        {/* Screenshots / Images */}
        {trade.images && trade.images.length > 0 && (
          <AnimatedView animation="fadeSlideUp" delay={550}>
            <Card style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="image-outline" size={18} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>Trade Images</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
                {trade.images.map((uri, index) => (
                  <View key={index} style={styles.detailImageWrapper}>
                    <Image source={{ uri }} style={styles.detailImage} />
                  </View>
                ))}
              </ScrollView>
            </Card>
          </AnimatedView>
        )}

        {/* Actions */}
        <AnimatedView animation="fadeSlideUp" delay={600} style={styles.actionsSection}>
          <Button
            title="Edit Trade"
            onPress={() => navigation.navigate('AddTrade', { trade })}
            variant="primary"
            icon="create-outline"
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <Button
            title="Delete Trade"
            onPress={handleDelete}
            variant="danger"
            icon="trash-outline"
            fullWidth
          />
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  heroCard: { marginBottom: 12, paddingVertical: 20 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  heroInstrument: { fontSize: 22 },
  heroDate: { fontSize: 13, marginTop: 2 },
  heroPL: { fontSize: 32 },
  heroRR: { fontSize: 14, marginTop: 4 },
  section: { marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 15 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14 },
  noteBlock: { marginBottom: 12 },
  noteLabel: { fontSize: 12, marginBottom: 4 },
  noteText: { fontSize: 14, lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  actionsSection: { marginTop: 8 },
  imagesScroll: {
    marginTop: 10,
    flexDirection: 'row',
  },
  detailImageWrapper: {
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.2)',
  },
  detailImage: {
    width: 250,
    height: 150,
    resizeMode: 'cover',
  },
});

export default TradeDetailScreen;
