/**
 * Electronics Engine Service
 *
 * Provides specialized electrical engineering calculators and pinout reference guides.
 */

export interface OhmsLawResult {
  voltage: number; // Volts
  current: number; // Amperes
  resistance: number; // Ohms
  power: number; // Watts
}

export interface LedResistorResult {
  resistanceRequired: number; // Ohms
  standardResistor: number; // Nearest standard E24 resistor value
  powerDissipation: number; // Watts
}

export interface BatteryRuntimeResult {
  estimatedHours: number;
  batteryCapacityWh: number;
}

export interface ComponentPinout {
  boardName: string;
  description: string;
  pins: Array<{
    pinNumber: number | string;
    label: string;
    functions: string[];
  }>;
}

export class ElectronicsEngine {
  /**
   * Calculates Ohm's Law parameters given any two known values.
   */
  public static calculateOhmsLaw(params: {
    voltage?: number;
    current?: number;
    resistance?: number;
    power?: number;
  }): OhmsLawResult {
    let { voltage, current, resistance, power } = params;

    if (voltage !== undefined && current !== undefined) {
      resistance = voltage / current;
      power = voltage * current;
    } else if (voltage !== undefined && resistance !== undefined) {
      current = voltage / resistance;
      power = (voltage * voltage) / resistance;
    } else if (current !== undefined && resistance !== undefined) {
      voltage = current * resistance;
      power = current * current * resistance;
    } else if (power !== undefined && voltage !== undefined) {
      current = power / voltage;
      resistance = (voltage * voltage) / power;
    } else if (power !== undefined && current !== undefined) {
      voltage = power / current;
      resistance = power / (current * current);
    } else {
      throw new Error('Please provide at least two parameters');
    }

    return {
      voltage: Math.round(voltage * 1000) / 1000,
      current: Math.round(current * 1000) / 1000,
      resistance: Math.round(resistance * 1000) / 1000,
      power: Math.round(power * 1000) / 1000,
    };
  }

  /**
   * Calculates required current-limiting resistor for LEDs.
   */
  public static calculateLedResistor(
    supplyVoltage: number,
    forwardVoltage: number,
    forwardCurrentmA: number,
  ): LedResistorResult {
    const currentA = forwardCurrentmA / 1000;
    const voltageDrop = supplyVoltage - forwardVoltage;

    if (voltageDrop <= 0) {
      throw new Error('Supply voltage must be greater than LED forward voltage');
    }

    const exactResistance = voltageDrop / currentA;
    const power = voltageDrop * currentA;

    // E24 Series standard resistor values lookup approximation
    const standardValues = [
      10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000,
    ];
    const nearestStandard = standardValues.reduce((prev, curr) =>
      Math.abs(curr - exactResistance) < Math.abs(prev - exactResistance) ? curr : prev,
    );

    return {
      resistanceRequired: Math.round(exactResistance * 10) / 10,
      standardResistor: nearestStandard,
      powerDissipation: Math.round(power * 1000) / 1000,
    };
  }

  /**
   * Calculates equivalent resistance for Series or Parallel resistor networks.
   */
  public static calculateResistorNetwork(resistors: number[], mode: 'series' | 'parallel'): number {
    if (resistors.length === 0) return 0;

    if (mode === 'series') {
      return resistors.reduce((acc, r) => acc + r, 0);
    } else {
      const reciprocalSum = resistors.reduce((acc, r) => acc + 1 / r, 0);
      return Math.round((1 / reciprocalSum) * 100) / 100;
    }
  }

  /**
   * Pinout diagrams for microcontrollers
   */
  public static getPinoutReference(board: 'ESP32' | 'Pico' | 'ArduinoUno'): ComponentPinout {
    switch (board) {
      case 'ESP32':
        return {
          boardName: 'ESP32-WROOM-32',
          description: '32-bit Dual Core WiFi + Bluetooth MCU',
          pins: [
            { pinNumber: 1, label: '3V3', functions: ['3.3V Power Supply'] },
            { pinNumber: 2, label: 'EN', functions: ['Enable / Reset (Active Low)'] },
            { pinNumber: 3, label: 'VP (GPIO36)', functions: ['ADC1_CH0', 'RTC_GPIO0'] },
            { pinNumber: 4, label: 'VN (GPIO39)', functions: ['ADC1_CH3', 'RTC_GPIO3'] },
            { pinNumber: 21, label: 'GPIO21', functions: ['I2C SDA', 'VSPI HD'] },
            { pinNumber: 22, label: 'GPIO22', functions: ['I2C SCL', 'VSPI WP'] },
            { pinNumber: 38, label: 'GND', functions: ['Ground'] },
          ],
        };
      case 'Pico':
        return {
          boardName: 'Raspberry Pi Pico (RP2040)',
          description: 'Dual ARM Cortex-M0+ @ 133MHz',
          pins: [
            { pinNumber: 1, label: 'GP0', functions: ['UART0 TX', 'I2C0 SDA', 'PWM0 A'] },
            { pinNumber: 2, label: 'GP1', functions: ['UART0 RX', 'I2C0 SCL', 'PWM0 B'] },
            { pinNumber: 3, label: 'GND', functions: ['Ground'] },
            { pinNumber: 36, label: '3V3_OUT', functions: ['3.3V Regulated Output'] },
            { pinNumber: 40, label: 'VBUS', functions: ['Micro-USB 5V Power'] },
          ],
        };
      case 'ArduinoUno':
      default:
        return {
          boardName: 'Arduino Uno R3 (ATmega328P)',
          description: '8-bit AVR Microcontroller @ 16MHz',
          pins: [
            { pinNumber: 'A0', label: 'A0', functions: ['ADC Channel 0'] },
            { pinNumber: 'D2', label: 'Digital 2', functions: ['External Interrupt 0'] },
            { pinNumber: 'D3', label: 'Digital 3', functions: ['PWM', 'External Interrupt 1'] },
            { pinNumber: 'D10', label: 'Digital 10', functions: ['PWM', 'SPI SS'] },
            { pinNumber: 'D11', label: 'Digital 11', functions: ['PWM', 'SPI MOSI'] },
            { pinNumber: 'D12', label: 'Digital 12', functions: ['SPI MISO'] },
            { pinNumber: 'D13', label: 'Digital 13', functions: ['SPI SCK', 'Built-in LED'] },
          ],
        };
    }
  }
}
