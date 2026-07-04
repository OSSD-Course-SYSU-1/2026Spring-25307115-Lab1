import type audio from "@ohos:multimedia.audio";
import type media from "@ohos:multimedia.media";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
/**
 * 音频特效控制器
 * 管理音量增益、播放速度等音频效果
 */
export class AudioEffectController {
    private avPlayer: media.AVPlayer | undefined = undefined;
    private audioRenderer: audio.AudioRenderer | undefined = undefined;
    // 音量增益控制
    private volumeGain: number = 1.0; // 范围: 0.0 ~ 3.0
    // 播放速度控制
    private playbackSpeed: number = 1.0; // 范围: 0.5 ~ 2.0
    /**
     * 设置AVPlayer实例
     */
    setAVPlayer(player: media.AVPlayer | undefined): void {
        this.avPlayer = player;
    }
    /**
     * 设置AudioRenderer实例
     */
    setAudioRenderer(renderer: audio.AudioRenderer | undefined): void {
        this.audioRenderer = renderer;
    }
    /**
     * 设置音量增益
     * @param gain 增益值 (0.0 ~ 3.0)
     */
    async setVolumeGain(gain: number): Promise<void> {
        // 限制增益范围
        this.volumeGain = Math.max(0.0, Math.min(3.0, gain));
        try {
            if (this.avPlayer) {
                // AVPlayer使用audioOffloadVolume控制音量
                await this.avPlayer.setVolume(this.volumeGain);
                Logger.info(`Volume gain set to: ${this.volumeGain}`);
            }
            else if (this.audioRenderer) {
                // AudioRenderer使用setVolume控制音量
                await this.audioRenderer.setVolume(this.volumeGain);
                Logger.info(`AudioRenderer volume set to: ${this.volumeGain}`);
            }
        }
        catch (error) {
            Logger.error(`Set volume gain failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 获取当前音量增益
     */
    getVolumeGain(): number {
        return this.volumeGain;
    }
    /**
     * 设置播放速度
     * @param speed 播放速度 (0.5 ~ 2.0)
     */
    async setPlaybackSpeed(speed: number): Promise<void> {
        // 限制速度范围
        this.playbackSpeed = Math.max(0.5, Math.min(2.0, speed));
        try {
            if (this.avPlayer) {
                // AVPlayer支持变速播放（使用setSpeed方法）
                await this.avPlayer.setSpeed(this.playbackSpeed);
                Logger.info(`Playback speed set to: ${this.playbackSpeed}x`);
            }
            else if (this.audioRenderer) {
                // AudioRenderer不直接支持变速，需要特殊处理
                Logger.warn('AudioRenderer does not support variable speed playback');
            }
        }
        catch (error) {
            Logger.error(`Set playback speed failed: ${JSON.stringify(error)}`);
        }
    }
    /**
     * 获取当前播放速度
     */
    getPlaybackSpeed(): number {
        return this.playbackSpeed;
    }
    /**
     * 重置所有音效为默认值
     */
    async reset(): Promise<void> {
        await this.setVolumeGain(1.0);
        await this.setPlaybackSpeed(1.0);
        Logger.info('All audio effects reset to default');
    }
    /**
     * 释放资源
     */
    release(): void {
        this.avPlayer = undefined;
        this.audioRenderer = undefined;
        this.volumeGain = 1.0;
        this.playbackSpeed = 1.0;
        Logger.info('AudioEffectController released');
    }
}
