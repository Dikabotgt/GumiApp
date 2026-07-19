/**
 * GumiGenk Journal — Dashboard Screen
 * Premium analytics dashboard with all trading metrics
 */

import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, Dimensions, Pressable, TouchableOpacity
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle as SvgCircle } from 'react-native-svg';
import { Bell, Wallet, ArrowUpCircle, ArrowDownCircle, Trophy, Target, Star, AlertTriangle, TrendingUp, TrendingDown, Activity, BarChart2, Flame, Rocket, CloudLightning, ArrowDownToLine, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useTrades } from '../../context/TradeContext';
import { calculateStats } from '../../utils/calculations';
import { formatCurrency, formatPercent, formatPL, formatNumber } from '../../utils/formatters';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { SkeletonStat } from '../../components/common/Skeleton';
import CalendarHeatmap from '../../components/journal/CalendarHeatmap';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { colors, fontFamily, isDark } = useTheme();
  const { trades, isLoading } = useTrades();
  const [refreshing, setRefreshing] = useState(false);
  const [activeStatPeriod, setActiveStatPeriod] = useState('monthly');
  const [accountFilter, setAccountFilter] = useState('all');

  const filteredTrades = useMemo(() => {
    if (accountFilter === 'all') return trades;
    return trades.filter(t => (t.accountType || 'real') === accountFilter);
  }, [trades, accountFilter]);

  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
            Dashboard
          </Text>
        </View>
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <SkeletonStat key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </View>
    );
  }

  // Stat cards logic has been inline-restructured, keeping stat array logic empty here

  const periodStats = activeStatPeriod === 'monthly' ? stats.monthlyStats
    : activeStatPeriod === 'weekly' ? stats.weeklyStats
      : stats.dailyStats;

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AnimatedView animation="fadeSlideUp" delay={0}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.headerDate, { color: colors.textSecondary, fontFamily: fontFamily.bold, fontSize: 10, textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1.5 }]}>
                ACCOUNT
              </Text>
              <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.serif, fontWeight: '700' }]}>
                Overview.
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable style={[styles.headerBtn, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1, borderRadius: 20 }]}>
                <Bell size={18} color={colors.textPrimary} strokeWidth={1.5} />
              </Pressable>
              <Pressable
                onPress={() => {
                  const next = accountFilter === 'all' ? 'real' : accountFilter === 'real' ? 'funded' : accountFilter === 'funded' ? 'backtest' : 'all';
                  setAccountFilter(next);
                }}
                style={[styles.headerBtn, { backgroundColor: 'transparent', borderColor: colors.border, borderWidth: 1, borderRadius: 20 }]}
              >
                <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 13 }}>
                  {accountFilter.charAt(0).toUpperCase()}
                </Text>
              </Pressable>
            </View>
          </View>
        </AnimatedView>

        {trades.length === 0 ? (
          <EmptyState
            icon="bar-chart-outline"
            title="No Trading Data"
            subtitle="Add trades in the Journal tab to see your analytics here"
          />
        ) : (
          <>
            {/* Net P/L Hero Card */}
            <AnimatedView animation="fadeSlideUp" delay={100}>
              <View style={[styles.heroCard, { backgroundColor: colors.cardElevated, borderWidth: 0, borderRadius: 16 }]}>
                {/* SVG Sparkline Background */}
                <View style={StyleSheet.absoluteFill}>
                  <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <Defs>
                      <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={colors.accent} stopOpacity="0.08" />
                        <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
                      </LinearGradient>
                    </Defs>
                    <Path
                      d="M0,80 Q10,70 20,80 T40,60 T60,50 T80,70 T100,40 L100,100 L0,100 Z"
                      fill="url(#grad)"
                    />
                    <Path
                      d="M0,80 Q10,70 20,80 T40,60 T60,50 T80,70 T100,40"
                      fill="none"
                      stroke={colors.accent}
                      strokeWidth="1"
                      strokeOpacity="0.2"
                    />
                  </Svg>
                </View>

                <View style={styles.heroContent}>
                  {/* Left Side 60% */}
                  <View style={styles.heroLeft}>
                    <Text style={[styles.heroLabelText, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
                      NET PNL
                    </Text>
                    <Text
                      style={[
                        styles.heroValueLarge,
                        { color: stats.netProfit >= 0 ? colors.profit : colors.loss, fontFamily: fontFamily.bold }
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {formatPL(stats.netProfit)}
                    </Text>
                  </View>

                  {/* Right Side 40% */}
                  <View style={styles.heroRight}>
                    <View style={styles.heroStatBlock}>
                      <Text style={[styles.heroLabelText, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>WIN RATE</Text>
                      <Text style={[styles.heroStatValueSolid, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{formatPercent(stats.winRate, 0)}</Text>
                    </View>
                    <View style={styles.heroStatBlock}>
                      <Text style={[styles.heroLabelText, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>TRADES</Text>
                      <Text style={[styles.heroStatValueSolid, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{stats.totalTrades}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </AnimatedView>

            {/* Win/Loss Summary */}
            <AnimatedView animation="fadeSlideUp" delay={200}>
              <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 0, marginBottom: 24 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                  <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                  <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                    WIN RATE
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={{ fontSize: 42, fontFamily: fontFamily.bold, color: colors.textPrimary, lineHeight: 46 }}>
                    {stats.winRate.toFixed(0)}<Text style={{ color: colors.textTertiary, fontSize: 20 }}>%</Text>
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>WON</Text>
                      <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 18 }}>{stats.winCount}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: colors.border }} />
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>LOST</Text>
                      <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 18 }}>{stats.lossCount}</Text>
                    </View>
                  </View>
                </View>

                {/* Thin gradient progress */}
                <View style={{ height: 4, flexDirection: 'row', borderRadius: 2, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <View style={{ flex: stats.winRate || 1, backgroundColor: colors.accent, opacity: 0.9, borderRadius: 2 }} />
                  <View style={{ width: 3 }} />
                  <View style={{ flex: (100 - stats.winRate) || 1, backgroundColor: colors.loss, opacity: 0.4, borderRadius: 2 }} />
                </View>
              </View>
            </AnimatedView>

            {/* PERFORMANCE METRICS REDESIGN */}
            <AnimatedView animation="fadeSlideUp" delay={300}>
              <View style={styles.metricsContainer}>
                <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.medium, marginBottom: 12 }]}>
                  TRADE QUALITY
                </Text>

                {/* ROW 1: Hero Metrics */}
                <View style={[styles.metricRow1, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16 }]}>
                  <View style={styles.metricRow1Item}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 }}>
                      <Trophy size={16} color={colors.accent} strokeWidth={2} />
                      <Text style={[styles.metricLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>WIN RATE</Text>
                    </View>
                    <Text style={[styles.metricValueLarge, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{formatPercent(stats.winRate, 0)}</Text>
                  </View>
                  <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.metricRow1Item}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 }}>
                      <Activity size={16} color={colors.accent} strokeWidth={2} />
                      <Text style={[styles.metricLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>PROFIT FACTOR</Text>
                    </View>
                    <Text style={[styles.metricValueLarge, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>{stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}</Text>
                  </View>
                </View>

                {/* ROW 2: Core Financials (2 Cols) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                  <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                  <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                    CORE FINANCIALS
                  </Text>
                </View>
                <View style={styles.metricGrid2Col}>
                  {[
                    { label: 'NET PROFIT', value: formatPL(stats.netProfit), valColor: stats.netProfit >= 0 ? colors.textPrimary : colors.loss },
                    { label: 'AVERAGE RR', value: `${stats.avgRR.toFixed(2)}`, unit: 'R', valColor: colors.textPrimary },
                    { label: 'TOTAL PROFIT', value: formatCurrency(stats.totalProfit), valColor: colors.textPrimary },
                    { label: 'TOTAL LOSS', value: formatCurrency(stats.totalLoss), valColor: colors.loss },
                  ].map((item, idx) => (
                    <View key={idx} style={[styles.metricCardMed, { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' }]}>
                      <Text style={[styles.metricLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium, marginBottom: 12 }]}>{item.label}</Text>
                      <Text style={[styles.metricValueMed, { color: item.valColor, fontFamily: fontFamily.bold, fontSize: 22 }]}>
                        {item.value} <Text style={{ color: colors.textTertiary, fontSize: 12, fontFamily: fontFamily.medium }}>{item.unit || ''}</Text>
                      </Text>
                    </View>
                  ))}
                </View>

                {/* ROW 3: Advanced Analytics (3 Cols) */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16, gap: 10 }}>
                  <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                  <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                    ADVANCED ANALYTICS
                  </Text>
                </View>
                <View style={styles.metricGrid3Col}>
                  {[
                    { label: 'BEST TRADE', value: formatPL(stats.bestTrade), valColor: colors.textPrimary },
                    { label: 'WORST TRADE', value: formatPL(stats.worstTrade), valColor: colors.loss },
                    { label: 'EXPECTANCY', value: formatPL(stats.expectancy), valColor: colors.textPrimary },
                    { label: 'AVG WIN', value: formatCurrency(stats.avgWin), valColor: colors.textPrimary },
                    { label: 'AVG LOSS', value: formatCurrency(stats.avgLoss), valColor: colors.loss },
                    { label: 'MAX DD', value: formatPercent(stats.maxDrawdown), valColor: colors.loss },
                    { label: 'CURR STREAK', value: `${stats.currentStreak > 0 ? '+' : ''}${stats.currentStreak}`, valColor: colors.textPrimary },
                    { label: 'MAX WIN STRK', value: `${stats.maxWinStreak}`, valColor: colors.textPrimary },
                    { label: 'MAX LOSE STRK', value: `${stats.maxLoseStreak}`, valColor: colors.loss },
                  ].map((item, idx) => (
                    <View key={idx} style={[styles.metricCardCompact, { backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' }]}>
                      <Text style={[styles.metricLabelCompact, { color: colors.textSecondary, fontFamily: fontFamily.medium, marginBottom: 8 }]} numberOfLines={1}>{item.label}</Text>
                      <Text style={[styles.metricValueCompact, { color: item.valColor, fontFamily: fontFamily.bold, fontSize: 15 }]} numberOfLines={1} adjustsFontSizeToFit>{item.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </AnimatedView>

            {/* Equity Curve */}
            {stats.equityCurve.length > 1 && (
              <AnimatedView animation="fadeSlideUp" delay={600}>
                <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                    <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                      EQUITY CURVE
                    </Text>
                  </View>
                  <View style={[styles.miniChart, { height: 120 }]}>
                    {(() => {
                      const pts = stats.equityCurve;
                      const maxAbsY = Math.max(...pts.map(p => Math.abs(p.y))) || 1;

                      const stepX = 100 / (pts.length > 1 ? pts.length - 1 : 1);
                      const pointsStr = pts.map((p, i) => {
                        const x = i * stepX;
                        const normalizedY = (p.y / maxAbsY); // -1 to +1
                        const y = 50 - (normalizedY * 40); // 10 to 90
                        return `${x},${y}`;
                      }).join(' L ');

                      const firstP = pts[0];
                      const firstNormalizedY = (firstP.y / maxAbsY);
                      const firstY = 50 - (firstNormalizedY * 40);

                      const isOverallProfit = stats.netProfit >= 0;
                      const curveColor = isOverallProfit ? colors.profit : colors.loss;

                      return (
                        <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                          <Defs>
                            <LinearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                              <Stop offset="0" stopColor={curveColor} stopOpacity="0.2" />
                              <Stop offset="1" stopColor={curveColor} stopOpacity="0" />
                            </LinearGradient>
                          </Defs>
                          <Path
                            d={`M 0,${firstY} L ${pointsStr} L 100,100 L 0,100 Z`}
                            fill="url(#eqGrad)"
                          />
                          <Path
                            d={`M 0,${firstY} L ${pointsStr}`}
                            fill="none"
                            stroke={curveColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path d="M0,50 L100,50" stroke={colors.border} strokeWidth="1" strokeDasharray="2,2" />
                        </Svg>
                      );
                    })()}
                  </View>
                  <View style={styles.chartLabels}>
                    <Text style={[styles.chartLabel, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                      First Trade
                    </Text>
                    <Text style={[styles.chartLabel, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                      Latest Trade
                    </Text>
                  </View>
                </View>
              </AnimatedView>
            )}

            {/* Win Loss Pie Chart */}
            <AnimatedView animation="fadeSlideUp" delay={630}>
              <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                  <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                  <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                    WIN / LOSS DISTRIBUTION
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8 }}>
                  <View style={{ width: 120, height: 120, justifyContent: 'center', alignItems: 'center' }}>
                    <Svg width="120" height="120" viewBox="0 0 100 100">
                      <Defs>
                        <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                          <Stop offset="0" stopColor={colors.accent} stopOpacity="0.4" />
                          <Stop offset="1" stopColor={colors.accent} stopOpacity="1" />
                        </LinearGradient>
                      </Defs>
                      <SvgCircle cx="50" cy="50" r="46" stroke={colors.loss} strokeOpacity="0.3" strokeWidth="3" fill="none" />
                      <SvgCircle
                        cx="50" cy="50" r="46"
                        stroke="url(#ringGrad)"
                        strokeWidth="4"
                        strokeDasharray={`${(stats.winRate / 100) * 289} 289`}
                        strokeLinecap="round"
                        fill="none"
                        transform="rotate(-90 50 50)"
                      />
                    </Svg>
                    <View style={{ position: 'absolute', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, fontFamily: fontFamily.bold, color: colors.textPrimary }}>{stats.winRate.toFixed(0)}%</Text>
                    </View>
                  </View>

                  <View style={{ gap: 20 }}>
                    <View>
                      <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>WINS</Text>
                      <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 20 }}>{stats.winCount}</Text>
                    </View>
                    <View>
                      <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>LOSSES</Text>
                      <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 20 }}>{stats.lossCount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </AnimatedView>

            {/* Performance Chart */}
            {stats.monthlyStats && stats.monthlyStats.length > 0 && (
              <AnimatedView animation="fadeSlideUp" delay={660}>
                <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                    <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                      MONTHLY PERFORMANCE
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100, paddingHorizontal: 8 }}>
                    {stats.monthlyStats.slice(0, 6).reverse().map((m, idx) => {
                      const maxNet = Math.max(...stats.monthlyStats.map(s => Math.abs(s.netPL))) || 1;
                      const barHeightPercent = Math.max(10, (Math.abs(m.netPL) / maxNet) * 100);
                      const isProfit = m.netPL >= 0;

                      return (
                        <View key={m.period} style={{ alignItems: 'center', width: 40 }}>
                          <Text style={{
                            color: colors.textSecondary,
                            fontFamily: fontFamily.medium,
                            fontSize: 10,
                            marginBottom: 8,
                          }}>
                            {isProfit ? '+' : '-'}${Math.round(Math.abs(m.netPL))}
                          </Text>
                          <View style={{ height: 60, justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                            <View style={{
                              height: `${barHeightPercent}%`,
                              width: 6,
                              borderRadius: 3,
                              backgroundColor: isProfit ? colors.textPrimary : colors.loss,
                              opacity: isProfit ? 0.9 : 0.4,
                            }} />
                          </View>
                          <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 9, marginTop: 12, letterSpacing: 0.5 }}>
                            {m.period.split('-')[1]}/{m.period.split('-')[0].substring(2)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </AnimatedView>
            )}

            {/* Session Heatmap */}
            {stats.sessionStats && stats.sessionStats.length > 0 && (
              <AnimatedView animation="fadeSlideUp" delay={680}>
                <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                    <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                    <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                      SESSION HEATMAP
                    </Text>
                  </View>
                  <View style={{ gap: 0 }}>
                    {stats.sessionStats.filter(s => s.trades > 0).map((session, idx) => {
                      const isProfit = session.netPL >= 0;
                      const validSessions = stats.sessionStats.filter(s => s.trades > 0);
                      const bestSession = validSessions.reduce((prev, curr) => (prev.netPL > curr.netPL) ? prev : curr, validSessions[0]);
                      const isBest = session.name === bestSession.name;

                      return (
                        <View key={session.name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View>
                              <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 14 }}>
                                {session.name}
                              </Text>
                              <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 11, marginTop: 2 }}>
                                {session.winRate.toFixed(0)}% win rate
                              </Text>
                            </View>
                          </View>
                          <Text style={{ color: isProfit ? colors.textPrimary : colors.loss, fontFamily: fontFamily.bold, fontSize: 16 }}>
                            {formatPL(session.netPL)}
                          </Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </AnimatedView>
            )}

            {/* Period Statistics */}
            <AnimatedView animation="fadeSlideUp" delay={700}>
              <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                <View style={styles.periodHeader}>
                  <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                    Period Statistics
                  </Text>
                </View>
                <View style={styles.periodTabs}>
                  {['monthly', 'weekly', 'daily'].map((period) => (
                    <Pressable
                      key={period}
                      onPress={() => setActiveStatPeriod(period)}
                      style={[
                        styles.periodTab,
                        {
                          backgroundColor: activeStatPeriod === period ? colors.accentLight : 'transparent',
                          borderRadius: 8,
                        },
                      ]}
                    >
                      <Text style={[
                        styles.periodTabText,
                        {
                          color: activeStatPeriod === period ? colors.accent : colors.textSecondary,
                          fontFamily: activeStatPeriod === period ? fontFamily.semiBold : fontFamily.regular,
                        },
                      ]}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {periodStats.length === 0 ? (
                  <Text style={[styles.noData, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                    No data for this period
                  </Text>
                ) : (
                  periodStats.slice(0, 10).map((period, index) => (
                    <View
                      key={period.period}
                      style={[
                        styles.periodRow,
                        { borderBottomColor: colors.divider },
                        index === Math.min(periodStats.length, 10) - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <Text style={[styles.periodDate, { color: colors.textPrimary, fontFamily: fontFamily.medium }]}>
                        {period.period}
                      </Text>
                      <View style={styles.periodStats}>
                        <Text style={[styles.periodStat, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
                          {period.trades} trades
                        </Text>
                        <Badge
                          label={formatPercent(period.winRate, 0)}
                          variant={period.winRate >= 50 ? 'profit' : 'loss'}
                          size="xs"
                        />
                        <Text style={[
                          styles.periodPL,
                          {
                            color: period.netPL >= 0 ? colors.profit : colors.loss,
                            fontFamily: fontFamily.semiBold,
                          },
                        ]}>
                          {formatPL(period.netPL)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </AnimatedView>

            {/* Recent Trades */}
            {trades && trades.length > 0 && (
              <AnimatedView animation="fadeSlideUp" delay={800}>
                <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                      <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                        RECENT TRADES
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Journal')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Text style={{ color: colors.accent, fontFamily: fontFamily.medium, fontSize: 12 }}>View All</Text>
                      <ChevronRight size={14} color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                  {trades.slice(0, 5).map((trade, index) => {
                    const isProfit = (trade.profitLoss || 0) >= 0;
                    const isBuy = trade.direction === 'BUY';
                    return (
                      <View
                        key={trade.id || index}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View>
                            <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 14, letterSpacing: 0.3 }}>
                              {trade.instrument || 'Unknown'}
                            </Text>
                            <Text style={{ color: colors.textTertiary, fontFamily: fontFamily.medium, fontSize: 11, marginTop: 2 }}>
                              {trade.direction || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <Text style={{ color: isProfit ? colors.textPrimary : colors.loss, fontFamily: fontFamily.bold, fontSize: 16 }}>
                          {formatPL(trade.profitLoss || 0)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </AnimatedView>
            )}

            {/* Trading Calendar */}
            <AnimatedView animation="fadeSlideUp" delay={900}>
              <View style={[styles.chartCard, { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 0, marginBottom: 24 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                  <View style={{ width: 3, height: 14, backgroundColor: colors.accent, borderRadius: 2 }} />
                  <Text style={[styles.sectionTitleMuted, { color: colors.textSecondary, fontFamily: fontFamily.bold, letterSpacing: 1.5, fontSize: 11 }]}>
                    TRADING CALENDAR
                  </Text>
                </View>
                <CalendarHeatmap
                  trades={filteredTrades}
                  onDayPress={(dateStr) => {
                    navigation.navigate('Journal', { searchDate: dateStr });
                  }}
                />
              </View>
            </AnimatedView>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
  },
  heroLeft: {
    flex: 0.6,
  },
  heroRight: {
    flex: 0.4,
    alignItems: 'flex-end',
    gap: 12,
  },
  heroLabelText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroValueLarge: {
    fontSize: 38,
    fontWeight: '900',
  },
  heroStatBlock: {
    alignItems: 'flex-end',
  },
  heroStatValueSolid: {
    fontSize: 18,
    fontWeight: '800',
  },
  winLossBar: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  winLossHeader: {
    marginBottom: 12,
  },
  barContainer: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barWin: {},
  barBE: {},
  barLoss: {},
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  barLabel: {
    fontSize: 12,
  },
  sectionTitleMuted: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  metricsContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  metricRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  metricRow1Item: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 40,
  },
  metricLabel: {
    fontSize: 11,
    letterSpacing: 1,
  },
  metricValueLarge: {
    fontSize: 28,
  },
  metricGrid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCardMed: {
    width: (SCREEN_WIDTH - 32 - 12) / 2,
    padding: 16,
  },
  metricValueMed: {
    fontSize: 18,
  },
  metricGrid3Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCardCompact: {
    width: (SCREEN_WIDTH - 32 - 16) / 3,
    padding: 12,
  },
  metricLabelCompact: {
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metricValueCompact: {
    fontSize: 14,
  },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    marginTop: 12,
    gap: 1,
  },
  chartBar: {
    borderRadius: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 10,
  },
  periodCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  periodHeader: {
    marginBottom: 12,
  },
  periodTabs: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 4,
  },
  periodTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  periodTabText: {
    fontSize: 13,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  periodDate: {
    fontSize: 13,
  },
  periodStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  periodStat: {
    fontSize: 12,
  },
  periodPL: {
    fontSize: 13,
    minWidth: 60,
    textAlign: 'right',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
  },
  recentContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconText: {
    fontSize: 14,
  },
  txInstrument: {
    fontSize: 15,
    marginBottom: 4,
  },
  txBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  txBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  txPL: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  skeletonItem: {
    width: '48%',
    marginBottom: 8,
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  donutOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPercent: {
    fontSize: 20,
  },
  donutSub: {
    fontSize: 9,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  pieLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
  },
  performanceChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 12,
    paddingBottom: 4,
  },
  perfCol: {
    alignItems: 'center',
    flex: 1,
  },
  perfValueText: {
    fontSize: 9,
    marginBottom: 4,
  },
  perfBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    width: 16,
    backgroundColor: 'rgba(128,128,128,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  perfBar: {
    width: '100%',
  },
  perfLabelText: {
    fontSize: 10,
    marginTop: 6,
  },
  sessionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sessionBox: {
    flex: 1,
    minWidth: '45%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 14,
    marginBottom: 4,
  },
  sessionWinRate: {
    fontSize: 12,
    marginBottom: 4,
  },
  sessionPL: {
    fontSize: 15,
  },
});

export default DashboardScreen;
