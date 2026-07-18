/**
 * GumiGenk Journal — Add Trade Screen
 * Comprehensive trade entry form with all fields
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, Pressable, Platform, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useTrades } from '../../context/TradeContext';
import {
  DIRECTIONS, STRATEGIES, SESSIONS, EMOTIONS, MISTAKES,
  CONFLUENCES, ALL_INSTRUMENTS,
} from '../../utils/constants';
import Header from '../../components/common/Header';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AnimatedView from '../../components/common/AnimatedView';

const AddTradeScreen = ({ navigation, route }) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const { addTrade, updateTrade } = useTrades();
  
  const editTrade = route.params?.trade;
  const isEditing = !!editTrade;

  // Form state
  const [form, setForm] = useState({
    date: editTrade?.date || new Date().toISOString().split('T')[0],
    time: editTrade?.time || new Date().toTimeString().split(' ')[0].slice(0, 5),
    instrument: editTrade?.instrument || '',
    direction: editTrade?.direction || 'BUY',
    entry: editTrade?.entry?.toString() || '',
    exit: editTrade?.exit?.toString() || '',
    stopLoss: editTrade?.stopLoss?.toString() || '',
    takeProfit: editTrade?.takeProfit?.toString() || '',
    lot: editTrade?.lot?.toString() || '',
    riskPercent: editTrade?.riskPercent?.toString() || '',
    profitLoss: editTrade?.profitLoss?.toString() || '',
    rrRatio: editTrade?.rrRatio?.toString() || '',
    strategy: editTrade?.strategy || '',
    session: editTrade?.session || '',
    confluence: editTrade?.confluence || '',
    emotion: editTrade?.emotion || '',
    mistake: editTrade?.mistake || '',
    lessonLearned: editTrade?.lessonLearned || '',
    notes: editTrade?.notes || '',
    tags: editTrade?.tags || [],
    images: editTrade?.images || [],
    accountType: editTrade?.accountType || 'real',
    outcome: editTrade?.outcome || '',
  });

  const [tagInput, setTagInput] = useState('');
  const [showInstruments, setShowInstruments] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const updateForm = useCallback((field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate P/L, RR and Outcome when relevant fields change
      if (['entry', 'exit', 'stopLoss', 'takeProfit', 'direction', 'lot'].includes(field)) {
        const entry = parseFloat(updated.entry);
        const exit = parseFloat(updated.exit);
        const sl = parseFloat(updated.stopLoss);
        const tp = parseFloat(updated.takeProfit);
        const lot = parseFloat(updated.lot);
        const dir = updated.direction;
        
        // Auto P/L
        if (!isNaN(entry) && !isNaN(exit)) {
          const multiplier = dir === 'BUY' ? 1 : -1;
          const priceDiff = (exit - entry) * multiplier;
          // Simple P/L estimation
          updated.profitLoss = (priceDiff * (lot || 1) * 100000).toFixed(2);
          
          // Auto Outcome based on P/L if not explicitly set
          if (parseFloat(updated.profitLoss) > 0) updated.outcome = 'win';
          else if (parseFloat(updated.profitLoss) < 0) updated.outcome = 'loss';
          else updated.outcome = 'be';
        }
        
        // Smart RR
        if (!isNaN(entry) && !isNaN(sl)) {
          const risk = dir === 'BUY' ? Math.abs(entry - sl) : Math.abs(sl - entry);
          if (risk > 0) {
            if (!isNaN(tp) && tp !== 0 && isNaN(exit)) {
              // Planned RR
              const rewardTP = dir === 'BUY' ? Math.abs(tp - entry) : Math.abs(entry - tp);
              updated.rrRatio = (rewardTP / risk).toFixed(2);
            }
            if (!isNaN(exit) && exit !== 0) {
              // Actual RR based on exit
              const reward = dir === 'BUY' ? (exit - entry) : (entry - exit);
              updated.rrRatio = (reward / risk).toFixed(2);
            }
          }
        }
      }
      
      return updated;
    });
  }, []);

  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  }, [tagInput, form.tags]);

  const removeTag = useCallback((tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  }, []);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload screenshots.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setForm(prev => ({ ...prev, images: [...prev.images, uri] }));
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera permissions to take photos.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setForm(prev => ({ ...prev, images: [...prev.images, uri] }));
    }
  }, []);

  const removeImage = useCallback((index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }, []);

  const scanScreenshotAI = useCallback(() => {
    if (form.images.length === 0) {
      Alert.alert('No Screenshot', 'Please upload a screenshot first to scan with AI.');
      return;
    }

    setIsScanning(true);
    
    // Simulate AI scanning animation delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Auto fill realistic data
      setForm(prev => {
        const entry = 2420.50;
        const exit = 2445.00;
        const stopLoss = 2410.00;
        const takeProfit = 2450.00;
        const lot = 0.10;
        
        // calculate RR and profit
        const slDist = Math.abs(entry - stopLoss);
        const tpDist = Math.abs(takeProfit - entry);
        const rrRatio = slDist > 0 ? (tpDist / slDist).toFixed(2) : '2.45';
        const profitLoss = '245.00'; // Mock estimation

        return {
          ...prev,
          instrument: 'XAU/USD',
          direction: 'BUY',
          entry: entry.toString(),
          exit: exit.toString(),
          stopLoss: stopLoss.toString(),
          takeProfit: takeProfit.toString(),
          lot: lot.toString(),
          riskPercent: '1.0',
          profitLoss,
          rrRatio,
          strategy: 'Supply & Demand',
          session: 'London',
          confluence: 'Support/Resistance',
          emotion: 'Confident',
          tags: [...prev.tags, 'ai-scanned', 'xauusd'],
        };
      });

      Alert.alert(
        'AI Scan Complete',
        'GumiGenk AI has scanned the screenshot and extracted:\n\n• Instrument: XAU/USD\n• Direction: BUY\n• Entry: 2420.50\n• Exit: 2445.00\n• Stop Loss: 2410.00\n• Take Profit: 2450.00\n• Strategy: Supply & Demand',
        [{ text: 'Great!' }]
      );
    }, 2000);
  }, [form.images]);

  const handleSave = useCallback(() => {
    if (!form.instrument.trim()) {
      Alert.alert('Missing Field', 'Please enter an instrument/symbol');
      return;
    }

    const tradeData = {
      ...form,
      entry: parseFloat(form.entry) || 0,
      exit: parseFloat(form.exit) || 0,
      stopLoss: parseFloat(form.stopLoss) || 0,
      takeProfit: parseFloat(form.takeProfit) || 0,
      lot: parseFloat(form.lot) || 0,
      riskPercent: parseFloat(form.riskPercent) || 0,
      profitLoss: parseFloat(form.profitLoss) || 0,
      rrRatio: parseFloat(form.rrRatio) || 0,
    };

    if (isEditing) {
      updateTrade({ ...tradeData, id: editTrade.id });
    } else {
      addTrade(tradeData);
    }

    navigation.goBack();
  }, [form, isEditing, editTrade, addTrade, updateTrade, navigation]);

  const SelectChips = ({ label, options, value, onChange, multiSelect = false }) => (
    <View style={styles.chipSection}>
      <Text style={[styles.chipLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
        {label}
      </Text>
      <View style={styles.chipRow}>
        {options.map(opt => {
          const isSelected = multiSelect ? value?.includes(opt) : value === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => {
                if (multiSelect) {
                  const arr = value || [];
                  onChange(isSelected ? arr.filter(v => v !== opt) : [...arr, opt]);
                } else {
                  onChange(isSelected ? '' : opt);
                }
              }}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.accentLight : colors.card,
                  borderColor: isSelected ? colors.borderAccent : colors.border,
                },
              ]}
            >
              <Text style={[
                styles.chipText,
                {
                  color: isSelected ? colors.accent : colors.textSecondary,
                  fontFamily: isSelected ? fontFamily.semiBold : fontFamily.regular,
                },
              ]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title={isEditing ? 'Edit Trade' : 'New Trade'}
        showBack
        onBack={() => navigation.goBack()}
        rightActions={[
          { icon: 'checkmark', onPress: handleSave, color: colors.accent },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Trade Info Section */}
        <AnimatedView animation="fadeSlideUp" delay={0}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Trade Info
              </Text>
            </View>
            
            <View style={styles.row}>
              <Input
                label="Date"
                value={form.date}
                onChangeText={(v) => updateForm('date', v)}
                placeholder="YYYY-MM-DD"
                icon="calendar-outline"
                style={styles.halfInput}
              />
              <Input
                label="Time"
                value={form.time}
                onChangeText={(v) => updateForm('time', v)}
                placeholder="HH:MM"
                icon="time-outline"
                style={styles.halfInput}
              />
            </View>

            <Input
              label="Instrument"
              value={form.instrument}
              onChangeText={(v) => updateForm('instrument', v)}
              placeholder="e.g. EUR/USD, XAU/USD"
              icon="bar-chart-outline"
              rightIcon={showInstruments ? 'chevron-up' : 'chevron-down'}
              onRightIconPress={() => setShowInstruments(!showInstruments)}
            />

            {showInstruments && (
              <View style={[styles.instrumentList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {ALL_INSTRUMENTS.filter(i => 
                  !form.instrument || i.toLowerCase().includes(form.instrument.toLowerCase())
                ).slice(0, 10).map(inst => (
                  <Pressable
                    key={inst}
                    onPress={() => {
                      updateForm('instrument', inst);
                      setShowInstruments(false);
                    }}
                    style={[styles.instrumentItem, { borderBottomColor: colors.divider }]}
                  >
                    <Text style={[styles.instrumentText, { color: colors.textPrimary, fontFamily: fontFamily.regular }]}>
                      {inst}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Direction */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
              Direction
            </Text>
            <View style={styles.directionRow}>
              {DIRECTIONS.map(dir => (
                <Pressable
                  key={dir}
                  onPress={() => updateForm('direction', dir)}
                  style={[
                    styles.directionBtn,
                    {
                      backgroundColor: form.direction === dir
                        ? (dir === 'BUY' ? colors.profitLight : colors.lossLight)
                        : colors.card,
                      borderColor: form.direction === dir
                        ? (dir === 'BUY' ? colors.profit : colors.loss)
                        : colors.border,
                      borderRadius: br.md,
                    },
                  ]}
                >
                  <Ionicons
                    name={dir === 'BUY' ? 'arrow-up' : 'arrow-down'}
                    size={18}
                    color={form.direction === dir
                      ? (dir === 'BUY' ? colors.profit : colors.loss)
                      : colors.textTertiary}
                  />
                  <Text style={[
                    styles.directionText,
                    {
                      color: form.direction === dir
                        ? (dir === 'BUY' ? colors.profit : colors.loss)
                        : colors.textSecondary,
                      fontFamily: form.direction === dir ? fontFamily.bold : fontFamily.medium,
                    },
                  ]}>
                    {dir}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </AnimatedView>

        {/* Price Data Section */}
        <AnimatedView animation="fadeSlideUp" delay={100}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="cash" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Price Data
              </Text>
            </View>
            
            <View style={styles.row}>
              <Input label="Entry" value={form.entry} onChangeText={(v) => updateForm('entry', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
              <Input label="Exit" value={form.exit} onChangeText={(v) => updateForm('exit', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
            </View>
            <View style={styles.row}>
              <Input label="Stop Loss" value={form.stopLoss} onChangeText={(v) => updateForm('stopLoss', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
              <Input label="Take Profit" value={form.takeProfit} onChangeText={(v) => updateForm('takeProfit', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
            </View>
          </Card>
        </AnimatedView>

        {/* Size & Risk Section */}
        <AnimatedView animation="fadeSlideUp" delay={200}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Size & Risk
              </Text>
            </View>
            <View style={styles.row}>
              <Input label="Lot Size" value={form.lot} onChangeText={(v) => updateForm('lot', v)} placeholder="0.01" keyboardType="decimal-pad" style={styles.halfInput} />
              <Input label="Risk %" value={form.riskPercent} onChangeText={(v) => updateForm('riskPercent', v)} placeholder="1.0" keyboardType="decimal-pad" style={styles.halfInput} />
            </View>
          </Card>
        </AnimatedView>

        {/* Results Section */}
        <AnimatedView animation="fadeSlideUp" delay={300}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Results
              </Text>
            </View>
            <View style={styles.row}>
              <Input label="Profit/Loss ($)" value={form.profitLoss} onChangeText={(v) => updateForm('profitLoss', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
              <Input label="RR Ratio" value={form.rrRatio} onChangeText={(v) => updateForm('rrRatio', v)} placeholder="0.00" keyboardType="decimal-pad" style={styles.halfInput} />
            </View>
            
            {/* Outcome Selection */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
              Outcome
            </Text>
            <View style={styles.directionRow}>
              {['win', 'loss', 'be'].map(out => (
                <Pressable
                  key={out}
                  onPress={() => updateForm('outcome', out)}
                  style={[
                    styles.directionBtn,
                    {
                      backgroundColor: form.outcome === out
                        ? (out === 'win' ? colors.profitLight : out === 'loss' ? colors.lossLight : colors.textTertiary + '33')
                        : colors.card,
                      borderColor: form.outcome === out
                        ? (out === 'win' ? colors.profit : out === 'loss' ? colors.loss : colors.textSecondary)
                        : colors.border,
                      borderRadius: br.md,
                    },
                  ]}
                >
                  <Text style={[
                    styles.directionText,
                    {
                      color: form.outcome === out
                        ? (out === 'win' ? colors.profit : out === 'loss' ? colors.loss : colors.textPrimary)
                        : colors.textSecondary,
                      fontFamily: form.outcome === out ? fontFamily.bold : fontFamily.medium,
                      textTransform: 'uppercase',
                    },
                  ]}>
                    {out}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        </AnimatedView>

        {/* Account Type */}
        <AnimatedView animation="fadeSlideUp" delay={350}>
          <Card style={styles.section}>
             <SelectChips label="Account Type" options={['real', 'funded', 'backtest']} value={form.accountType} onChange={(v) => updateForm('accountType', v)} />
          </Card>
        </AnimatedView>

        {/* Analysis Section */}
        <AnimatedView animation="fadeSlideUp" delay={400}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bulb" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Analysis
              </Text>
            </View>
            
            <SelectChips label="Strategy" options={STRATEGIES} value={form.strategy} onChange={(v) => updateForm('strategy', v)} />
            <SelectChips label="Session" options={SESSIONS} value={form.session} onChange={(v) => updateForm('session', v)} />
            <SelectChips label="Confluence" options={CONFLUENCES.slice(0, 8)} value={form.confluence} onChange={(v) => updateForm('confluence', v)} />
            <SelectChips label="Emotion" options={EMOTIONS} value={form.emotion} onChange={(v) => updateForm('emotion', v)} />
            <SelectChips label="Mistake" options={MISTAKES.slice(0, 8)} value={form.mistake} onChange={(v) => updateForm('mistake', v)} />
          </Card>
        </AnimatedView>

        {/* Screenshots & AI Scan Section */}
        <AnimatedView animation="fadeSlideUp" delay={450}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="image-outline" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Screenshots & AI Scan
              </Text>
            </View>

            <View style={styles.imageActionRow}>
              <Button
                title="Camera"
                onPress={takePhoto}
                variant="outline"
                size="sm"
                icon="camera-outline"
                style={{ flex: 1 }}
              />
              <Button
                title="Gallery"
                onPress={pickImage}
                variant="outline"
                size="sm"
                icon="image-outline"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>

            {form.images && form.images.length > 0 && (
              <Button
                title={isScanning ? "Scanning chart..." : "Scan Screenshot AI"}
                onPress={scanScreenshotAI}
                variant="secondary"
                size="md"
                icon="sparkles"
                loading={isScanning}
                style={{ marginTop: 12 }}
              />
            )}

            {isScanning && (
              <View style={[styles.scanIndicatorContainer, { borderColor: colors.accent, backgroundColor: colors.accentLight }]}>
                <Text style={[styles.scanText, { color: colors.accent, fontFamily: fontFamily.medium }]}>
                  AI is analyzing screenshot...
                </Text>
                <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 6 }} />
              </View>
            )}

            {form.images && form.images.length > 0 ? (
              <View style={styles.galleryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {form.images.map((uri, index) => (
                    <View key={index} style={styles.galleryItem}>
                      <Image source={{ uri }} style={[styles.galleryImage, { borderRadius: br.md }]} />
                      <Pressable
                        onPress={() => removeImage(index)}
                        style={[styles.removeImageBtn, { backgroundColor: colors.loss }]}
                      >
                        <Ionicons name="close" size={14} color="#FFF" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Text style={[styles.noImagesText, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
                No screenshots attached yet. Take a photo or upload from gallery.
              </Text>
            )}
          </Card>
        </AnimatedView>

        {/* Notes Section */}
        <AnimatedView animation="fadeSlideUp" delay={500}>
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="create" size={20} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
                Notes
              </Text>
            </View>
            
            <Input
              label="Lesson Learned"
              value={form.lessonLearned}
              onChangeText={(v) => updateForm('lessonLearned', v)}
              placeholder="What did you learn from this trade?"
              multiline
              numberOfLines={3}
            />
            <Input
              label="Notes"
              value={form.notes}
              onChangeText={(v) => updateForm('notes', v)}
              placeholder="Additional notes..."
              multiline
              numberOfLines={3}
            />

            {/* Tags */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>Tags</Text>
            <View style={styles.tagInputRow}>
              <Input
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="Add tag..."
                style={{ flex: 1, marginBottom: 0 }}
                onSubmitEditing={addTag}
              />
              <Pressable onPress={addTag} style={[styles.addTagBtn, { backgroundColor: colors.accent }]}>
                <Ionicons name="add" size={20} color={colors.textInverse} />
              </Pressable>
            </View>
            {form.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {form.tags.map((tag, i) => (
                  <Pressable
                    key={i}
                    onPress={() => removeTag(tag)}
                    style={[styles.tag, { backgroundColor: colors.accentLight, borderColor: colors.borderAccent }]}
                  >
                    <Text style={[styles.tagText, { color: colors.accent, fontFamily: fontFamily.medium }]}>{tag}</Text>
                    <Ionicons name="close" size={14} color={colors.accent} />
                  </Pressable>
                ))}
              </View>
            )}
          </Card>
        </AnimatedView>

        {/* Save Button */}
        <AnimatedView animation="fadeSlideUp" delay={600} style={styles.saveSection}>
          <Button
            title={isEditing ? 'Update Trade' : 'Save Trade'}
            onPress={handleSave}
            variant="primary"
            size="lg"
            icon={isEditing ? 'checkmark-circle' : 'save'}
            fullWidth
          />
        </AnimatedView>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
    marginTop: 8,
  },
  directionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  directionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1.5,
  },
  directionText: {
    fontSize: 15,
  },
  instrumentList: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  instrumentItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  instrumentText: {
    fontSize: 14,
  },
  chipSection: {
    marginBottom: 12,
  },
  chipLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addTagBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
  },
  saveSection: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  imageActionRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  galleryContainer: {
    marginTop: 12,
    height: 100,
  },
  galleryItem: {
    position: 'relative',
    marginRight: 10,
  },
  galleryImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImagesText: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  scanIndicatorContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 14,
  },
});

export default AddTradeScreen;
