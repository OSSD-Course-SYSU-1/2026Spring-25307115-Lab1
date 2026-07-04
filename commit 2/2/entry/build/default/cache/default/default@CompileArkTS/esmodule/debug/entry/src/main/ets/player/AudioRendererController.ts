import audio from "@ohos:multimedia.audio";
import type { BusinessError } from "@ohos:base";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import fileIo from "@ohos:file.fs";
import type { ReadOptions } from "@ohos:file.fs";
import { MediaTools } from "@normalized:N&&&entry/src/main/ets/utils/MediaTools&";
import type { EqualizerController } from '../utils/EqualizerController';
// [Start AudioRendererController_methods]
export class AudioRendererController {
    // [StartExclude AudioRendererController_methods]
    private audioRenderer: audio.AudioRenderer | undefined = undefined;
    private currentOffset: number = 0;
    private offset: number = 0;
    private length: number = 0;
    private fd: number = 0;
    private curMs: number = 0;
    private playbackSpeed: number = 1.0;
    private eqController: EqualizerController | undefined = undefined;
    // [EndExclude AudioRendererController_methods]
    // Initialization AudioRenderer
    public async initAudioRenderer(fd: number, offset: number, length: number): Promise<void> {
        this.fd = fd; // File descriptor
        this.offset = offset; // Start offset
        this.currentOffset = offset; // Current offset
        this.length = length; // File length
        // Audio stream information
        let audioStreamInfo: audio.AudioStreamInfo = {
            samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_48000,
            channels: audio.AudioChannel.CHANNEL_2,
            sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
            encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW // Audio encoding format
        };
        // AudioRenderer information
        let audioRendererInfo: audio.AudioRendererInfo = {
            usage: audio.StreamUsage.STREAM_USAGE_MUSIC,
            rendererFlags: 0 // Audio renderer flag
        };
        // AudioRenderer options information
        let audioRendererOptions: audio.AudioRendererOptions = {
            streamInfo: audioStreamInfo,
            rendererInfo: audioRendererInfo
        };
        // Get audio renderer
        await audio.createAudioRenderer(audioRendererOptions).then((data) => {
            this.audioRenderer = data;
            if (this.audioRenderer !== undefined) {
                try {
                    // Set the focus model to independent focus mode
                    this.audioRenderer.setInterruptMode(audio.InterruptMode.INDEPENDENT_MODE);
                    this.setWriteDataCallback(); // Write audio data
                }
                catch (error) {
                    Logger.error('createAudioRenderer is calling.');
                }
            }
        });
        // Convert the file length to the corresponding number of milliseconds and store it in AppStorage.
        AppStorage.setOrCreate('progressMax', MediaTools.getMsFromByteLength(this.length));
        // Convert the file length to the corresponding number of milliseconds, then convert it to a timestamp and store it in AppStorage.
        AppStorage.setOrCreate('totalTime', MediaTools.msToCountdownTime(MediaTools.getMsFromByteLength(this.length)));
    }
    // Write audio data
    private setWriteDataCallback(): void {
        try {
            // Listening for audio data writing
            this.audioRenderer?.on('writeData', (buffer) => {
                if (this.currentOffset - this.offset >= this.length) {
                    this.currentOffset = this.offset;
                    this.seek(0);
                }
                let options: ReadOptions = {
                    offset: this.currentOffset,
                    length: buffer.byteLength
                };
                let bufferLength = fileIo.readSync(this.fd, buffer, options);
                this.currentOffset += buffer.byteLength;
                // 应用均衡器处理
                if (this.eqController && this.eqController.getEnabled()) {
                    this.eqController.processPcmData(buffer, bufferLength);
                }
                let processOffset = this.currentOffset - this.offset;
                if (this.offset + this.length <= this.currentOffset) {
                    let view = new DataView(buffer);
                    Logger.info('currentOffset ：' + this.currentOffset + '  endOffset:' + (this.offset + this.length) +
                        ' bufferLength:' + bufferLength);
                    for (let i = bufferLength - 1; i > processOffset - this.length; i--) {
                        view.setUint8(i, 0);
                    }
                }
                let curMs = MediaTools.getMsFromByteLength(processOffset);
                AppStorage.setOrCreate('progress', curMs);
                AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(curMs));
            });
        }
        catch (error) {
            Logger.error('setWriteDataCallback is failed. ' + error);
        }
    }
    public async start(): Promise<void> {
        if (this.audioRenderer !== undefined) {
            // Audio state
            let stateGroup = [audio.AudioState.STATE_PREPARED, audio.AudioState.STATE_PAUSED, audio.AudioState.STATE_STOPPED];
            if (stateGroup.indexOf(this.audioRenderer.state.valueOf()) === -1) {
                return;
            }
            // Starting the AudioRenderer
            this.audioRenderer.start((err: BusinessError) => {
                // [StartExclude AudioRendererController_methods]
                if (err) {
                    Logger.error('Renderer start failed.');
                }
                else {
                    Logger.info('Renderer start success.');
                }
                // [EndExclude AudioRendererController_methods]
            });
        }
    }
    public pause(): void {
        if (this.audioRenderer !== undefined) {
            if (this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_RUNNING) {
                return;
            }
            // Pause Audio rendering
            this.audioRenderer.pause((err: BusinessError) => {
                // [StartExclude AudioRendererController_methods]
                if (err) {
                    Logger.error('Renderer pause failed.');
                }
                else {
                    Logger.info('Renderer pause success.');
                }
                // [EndExclude AudioRendererController_methods]
            });
        }
    }
    // Jump to playback
    public seek(ms: number): void {
        this.curMs = ms;
        AppStorage.setOrCreate('progress', this.curMs);
        AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(this.curMs));
        this.currentOffset = this.offset + MediaTools.getOffsetFromTime(this.curMs);
    }
    // [StartExclude AudioRendererController_methods]
    public stop(): void {
        if (this.audioRenderer !== undefined) {
            if (this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_RUNNING &&
                this.audioRenderer.state.valueOf() !== audio.AudioState.STATE_PAUSED) {
                return;
            }
            this.audioRenderer.stop(() => {
                Logger.error('audioRenderer stop failed.');
            });
        }
    }
    public release(): void {
        try {
            if (this.audioRenderer !== undefined) {
                if (this.audioRenderer.state.valueOf() === audio.AudioState.STATE_RELEASED) {
                    return;
                }
                this.audioRenderer.off('writeData');
                this.audioRenderer.release();
            }
        }
        catch (error) {
            Logger.info('Renderer release fail.');
        }
    }
    reset(fd: number, offset: number, length: number): void {
        this.fd = fd;
        this.offset = offset;
        this.length = length;
        this.curMs = 0;
        AppStorage.setOrCreate('progress', 0);
        AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(this.curMs));
    }
    // 设置播放速度（通过调整读取速率模拟）
    setPlaybackSpeed(speed: number): void {
        this.playbackSpeed = speed;
        // AudioRenderer不直接支持变速，需要通过调整采样率或读取策略实现
        // 这里仅记录速度值，实际变速需要更复杂的音频处理
        Logger.info(`AudioRenderer playback speed set to: ${speed}`);
    }
    // 获取当前播放时间（毫秒）
    getCurrentTime(): number {
        return this.curMs;
    }
    /**
     * 设置均衡器控制器
     */
    setEqualizer(eq: EqualizerController): void {
        this.eqController = eq;
        if (this.eqController) {
            this.eqController.setSampleRate(48000);
            this.eqController.setChannels(2);
        }
        Logger.info('AudioRenderer equalizer set');
    }
    /**
     * 获取均衡器控制器
     */
    getEqualizer(): EqualizerController | undefined {
        return this.eqController;
    }
}
