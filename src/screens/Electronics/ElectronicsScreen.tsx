import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { ElectronicsEngine, OhmsLawResult, LedResistorResult, ComponentPinout } from '../../services/agent/ElectronicsEngine';

export const ElectronicsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ohms' | 'led' | 'pinouts'>('ohms');

  // Ohm's law inputs
  const [voltage, setVoltage] = useState('5');
  const [current, setCurrent] = useState('0.02');
  const [ohmsResult, setOhmsResult] = useState<OhmsLawResult | null>(null);

  // LED inputs
  const [supplyV, setSupplyV] = useState('5');
  const [forwardV, setForwardV] = useState('2.1'); // Red LED standard
  const [forwardI, setForwardI] = useState('20'); // 20mA
  const [ledResult, setLedResult] = useState<LedResistorResult | null>(null);

  // Pinout board selection
  const [selectedBoard, setSelectedBoard] = useState<'ESP32' | 'Pico' | 'ArduinoUno'>('ESP32');
  const [pinoutData, setPinoutData] = useState<ComponentPinout>(ElectronicsEngine.getPinoutReference('ESP32'));

  const handleCalculateOhms = () => {
    try {
      const v = voltage ? parseFloat(voltage) : undefined;
      const i = current ? parseFloat(current) : undefined;
      const res = ElectronicsEngine.calculateOhmsLaw({ voltage: v, current: i });
      setOhmsResult(res);
    } catch {
      // ignore
    }
  };

  const handleCalculateLed = () => {
    try {
      const res = ElectronicsEngine.calculateLedResistor(
        parseFloat(supplyV),
        parseFloat(forwardV),
        parseFloat(forwardI),
      );
      setLedResult(res);
    } catch {
      // ignore
    }
  };

  const handleSelectBoard = (board: 'ESP32' | 'Pico' | 'ArduinoUno') => {
    setSelectedBoard(board);
    setPinoutData(ElectronicsEngine.getPinoutReference(board));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🔧 Electronics Hub</Text>
      <Text style={styles.subtitle}>MAGD AI Embedded & Circuit Engineering Suite</Text>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ohms' && styles.activeTab]}
          onPress={() => setActiveTab('ohms')}
        >
          <Text style={styles.tabText}>Ohm's Law</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'led' && styles.activeTab]}
          onPress={() => setActiveTab('led')}
        >
          <Text style={styles.tabText}>LED Resistor</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pinouts' && styles.activeTab]}
          onPress={() => setActiveTab('pinouts')}
        >
          <Text style={styles.tabText}>Pinouts</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'ohms' && (
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Ohm's Law & Power Calculator</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Voltage (V)</Text>
            <TextInput
              style={styles.input}
              value={voltage}
              onChangeText={setVoltage}
              keyboardType="numeric"
              placeholder="e.g. 5"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current (A)</Text>
            <TextInput
              style={styles.input}
              value={current}
              onChangeText={setCurrent}
              keyboardType="numeric"
              placeholder="e.g. 0.02"
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCalculateOhms}>
            <Text style={styles.buttonText}>Calculate Resistance & Power</Text>
          </TouchableOpacity>

          {ohmsResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>Voltage: {ohmsResult.voltage} V</Text>
              <Text style={styles.resultText}>Current: {ohmsResult.current} A</Text>
              <Text style={styles.resultHighlight}>Resistance: {ohmsResult.resistance} Ω</Text>
              <Text style={styles.resultHighlight}>Power: {ohmsResult.power} W</Text>
            </View>
          )}
        </GlassCard>
      )}

      {activeTab === 'led' && (
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>💡 Current Limiting Resistor Calculator</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Supply Voltage (V)</Text>
            <TextInput style={styles.input} value={supplyV} onChangeText={setSupplyV} keyboardType="numeric" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LED Forward Voltage Vf (V)</Text>
            <TextInput style={styles.input} value={forwardV} onChangeText={setForwardV} keyboardType="numeric" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LED Forward Current If (mA)</Text>
            <TextInput style={styles.input} value={forwardI} onChangeText={setForwardI} keyboardType="numeric" />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCalculateLed}>
            <Text style={styles.buttonText}>Calculate Resistor Value</Text>
          </TouchableOpacity>

          {ledResult && (
            <View style={styles.resultBox}>
              <Text style={styles.resultText}>Calculated Resistance: {ledResult.resistanceRequired} Ω</Text>
              <Text style={styles.resultHighlight}>Nearest Standard E24: {ledResult.standardResistor} Ω</Text>
              <Text style={styles.resultText}>Power Dissipation: {ledResult.powerDissipation} W</Text>
            </View>
          )}
        </GlassCard>
      )}

      {activeTab === 'pinouts' && (
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>📍 Board Pinouts & References</Text>

          <View style={styles.boardPicker}>
            {(['ESP32', 'Pico', 'ArduinoUno'] as const).map((board) => (
              <TouchableOpacity
                key={board}
                style={[styles.boardButton, selectedBoard === board && styles.boardButtonSelected]}
                onPress={() => handleSelectBoard(board)}
              >
                <Text style={styles.boardButtonText}>{board}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.boardTitle}>{pinoutData.boardName}</Text>
          <Text style={styles.boardDesc}>{pinoutData.description}</Text>

          {pinoutData.pins.map((pin) => (
            <View key={String(pin.pinNumber)} style={styles.pinRow}>
              <View style={styles.pinBadge}>
                <Text style={styles.pinBadgeText}>Pin {pin.pinNumber}</Text>
              </View>
              <View style={styles.pinDetails}>
                <Text style={styles.pinLabel}>{pin.label}</Text>
                <Text style={styles.pinFuncs}>{pin.functions.join(' | ')}</Text>
              </View>
            </View>
          ))}
        </GlassCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00f2fe',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#00f2fe',
  },
  tabText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: '#00f2fe',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  resultText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 4,
  },
  resultHighlight: {
    color: '#00f2fe',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  boardPicker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  boardButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  boardButtonSelected: {
    backgroundColor: '#4facfe',
  },
  boardButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  boardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4facfe',
  },
  boardDesc: {
    fontSize: 12,
    color: '#8e8e93',
    marginBottom: 12,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  pinBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
  },
  pinBadgeText: {
    color: '#00f2fe',
    fontSize: 11,
    fontWeight: 'bold',
  },
  pinDetails: {
    flex: 1,
  },
  pinLabel: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  pinFuncs: {
    color: '#8e8e93',
    fontSize: 11,
  },
});
