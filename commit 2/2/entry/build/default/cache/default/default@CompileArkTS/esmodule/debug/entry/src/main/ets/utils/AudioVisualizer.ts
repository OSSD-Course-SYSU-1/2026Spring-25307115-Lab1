import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
/**
 * 音频频谱数据类型
 */
export interface SpectrumData {
    frequencies: number[]; // 频率数据数组
    amplitude: number[]; // 振幅数据数组
}
/**
 * 音频可视化工具类
 * 用于生成模拟的音频频谱数据，实现可视化效果
 */
export class AudioVisualizer {
    private spectrumBars: number = 32; // 频谱柱数量
    private previousData: number[] = []; // 上一帧数据（用于平滑过渡）
    private targetData: number[] = []; // 目标数据
    private currentData: number[] = []; // 当前显示数据
    private animationFrame: number = 0; // 动画帧计数
    private isPlaying: boolean = false; // 播放状态
    constructor(bars: number = 32) {
        this.spectrumBars = bars;
        // 初始化数据数组
        for (let i = 0; i < bars; i++) {
            this.previousData.push(0);
            this.targetData.push(0);
            this.currentData.push(0);
        }
    }
    /**
     * 设置播放状态
     */
    setPlaying(playing: boolean): void {
        this.isPlaying = playing;
        if (!playing) {
            // 停止时逐渐归零
            this.targetData = new Array(this.spectrumBars).fill(0);
        }
    }
    /**
     * 生成模拟频谱数据
     * 基于正弦波和随机数生成自然的频谱效果
     */
    generateSpectrumData(): SpectrumData {
        if (!this.isPlaying) {
            // 如果暂停，逐渐降低所有值
            for (let i = 0; i < this.spectrumBars; i++) {
                this.targetData[i] = Math.max(0, this.targetData[i] * 0.8);
            }
        }
        else {
            // 生成新的目标数据
            this.updateTargetData();
        }
        // 平滑插值当前数据
        this.interpolateData();
        return {
            frequencies: this.currentData.map((_, index) => index),
            amplitude: [...this.currentData]
        };
    }
    /**
     * 更新目标数据
     */
    private updateTargetData(): void {
        this.animationFrame++;
        for (let i = 0; i < this.spectrumBars; i++) {
            // 基础频率响应曲线（低频更强）
            const baseResponse = 1 - (i / this.spectrumBars) * 0.6;
            // 多层正弦波叠加，创造动态效果
            const wave1 = Math.sin(this.animationFrame * 0.05 + i * 0.3) * 0.3;
            const wave2 = Math.sin(this.animationFrame * 0.08 + i * 0.5) * 0.2;
            const wave3 = Math.sin(this.animationFrame * 0.02 + i * 0.15) * 0.15;
            // 添加随机波动
            const random = Math.random() * 0.3;
            // 组合所有因素
            let value = baseResponse * (0.4 + wave1 + wave2 + wave3 + random);
            // 限制范围在 0-1 之间
            value = Math.max(0, Math.min(1, value));
            this.targetData[i] = value;
        }
    }
    /**
     * 平滑插值数据（避免跳变）
     */
    private interpolateData(): void {
        const smoothingFactor = 0.3; // 平滑系数
        for (let i = 0; i < this.spectrumBars; i++) {
            // 线性插值
            this.currentData[i] += (this.targetData[i] - this.currentData[i]) * smoothingFactor;
            // 确保数值有效
            this.currentData[i] = Math.max(0, Math.min(1, this.currentData[i]));
        }
    }
    /**
     * 根据音质类型获取颜色
     */
    static getColorByAudioType(audioType: number, index: number, total: number): string {
        // 渐变色计算
        const ratio = index / total;
        switch (audioType) {
            case 1: // MP3 - 蓝紫色渐变
                return `rgba(${Math.floor(100 + ratio * 55)}, ${Math.floor(100 - ratio * 50)}, 255, 0.9)`;
            case 2: // FLAC - 青绿色渐变
                return `rgba(${Math.floor(50 - ratio * 30)}, ${Math.floor(200 + ratio * 55)}, ${Math.floor(180 + ratio * 40)}, 0.9)`;
            case 3: // PCM - 橙红色渐变
                return `rgba(255, ${Math.floor(150 - ratio * 100)}, ${Math.floor(50 + ratio * 50)}, 0.9)`;
            default:
                return `rgba(255, 255, 255, 0.9)`;
        }
    }
    /**
     * 重置可视化器
     */
    reset(): void {
        this.previousData = new Array(this.spectrumBars).fill(0);
        this.targetData = new Array(this.spectrumBars).fill(0);
        this.currentData = new Array(this.spectrumBars).fill(0);
        this.animationFrame = 0;
    }
    /**
     * 释放资源
     */
    release(): void {
        this.reset();
        Logger.info('AudioVisualizer released');
    }
}
