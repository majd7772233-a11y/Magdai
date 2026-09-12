export interface LiveVisionFrame {
  timestampMs: number;
  description: string;
  detectedObjects: string[];
}

export class LiveVisionService {
  private static isStreaming: boolean = false;

  static startLiveVision(onFrame: (frame: LiveVisionFrame) => void) {
    this.isStreaming = true;
    const interval = setInterval(() => {
      if (!this.isStreaming) {
        clearInterval(interval);
        return;
      }
      onFrame({
        timestampMs: Date.now(),
        description: 'تحليل بث الكاميرا الحية: لوحة إلكترونية تحتوي على ميكروكنترولر ومقاومات.',
        detectedObjects: ['Microcontroller', 'Resistor', 'LED', 'Capacitor'],
      });
    }, 3000);
    return () => {
      this.isStreaming = false;
      clearInterval(interval);
    };
  }

  static stopLiveVision() {
    this.isStreaming = false;
  }
}
