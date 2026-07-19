/**
 * GumiGenk Journal — Journal Screen
 * Trade list with search, filter, sort capabilities
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, Pressable, Animated, TextInput, Alert, ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useTrades } from '../../context/TradeContext';
import { formatPL, formatDate, formatRR } from '../../utils/formatters';
import { SORT_OPTIONS, DATE_FILTERS, DIRECTIONS, SESSIONS } from '../../utils/constants';
import GradientBackground from '../../components/common/GradientBackground';
import GlassCard from '../../components/common/GlassCard';
import Badge from '../../components/common/Badge';
import AnimatedView from '../../components/common/AnimatedView';
import EmptyState from '../../components/common/EmptyState';
import CalendarHeatmap from '../../components/journal/CalendarHeatmap';
import { exportPDF, exportCSV } from '../../utils/export';
import { parseCSV } from '../../utils/storage';

const JournalScreen = ({ navigation }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const { trades, deleteTrade, bulkImport } = useTrades();
  
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterDirection, setFilterDirection] = useState(null);
  const [filterSession, setFilterSession] = useState(null);
  
  const fabScale = useRef(new Animated.Value(1)).current;

  const handleExportPDF = useCallback(async () => {
    if (trades.length === 0) {
      Alert.alert('No Trades', 'You do not have any trades to export.');
      return;
    }
    const success = await exportPDF(trades);
    if (success) {
      Alert.alert('Export Success', 'Your trading report was exported successfully.');
    } else {
      Alert.alert('Export Failed', 'An error occurred while generating your report.');
    }
  }, [trades]);

  const handleExportCSV = useCallback(async () => {
    if (trades.length === 0) {
      Alert.alert('No Trades', 'You do not have any trades to export.');
      return;
    }
    const success = await exportCSV(trades);
    if (success) {
      Alert.alert('Export Success', 'Your trades CSV file was exported successfully.');
    } else {
      Alert.alert('Export Failed', 'An error occurred while generating CSV.');
    }
  }, [trades]);

  const handleBulkImport = useCallback(() => {
    Alert.alert(
      'Bulk Import CSV',
      'Choose an import source:',
      [
        {
          text: 'Load Demo CSV Template',
          onPress: () => {
            const demoCSV = `Date,Time,Instrument,Direction,Entry,Exit,Lot,Profit/Loss,RR Ratio,Strategy,Session\n2024-07-20,10:30,GBP/USD,BUY,1.2650,1.2720,0.5,350.00,2.1,Breakout,London\n2024-07-21,15:45,XAU/USD,SELL,2415.00,2400.00,0.2,300.00,3.0,Order Block,New York\n2024-07-22,09:15,EUR/USD,BUY,1.0820,1.0790,0.4,-120.00,-1.0,Pullback,London`;
            const parsed = parseCSV(demoCSV);
            if (parsed && parsed.length > 0) {
              bulkImport(parsed);
              Alert.alert('Import Complete', `Successfully imported ${parsed.length} trades from CSV template.`);
            }
          }
        },
        {
          text: 'Paste CSV Text Manually',
          onPress: () => {
            Alert.prompt(
              'Paste CSV Data',
              'Format: Date,Time,Symbol,Side,Entry,Exit,Lot,PnL,RR,Strategy,Session\nPaste complete CSV text below:',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Import',
                  onPress: (csvText) => {
                    if (csvText) {
                      const parsed = parseCSV(csvText);
                      if (parsed && parsed.length > 0) {
                        bulkImport(parsed);
                        Alert.alert('Import Complete', `Successfully imported ${parsed.length} trades.`);
                      } else {
                        Alert.alert('Import Failed', 'Could not parse any valid trades from input.');
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
  }, [bulkImport]);

  const handleShowOptions = useCallback(() => {
    Alert.alert(
      'Journal Actions',
      'Export or Import data:',
      [
        { text: 'Export PDF Report', onPress: handleExportPDF },
        { text: 'Export CSV File', onPress: handleExportCSV },
        { text: 'Bulk Import CSV', onPress: handleBulkImport },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }, [handleExportPDF, handleExportCSV, handleBulkImport]);

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let result = [...trades];
    
    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        (t.instrument || '').toLowerCase().includes(query) ||
        (t.notes || '').toLowerCase().includes(query) ||
        (t.strategy || '').toLowerCase().includes(query) ||
        (t.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by direction
    if (filterDirection) {
      result = result.filter(t => t.direction === filterDirection);
    }
    
    // Filter by session
    if (filterSession) {
      result = result.filter(t => t.session === filterSession);
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'date_asc':
          return new Date(a.date || 0) - new Date(b.date || 0);
        case 'pl_desc':
          return (b.profitLoss || 0) - (a.profitLoss || 0);
        case 'pl_asc':
          return (a.profitLoss || 0) - (b.profitLoss || 0);
        case 'rr_desc':
          return (b.rrRatio || 0) - (a.rrRatio || 0);
        case 'rr_asc':
          return (a.rrRatio || 0) - (b.rrRatio || 0);
        case 'instrument_asc':
          return (a.instrument || '').localeCompare(b.instrument || '');
        default:
          return 0;
      }
    });
    
    return result;
  }, [trades, searchQuery, sortBy, filterDirection, filterSession]);

  const handleDelete = useCallback((id, instrument) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete ${instrument || 'this trade'}?`);
      if (confirmed) {
        deleteTrade(id);
      }
      return;
    }

    Alert.alert(
      'Delete Trade',
      `Are you sure you want to delete ${instrument || 'this trade'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTrade(id) },
      ]
    );
  }, [deleteTrade]);

  const renderTradeCard = useCallback(({ item, index }) => {
    const pl = item.profitLoss || 0;
    const isProfit = pl >= 0;
    const isBuy = item.direction === 'BUY';

    return (
      <AnimatedView animation="fadeSlideUp" delay={index * 50} style={styles.cardWrapper}>
        <GlassCard
          variant="elevated"
          onPress={() => navigation.navigate('TradeDetail', { trade: item })}
          style={[styles.transactionCard, { padding: 0 }]}
        >
          <View style={styles.txHeaderRow}>
            <View style={styles.txLeft}>
              <View style={[styles.txIconBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.txIconText, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                  {item.instrument ? item.instrument.substring(0, 2) : 'UK'}
                </Text>
              </View>
              <View>
                <Text style={[styles.txInstrument, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                  {item.instrument || 'Unknown'}
                </Text>
                <View style={[styles.txBadge, { backgroundColor: isBuy ? colors.profitLight : colors.lossLight }]}>
                  <Text style={[styles.txBadgeText, { color: isBuy ? colors.profit : colors.loss }]}>
                    {item.direction || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={[
              styles.txPL,
              { color: isProfit ? colors.profit : colors.loss, fontFamily: fontFamily.serif },
            ]}>
              {formatPL(pl)}
            </Text>
          </View>

          <View style={styles.tradeDetails}>
            <View style={styles.tradeDetail}>
              <Text style={[styles.tradeDetailLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>DATE</Text>
              <Text style={[styles.tradeDetailValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                {formatDate(item.date, 'short')}
              </Text>
            </View>
            <View style={styles.tradeDetail}>
              <Text style={[styles.tradeDetailLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>RR</Text>
              <Text style={[styles.tradeDetailValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                {item.rrRatio ? formatRR(item.rrRatio) : '-'}
              </Text>
            </View>
            <View style={styles.tradeDetail}>
              <Text style={[styles.tradeDetailLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>LOT</Text>
              <Text style={[styles.tradeDetailValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]}>
                {item.lot || '-'}
              </Text>
            </View>
            <View style={styles.tradeDetail}>
              <Text style={[styles.tradeDetailLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>STRATEGY</Text>
              <Text style={[styles.tradeDetailValue, { color: colors.textPrimary, fontFamily: fontFamily.bold }]} numberOfLines={1}>
                {item.strategy || '-'}
              </Text>
            </View>
          </View>

          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagRow}>
              {item.tags.map((tag, i) => (
                <View key={i} style={[styles.miniTag, { backgroundColor: colors.borderLight }]}>
                  <Text style={[styles.miniTagText, { color: colors.textSecondary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </GlassCard>
      </AnimatedView>
    );
  }, [colors, fontFamily, navigation]);

  const clearFilters = () => {
    setFilterDirection(null);
    setFilterSession(null);
    setSearchQuery('');
    setSortBy('date_desc');
  };

  const hasActiveFilters = filterDirection || filterSession || searchQuery;

  return (
    <GradientBackground style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerDate, { color: colors.textSecondary, fontFamily: fontFamily.bold, fontSize: 10, textTransform: 'uppercase', marginBottom: 4 }]}>
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
          </Text>
          <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fontFamily.serif }]}>
            Journal.
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setViewMode(prev => prev === 'list' ? 'calendar' : 'list')}
            style={[styles.headerBtn, { backgroundColor: viewMode === 'calendar' ? colors.textPrimary : colors.card, marginRight: 8 }]}
          >
            <Ionicons
              name={viewMode === 'list' ? 'calendar-outline' : 'list'}
              size={20}
              color={viewMode === 'calendar' ? colors.textInverse : colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={[styles.headerBtn, { backgroundColor: showFilters ? colors.textPrimary : colors.card, marginRight: 8 }]}
          >
            <Ionicons
              name="filter"
              size={20}
              color={showFilters ? colors.textInverse : colors.textSecondary}
            />
          </Pressable>
          <Pressable
            onPress={handleShowOptions}
            style={[styles.headerBtn, { backgroundColor: colors.card, borderRadius: 20 }]}
          >
            <Text style={{ color: colors.textPrimary, fontFamily: fontFamily.bold, fontSize: 13 }}>N</Text>
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { marginHorizontal: 16 }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderWidth: 1, borderRadius: br.md }]}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search trades..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fontFamily.regular }]}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      {showFilters && (
        <AnimatedView animation="fadeSlideUp" duration={200} style={styles.filterContainer}>
          {/* Sort */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>Sort</Text>
            <ScrollRow>
              {SORT_OPTIONS.map(opt => (
                <Pressable
                  key={opt.value}
                  onPress={() => setSortBy(opt.value)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: sortBy === opt.value ? colors.textPrimary : colors.card,
                      borderColor: sortBy === opt.value ? colors.textPrimary : colors.border,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    {
                      color: sortBy === opt.value ? colors.textInverse : colors.textSecondary,
                      fontFamily: sortBy === opt.value ? fontFamily.semiBold : fontFamily.regular,
                    },
                  ]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollRow>
          </View>

          {/* Direction Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>Direction</Text>
            <View style={styles.filterRow}>
              <Pressable
                onPress={() => setFilterDirection(filterDirection === null ? null : null)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: filterDirection === null ? colors.textPrimary : colors.card,
                    borderColor: filterDirection === null ? colors.textPrimary : colors.border,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text style={[styles.filterChipText, { color: filterDirection === null ? colors.textInverse : colors.textSecondary, fontFamily: fontFamily.regular }]}>All</Text>
              </Pressable>
              {DIRECTIONS.map(dir => (
                <Pressable
                  key={dir}
                  onPress={() => setFilterDirection(filterDirection === dir ? null : dir)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: filterDirection === dir ? colors.textPrimary : colors.card,
                      borderColor: filterDirection === dir ? colors.textPrimary : colors.border,
                      borderRadius: 20,
                    },
                  ]}
                >
                  <Text style={[styles.filterChipText, { color: filterDirection === dir ? colors.textInverse : colors.textSecondary, fontFamily: fontFamily.regular }]}>{dir}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {hasActiveFilters && (
            <Pressable onPress={clearFilters} style={styles.clearBtn}>
              <Text style={[styles.clearBtnText, { color: colors.loss, fontFamily: fontFamily.medium }]}>Clear Filters</Text>
            </Pressable>
          )}
        </AnimatedView>
      )}

      {/* Results count */}
      <View style={styles.resultsBar}>
        <Text style={[styles.resultsText, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
          {filteredTrades.length} trade{filteredTrades.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Main Content Area */}
      {viewMode === 'calendar' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <CalendarHeatmap 
            trades={filteredTrades} 
            onDayPress={(dateStr) => {
              // Optionally scroll to this date or filter list by this date
              setSearchQuery(dateStr);
              setViewMode('list');
            }} 
          />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredTrades}
          renderItem={renderTradeCard}
          keyExtractor={(item) => item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title={searchQuery ? 'No Trades Found' : 'Start Your Journal'}
              subtitle={searchQuery ? 'Try a different search term' : 'Tap the + button to log your first trade'}
              actionLabel={!searchQuery ? 'Add Trade' : undefined}
              onAction={!searchQuery ? () => navigation.navigate('AddTrade') : undefined}
            />
          }
        />
      )}

      {/* FAB */}
      <Pressable
        onPressIn={() => {
          Animated.spring(fabScale, { toValue: 0.9, friction: 5, tension: 100, useNativeDriver: true }).start();
        }}
        onPressOut={() => {
          Animated.spring(fabScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
        }}
        onPress={() => navigation.navigate('AddTrade')}
      >
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [{ scale: fabScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['#F9E493', '#DCA83B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              StyleSheet.absoluteFill, 
              { 
                borderRadius: 30,
                borderWidth: 1,
                borderColor: '#FFF3B3', // Highlight reflection
              }
            ]}
          />
          <Plus size={28} color="#2A1B00" strokeWidth={2.5} />
        </Animated.View>
      </Pressable>
    </GradientBackground>
  );
};

// Simple horizontal scroll for filter chips
const ScrollRow = ({ children }) => {
  const { FlatList: FL } = require('react-native');
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
  searchContainer: {
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 6,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
  },
  clearBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 13,
  },
  resultsBar: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  resultsText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  cardWrapper: {
    marginBottom: 10,
  },
  transactionCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  tradeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  tradeDetail: {
    flex: 1,
    overflow: 'hidden',
  },
  tradeDetailLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tradeDetailValue: {
    fontSize: 13,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  miniTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  moreTag: {
    fontSize: 11,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DCA83B',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGlassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
  },
  premiumFabGlassOverlay: {
    borderRadius: 16,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.9)', 
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)', 
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
  }
});

export default JournalScreen;
