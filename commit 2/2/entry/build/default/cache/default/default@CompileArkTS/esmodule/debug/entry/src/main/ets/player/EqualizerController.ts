import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
/**
 * 均衡器预设模式
 */
export enum EQPreset {
    FLAT = "\u5E73\u5766",
    BASS_BOOST = "\u4F4E\u97F3\u589E\u5F3A",
    TREBLE_BOOST = "\u9AD8\u97F3\u589E\u5F3A",
    VOCAL = "\u4EBA\u58F0",
    ROCK = "\u6447\u6EDA",
    POP = "\u6D41\u884C",
    JAZZ = "\u7235\u58EB",
    CLASSICAL = "\u53E4\u5178"
}
/**
 * 均衡器控制器
 */
export class EqualizerController {
    private audioSessionId: number = -1;
    private isEnabled: boolean = false;
    private currentPreset: EQPreset = EQPreset.FLAT;
    // 5段均衡器频段 (Hz)
    private readonly frequencies: number[] = [60, 250, 1000, 4000, 16000];
    private gainValues: number[] = [0, 0, 0, 0, 0]; // 增益值范围: -12dB ~ +12dB
    /**
     * 初始化均衡器
     */
    async init(sessionId: number): Promise<void> {
        try {
            this.audioSessionId = sessionId;
            Logger.info(`Equalizer initialized with session ID: ${sessionId}`);
            // 初始化默认增益值
            this.gainValues = new Array(this.frequencies.length).fill(0);
            this.isEnabled = false;
        }
        catch (error) {
            Logger.error(`Equalizer init failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 启用/禁用均衡器
     */
    async setEnabled(enabled: boolean): Promise<void> {
        try {
            if (enabled) {
                // TODO: 实际应用中需要调用系统API启用均衡器
                await this.applyGains();
            }
            this.isEnabled = enabled;
            Logger.info(`Equalizer ${enabled ? 'enabled' : 'disabled'}`);
        }
        catch (error) {
            Logger.error(`Set equalizer enabled failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 设置指定频段的增益
     */
    async setBandGain(bandIndex: number, gain: number): Promise<void> {
        // 限制增益范围: -12dB ~ +12dB
        const clampedGain: number = Math.max(-12, Math.min(12, gain));
        this.gainValues[bandIndex] = clampedGain;
        try {
            // TODO: 实际应用中需要调用系统API设置频段增益
            Logger.info(`Band ${bandIndex} (${this.frequencies[bandIndex]}Hz) gain set to ${clampedGain}dB`);
        }
        catch (error) {
            Logger.error(`Set band gain failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 获取指定频段的增益
     */
    getBandGain(bandIndex: number): number {
        return this.gainValues[bandIndex] || 0;
    }
    /**
     * 获取所有频段增益
     */
    getAllGains(): number[] {
        return [...this.gainValues];
    }
    /**
     * 获取频段数量
     */
    getBandCount(): number {
        return this.frequencies.length;
    }
    /**
     * 获取频段频率
     */
    getBandFrequencies(): number[] {
        return [...this.frequencies];
    }
    /**
     * 应用预设
     */
    async applyPreset(preset: EQPreset): Promise<void> {
        this.currentPreset = preset;
        let gains: number[] = [];
        switch (preset) {
            case EQPreset.FLAT:
                gains = [0, 0, 0, 0, 0];
                break;
            case EQPreset.BASS_BOOST:
                gains = [8, 6, 2, 0, 0];
                break;
            case EQPreset.TREBLE_BOOST:
                gains = [0, 0, 2, 6, 8];
                break;
            case EQPreset.VOCAL:
                gains = [-2, 0, 4, 2, 0];
                break;
            case EQPreset.ROCK:
                gains = [6, 4, -2, 4, 6];
                break;
            case EQPreset.POP:
                gains = [3, 4, 2, 1, 3];
                break;
            case EQPreset.JAZZ:
                gains = [4, 2, 0, 2, 4];
                break;
            case EQPreset.CLASSICAL:
                gains = [5, 3, 0, 3, 5];
                break;
            default:
                gains = [0, 0, 0, 0, 0];
        }
        // 应用所有频段增益
        for (let i = 0; i < gains.length; i++) {
            await this.setBandGain(i, gains[i]);
        }
        Logger.info(`Applied EQ preset: ${preset}`);
    }
    /**
     * 获取当前预设
     */
    getCurrentPreset(): EQPreset {
        return this.currentPreset;
    }
    /**
     * 应用所有增益值（内部方法）
     */
    private async applyGains(): Promise<void> {
        // TODO: 实际应用中需要调用系统API应用所有增益
        Logger.info('Apply all gains (placeholder implementation)');
    }
    /**
     * 释放资源
     */
    async release(): Promise<void> {
        try {
            this.isEnabled = false;
            this.audioSessionId = -1;
            Logger.info('Equalizer released');
        }
        catch (error) {
            Logger.error(`Release equalizer failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 是否已启用
     */
    isEffectEnabled(): boolean {
        return this.isEnabled;
    }
}
