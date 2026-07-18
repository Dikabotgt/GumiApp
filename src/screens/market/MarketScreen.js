/**
 * GumiGenk Journal — Market Screen
 * Market dashboard with instruments, news, sentiment
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';
import Badge from '../../components/common/Badge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock market data
const MARKET_DATA = {
  forex: [
    { symbol: 'EUR/USD', price: 1.0892, change: 0.15, changePercent: 0.014 },
    { symbol: 'GBP/USD', price: 1.2734, change: -0.22, changePercent: -0.017 },
    { symbol: 'USD/JPY', price: 154.82, change: 0.45, changePercent: 0.029 },
    { symbol: 'AUD/USD', price: 0.6543, change: 0.08, changePercent: 0.012 },
    { symbol: 'USD/CHF', price: 0.8876, change: -0.12, changePercent: -0.014 },
    { symbol: 'USD/CAD', price: 1.3621, change: 0.18, changePercent: 0.013 },
  ],
  metals: [
    { symbol: 'XAU/USD', price: 2438.50, change: 12.30, changePercent: 0.51 },
    { symbol: 'XAG/USD', price: 31.24, change: -0.18, changePercent: -0.57 },
  ],
  crypto: [
    { symbol: 'BTC/USD', price: 67842.50, change: 1245.00, changePercent: 1.87 },
    { symbol: 'ETH/USD', price: 3456.80, change: -45.20, changePercent: -1.29 },
    { symbol: 'SOL/USD', price: 178.42, change: 5.63, changePercent: 3.26 },
  ],
  indices: [
    { symbol: 'NAS100', price: 18542.30, change: 125.40, changePercent: 0.68 },
    { symbol: 'US30', price: 39821.50, change: -87.30, changePercent: -0.22 },
    { symbol: 'SPX500', price: 5432.10, change: 18.70, changePercent: 0.35 },
    { symbol: 'DXY', price: 104.28, change: -0.15, changePercent: -0.14 },
  ],
};

const MOCK_NEWS = [
  { id: 1, title: 'Fed Signals Potential Rate Cut in September', source: 'Reuters', time: '2h ago', impact: 'high' },
  { id: 2, title: 'Gold Hits Record High Amid Geopolitical Tensions', source: 'Bloomberg', time: '4h ago', impact: 'high' },
  { id: 3, title: 'Bitcoin ETF Sees Record Inflows', source: 'CoinDesk', time: '6h ago', impact: 'medium' },
  { id: 4, title: 'European PMI Data Misses Expectations', source: 'FX Street', time: '8h ago', impact: 'medium' },
  { id: 5, title: 'Oil Prices Steady as OPEC+ Maintains Cuts', source: 'CNBC', time: '12h ago', impact: 'low' },
];

const CALENDAR_EVENTS = [
  { time: '08:30', event: 'US Non-Farm Payrolls', impact: 'high', actual: '206K', forecast: '190K', previous: '218K' },
  { time: '10:00', event: 'ISM Services PMI', impact: 'high', actual: '-', forecast: '52.5', previous: '53.8' },
  { time: '14:00', event: 'FOMC Minutes', impact: 'high', actual: '-', forecast: '-', previous: '-' },
  { time: '15:30', event: 'US Crude Oil Inventories', impact: 'medium', actual: '-', forecast: '-1.2M', previous: '-2.5M' },
];

const CATEGORIES = ['All', 'Forex', 'Metals', 'Crypto', 'Indices'];

const MarketScreen = ({ navigation }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const [fearGreedValue] = useState(62);

  const getMarketItems = () => {
    switch (activeCategory) {
      case 'Forex': return MARKET_DATA.forex;
      case 'Metals': return MARKET_DATA.metals;
      case 'Crypto': return MARKET_DATA.crypto;
      case 'Indices': return MARKET_DATA.indices;
      default: return [...MARKET_DATA.metals, ...MARKET_DATA.forex, ...MARKET_DATA.crypto, ...MARKET_DATA.indices];
    }
  };

  const InstrumentCard = ({ item, index }) => {
    const isPositive = item.changePercent >= 0;
    return (
      <AnimatedView animation="fadeSlideUp" delay={index * 50} style={styles.instrumentWrapper}>
        <Card style={styles.instrumentCard}>
          <View style={styles.instrumentHeader}>
            <Text style={[styles.instrumentSymbol, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
              {item.symbol}
            </Text>
            <Badge
              label={`${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%`}
              variant={isPositive ? 'profit' : 'loss'}
              size="xs"
            />
          </View>
          <Text style={[styles.instrumentPrice, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[
            styles.instrumentChange,
            { color: isPositive ? colors.profit : colors.loss, fontFamily: fontFamily.medium },
          ]}>
            {isPositive ? '+' : ''}{item.change.toFixed(2)}
          </Text>
          {/* Mini sparkline */}
          <View style={styles.sparkline}>
            {[...Array(12)].map((_, i) => {
              const h = 4 + Math.random() * 16;
              return (
                <View
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    backgroundColor: isPositive ? colors.profit : colors.loss,
                    borderRadius: 1.5,
                    opacity: 0.4 + (i / 12) * 0.6,
                  }}
                />
              );
            })}
          </View>
        </Card>
      </AnimatedView>
    );
  };

  const getFearGreedColor = () => {
    if (fearGreedValue <= 25) return colors.loss;
    if (fearGreedValue <= 45) return colors.warning;
    if (fearGreedValue <= 55) return colors.textSecondary;
    if (fearGreedValue <= 75) return colors.profit;
    return colors.profit;
  };

  const getFearGreedLabel = () => {
    if (fearGreedValue <= 25) return 'Extreme Fear';
    if (fearGreedValue <= 45) return 'Fear';
    if (fearGreedValue <= 55) return 'Neutral';
    if (fearGreedValue <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <AnimatedView animation="fadeSlideUp">
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                Market
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                Live market overview
              </Text>
            </View>
            <View style={[styles.headerBadge, { backgroundColor: colors.profitLight }]}>
              <Ionicons name="trending-up" size={20} color={colors.profit} />
            </View>
          </View>
        </AnimatedView>

        {/* Category Tabs */}
        <AnimatedView animation="fadeSlideUp" delay={50}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor: activeCategory === cat ? colors.accent : colors.card,
                    borderRadius: br.full,
                  },
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  {
                    color: activeCategory === cat ? colors.textInverse : colors.textSecondary,
                    fontFamily: activeCategory === cat ? fontFamily.semiBold : fontFamily.medium,
                  },
                ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </AnimatedView>

        {/* Instrument Grid */}
        <View style={styles.instrumentGrid}>
          {getMarketItems().map((item, index) => (
            <InstrumentCard key={item.symbol} item={item} index={index} />
          ))}
        </View>

        {/* Fear & Greed Index */}
        <AnimatedView animation="fadeSlideUp" delay={300}>
          <Card style={styles.fearGreedCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
              Fear & Greed Index
            </Text>
            <View style={styles.fearGreedContent}>
              <View style={[styles.fearGreedGauge, { borderColor: getFearGreedColor() }]}>
                <Text style={[styles.fearGreedValue, { color: getFearGreedColor(), fontFamily: fontFamily.bold }]}>
                  {fearGreedValue}
                </Text>
              </View>
              <View style={styles.fearGreedInfo}>
                <Text style={[styles.fearGreedLabel, { color: getFearGreedColor(), fontFamily: fontFamily.semiBold }]}>
                  {getFearGreedLabel()}
                </Text>
                <View style={styles.fearGreedBar}>
                  <View style={[styles.fearGreedFill, { width: `${fearGreedValue}%`, backgroundColor: getFearGreedColor() }]} />
                </View>
                <View style={styles.fearGreedLabels}>
                  <Text style={[styles.fearGreedEndLabel, { color: colors.loss, fontFamily: fontFamily.regular }]}>Fear</Text>
                  <Text style={[styles.fearGreedEndLabel, { color: colors.profit, fontFamily: fontFamily.regular }]}>Greed</Text>
                </View>
              </View>
            </View>
          </Card>
        </AnimatedView>

        {/* Market Sentiment */}
        <AnimatedView animation="fadeSlideUp" delay={400}>
          <Card style={styles.sentimentCard}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
              Market Sentiment
            </Text>
            {[
              { label: 'EUR/USD', bullish: 62 },
              { label: 'GBP/USD', bullish: 45 },
              { label: 'XAU/USD', bullish: 78 },
              { label: 'BTC/USD', bullish: 71 },
            ].map((item, index) => (
              <View key={item.label} style={styles.sentimentRow}>
                <Text style={[styles.sentimentLabel, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                  {item.label}
                </Text>
                <View style={styles.sentimentBarContainer}>
                  <View style={[styles.sentimentBarBull, { flex: item.bullish, backgroundColor: colors.profit }]} />
                  <View style={[styles.sentimentBarBear, { flex: 100 - item.bullish, backgroundColor: colors.loss }]} />
                </View>
                <Text style={[styles.sentimentPercent, { color: colors.profit, fontFamily: fontFamily.medium }]}>
                  {item.bullish}%
                </Text>
              </View>
            ))}
          </Card>
        </AnimatedView>

        {/* AI Market Summary */}
        <AnimatedView animation="fadeSlideUp" delay={450}>
          <Card variant="accent" style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                AI Market Summary
              </Text>
            </View>
            <Text style={[styles.aiText, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
              Markets are showing mixed signals today. Gold continues its bullish trend amid geopolitical uncertainty, 
              while the Dollar Index shows slight weakness after Fed's dovish commentary. BTC is recovering from 
              recent selloff with strong ETF inflows supporting price action. Watch for NFP data release which could 
              trigger significant volatility across all major pairs.
            </Text>
          </Card>
        </AnimatedView>

        {/* News */}
        <AnimatedView animation="fadeSlideUp" delay={500}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold, paddingHorizontal: 16, marginTop: 8, marginBottom: 12 }]}>
            Market News
          </Text>
          {MOCK_NEWS.map((news, index) => (
            <AnimatedView key={news.id} animation="fadeSlideUp" delay={550 + index * 50}>
              <Card style={styles.newsCard}>
                <View style={styles.newsHeader}>
                  <Badge
                    label={news.impact}
                    variant={news.impact === 'high' ? 'loss' : news.impact === 'medium' ? 'warning' : 'default'}
                    size="xs"
                  />
                  <Text style={[styles.newsTime, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                    {news.time}
                  </Text>
                </View>
                <Text style={[styles.newsTitle, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                  {news.title}
                </Text>
                <Text style={[styles.newsSource, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                  {news.source}
                </Text>
              </Card>
            </AnimatedView>
          ))}
        </AnimatedView>

        {/* Economic Calendar */}
        <AnimatedView animation="fadeSlideUp" delay={700}>
          <Card style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Ionicons name="calendar" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Economic Calendar
              </Text>
            </View>
            {CALENDAR_EVENTS.map((event, index) => (
              <View key={index} style={[styles.calendarRow, { borderBottomColor: colors.divider }]}>
                <View style={styles.calendarLeft}>
                  <Text style={[styles.calendarTime, { color: colors.accent, fontFamily: fontFamily.semiBold }]}>
                    {event.time}
                  </Text>
                  <View style={[
                    styles.impactDot,
                    { backgroundColor: event.impact === 'high' ? colors.loss : event.impact === 'medium' ? colors.warning : colors.textTertiary },
                  ]} />
                </View>
                <View style={styles.calendarRight}>
                  <Text style={[styles.calendarEvent, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                    {event.event}
                  </Text>
                  <View style={styles.calendarValues}>
                    <Text style={[styles.calendarValue, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                      F: {event.forecast}
                    </Text>
                    <Text style={[styles.calendarValue, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                      P: {event.previous}
                    </Text>
                    {event.actual !== '-' && (
                      <Text style={[styles.calendarValue, { color: colors.profit, fontFamily: fontFamily.semiBold }]}>
                        A: {event.actual}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  headerTitle: { fontSize: 26 },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  headerBadge: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  categoryScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  categoryTab: { paddingHorizontal: 18, paddingVertical: 8 },
  categoryText: { fontSize: 13 },
  instrumentGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginBottom: 16 },
  instrumentWrapper: { width: '50%', padding: 4 },
  instrumentCard: { paddingVertical: 14, paddingHorizontal: 14 },
  instrumentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  instrumentSymbol: { fontSize: 13 },
  instrumentPrice: { fontSize: 18, marginBottom: 2 },
  instrumentChange: { fontSize: 12 },
  sparkline: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, marginTop: 8, height: 20 },
  sectionTitle: { fontSize: 16 },
  fearGreedCard: { marginHorizontal: 16, marginBottom: 12 },
  fearGreedContent: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },
  fearGreedGauge: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  fearGreedValue: { fontSize: 24 },
  fearGreedInfo: { flex: 1 },
  fearGreedLabel: { fontSize: 14, marginBottom: 8 },
  fearGreedBar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.2)', overflow: 'hidden' },
  fearGreedFill: { height: '100%', borderRadius: 3 },
  fearGreedLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  fearGreedEndLabel: { fontSize: 10 },
  sentimentCard: { marginHorizontal: 16, marginBottom: 12 },
  sentimentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  sentimentLabel: { fontSize: 12, width: 70 },
  sentimentBarContainer: { flex: 1, flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden' },
  sentimentBarBull: { borderTopLeftRadius: 3, borderBottomLeftRadius: 3 },
  sentimentBarBear: { borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  sentimentPercent: { fontSize: 12, width: 35, textAlign: 'right' },
  aiCard: { marginHorizontal: 16, marginBottom: 12 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  aiText: { fontSize: 13, lineHeight: 20 },
  newsCard: { marginHorizontal: 16, marginBottom: 8, padding: 14 },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  newsTime: { fontSize: 11 },
  newsTitle: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  newsSource: { fontSize: 11 },
  calendarCard: { marginHorizontal: 16, marginBottom: 16 },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  calendarRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  calendarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 60 },
  calendarTime: { fontSize: 12 },
  impactDot: { width: 8, height: 8, borderRadius: 4 },
  calendarRight: { flex: 1 },
  calendarEvent: { fontSize: 13, marginBottom: 4 },
  calendarValues: { flexDirection: 'row', gap: 12 },
  calendarValue: { fontSize: 11 },
});

export default MarketScreen;
