/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Logger } from './Logger';

/**
 * 均衡器频段定义
 */
export interface EqBand {
  frequency: number;    // 中心频率 (Hz)
  gain: number;         // 增益 (dB), 范围 -12 ~ +12
  label: string;        // 显示标签
}

/**
 * 均衡器预设名称
 */
export type EqPresetName = 'FLAT' | 'POP' | 'ROCK' | 'JAZZ' | 'CLASSICAL' | 'VOCAL' | 'BASS_BOOST' | 'TREBLE_BOOST';

/**
 * 10段均衡器频段配置 (中心频率 Hz)
 */
const EQ_FREQUENCIES: number[] = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQ_LABELS: string[] = ['31', '62', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

/**
 * 均衡器控制器
 * 支持10段均衡调节、预设模式、PCM数据处理
 */
export class EqualizerController {
  private bands: EqBand[] = [];
  private isEnabled: boolean = false;
  private currentPreset: EqPresetName = 'FLAT';
  private sampleRate: number = 48000;
  private channels: number = 2;

  // 简易IIR滤波器状态 (每个频段2个通道)
  private filterStates: number[][][] = [];

  constructor() {
    this.initBands();
    this.applyPreset('FLAT');
  }

  /**
   * 初始化频段
   */
  private initBands(): void {
    this.bands = [];
    for (let i = 0; i < EQ_FREQUENCIES.length; i++) {
      this.bands.push({
        frequency: EQ_FREQUENCIES[i],
        gain: 0,
        label: EQ_LABELS[i]
      });
    }
    // 初始化滤波器状态: [band][channel][state0, state1]
    this.filterStates = [];
    for (let i = 0; i < this.bands.length; i++) {
      this.filterStates.push([
        [0, 0], // 左声道
        [0, 0]  // 右声道
      ]);
    }
  }

  /**
   * 设置采样率
   */
  setSampleRate(rate: number): void {
    this.sampleRate = rate;
  }

  /**
   * 设置声道数
   */
  setChannels(ch: number): void {
    this.channels = ch;
  }

  /**
   * 获取频段数量
   */
  getBandCount(): number {
    return this.bands.length;
  }

  /**
   * 获取所有频段
   */
  getBands(): EqBand[] {
    return this.bands;
  }

  /**
   * 设置某个频段的增益
   * @param bandIndex 频段索引 (0-9)
   * @param gainDb 增益值 (dB), 范围 -12 ~ +12
   */
  setBandGain(bandIndex: number, gainDb: number): void {
    if (bandIndex < 0 || bandIndex >= this.bands.length) {
      return;
    }
    const clampedGain = Math.max(-12, Math.min(12, gainDb));
    this.bands[bandIndex].gain = clampedGain;
    this.currentPreset = 'FLAT'; // 手动调节后清除预设
    Logger.info(`EQ band ${bandIndex} (${this.bands[bandIndex].frequency}Hz) gain: ${clampedGain}dB`);
  }

  /**
   * 获取均衡器启用状态
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * 设置均衡器启用状态
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetFilterStates();
    }
    Logger.info(`Equalizer ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 获取当前预设名称
   */
  getPreset(): EqPresetName {
    return this.currentPreset;
  }

  /**
   * 应用预设
   */
  applyPreset(preset: EqPresetName): void {
    const gains = EqualizerController.getPresetGains(preset);
    for (let i = 0; i < this.bands.length; i++) {
      this.bands[i].gain = gains[i];
    }
    this.currentPreset = preset;
    this.isEnabled = preset !== 'FLAT';
    this.resetFilterStates();
    Logger.info(`EQ preset applied: ${preset}`);
  }

  /**
   * 获取预设增益配置
   */
  static getPresetGains(preset: EqPresetName): number[] {
    switch (preset) {
      case 'FLAT':
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      case 'POP':
        // 流行: 低频和高频略提升, 中频微降
        return [-1, 0, 2, 4, 5, 4, 2, 0, -1, -2];
      case 'ROCK':
        // 摇滚: 低频和高频增强, 中频凹陷 (V型)
        return [5, 4, 2, 0, -2, -2, 0, 2, 4, 5];
      case 'JAZZ':
        // 爵士: 低频温暖, 高频明亮
        return [3, 2, 0, 2, 3, 2, 0, 1, 3, 4];
      case 'CLASSICAL':
        // 古典: 宽广的频率响应, 高低频略提升
        return [4, 3, 1, 0, -1, -1, 0, 1, 3, 4];
      case 'VOCAL':
        // 人声: 中频突出 (500Hz-4KHz)
        return [-3, -2, 0, 2, 5, 6, 5, 2, 0, -2];
      case 'BASS_BOOST':
        // 低音增强
        return [8, 6, 4, 2, 0, 0, 0, 0, 0, 0];
      case 'TREBLE_BOOST':
        // 高音增强
        return [0, 0, 0, 0, 0, 0, 2, 4, 6, 8];
      default:
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  }

  /**
   * 获取所有预设名称
   */
  static getPresetNames(): EqPresetName[] {
    return ['FLAT', 'POP', 'ROCK', 'JAZZ', 'CLASSICAL', 'VOCAL', 'BASS_BOOST', 'TREBLE_BOOST'];
  }

  /**
   * 获取预设显示名称
   */
  static getPresetDisplayName(preset: EqPresetName): string {
    switch (preset) {
      case 'FLAT': return '默认';
      case 'POP': return '流行';
      case 'ROCK': return '摇滚';
      case 'JAZZ': return '爵士';
      case 'CLASSICAL': return '古典';
      case 'VOCAL': return '人声';
      case 'BASS_BOOST': return '低音增强';
      case 'TREBLE_BOOST': return '高音增强';
      default: return '默认';
    }
  }

  /**
   * 重置滤波器状态
   */
  private resetFilterStates(): void {
    for (let b = 0; b < this.filterStates.length; b++) {
      for (let ch = 0; ch < this.filterStates[b].length; ch++) {
        this.filterStates[b][ch][0] = 0;
        this.filterStates[b][ch][1] = 0;
      }
    }
  }

  /**
   * 计算二阶IIR biquad滤波器系数 (peaking EQ)
   * 返回 [b0, b1, b2, a1, a2]
   */
  private calcBiquadCoeffs(frequency: number, gainDb: number): number[] {
    const A = Math.pow(10, gainDb / 40); // sqrt of linear gain
    const Q = 1.414; // sqrt(2), Butterworth Q
    const w0 = 2 * Math.PI * frequency / this.sampleRate;
    const sinW0 = Math.sin(w0);
    const cosW0 = Math.cos(w0);
    const alpha = sinW0 / (2 * Q);

    const b0 = 1 + alpha * A;
    const b1 = -2 * cosW0;
    const b2 = 1 - alpha * A;
    const a0 = 1 + alpha / A;
    const a1 = -2 * cosW0;
    const a2 = 1 - alpha / A;

    // Normalize
    return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0];
  }

  /**
   * 处理PCM音频数据 (S16LE格式)
   * 对每个频段应用biquad滤波器, 然后混合输出
   * @param buffer PCM数据缓冲区 (S16LE, 16bit signed)
   * @param bytesRead 实际读取的字节数
   * @returns 处理后的数据(原地修改)
   */
  processPcmData(buffer: ArrayBuffer, bytesRead: number): void {
    if (!this.isEnabled || bytesRead <= 0) {
      return;
    }

    // 检查是否有需要处理的增益
    let hasGain = false;
    for (let b = 0; b < this.bands.length; b++) {
      if (Math.abs(this.bands[b].gain) > 0.1) {
        hasGain = true;
        break;
      }
    }
    if (!hasGain) {
      return;
    }

    const view = new DataView(buffer);
    const samplesCount = Math.floor(bytesRead / 2); // 16bit = 2 bytes per sample
    const frameSize = this.channels; // samples per frame

    // 对每个频段处理
    for (let b = 0; b < this.bands.length; b++) {
      const gain = this.bands[b].gain;
      if (Math.abs(gain) < 0.1) {
        continue; // 跳过增益为0的频段
      }

      const coeffs = this.calcBiquadCoeffs(this.bands[b].frequency, gain);
      const b0 = coeffs[0];
      const b1 = coeffs[1];
      const b2 = coeffs[2];
      const a1 = coeffs[3];
      const a2 = coeffs[4];

      // 逐帧逐通道处理
      for (let i = 0; i < samplesCount; i += frameSize) {
        for (let ch = 0; ch < frameSize; ch++) {
          const sampleIdx = i + ch;
          if (sampleIdx * 2 + 1 >= bytesRead) break;

          // 读取输入样本 (S16LE)
          const x = view.getInt16(sampleIdx * 2, true);

          // Biquad Direct Form I
          const s0 = this.filterStates[b][ch][0];
          const s1 = this.filterStates[b][ch][1];

          const y = b0 * x + s0;
          this.filterStates[b][ch][0] = b1 * x - a1 * y + s1;
          this.filterStates[b][ch][1] = b2 * x - a2 * y;

          // 写回 (限幅)
          const clamped = Math.max(-32768, Math.min(32767, Math.round(y)));
          view.setInt16(sampleIdx * 2, clamped, true);
        }
      }
    }
  }

  /**
   * 重置为默认状态
   */
  reset(): void {
    this.applyPreset('FLAT');
    this.isEnabled = false;
    this.resetFilterStates();
  }
}
