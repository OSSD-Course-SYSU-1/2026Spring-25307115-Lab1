import { PlayMode } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { AudioType } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { AudioRendererController } from "@normalized:N&&&entry/src/main/ets/player/AudioRendererController&";
import { AVPlayerController } from "@normalized:N&&&entry/src/main/ets/player/AVPlayerController&";
import type resourceManager from "@ohos:resourceManager";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import type { SongData } from '../model/SongData';
import dataPreferences from "@ohos:data.preferences";
// [Start PlayerController_methods]
// [Start PlayerController_avplayer_methods]
export class PlayerController {
    // [StartExclude PlayerController_methods]
    // [StartExclude PlayerController_avplayer_methods]
    private avPlayerController: AVPlayerController | undefined = undefined;
    private audioRendererController: AudioRendererController | undefined = undefined;
    private currentType: AudioType = 0;
    private rawFileDescriptor?: resourceManager.RawFileDescriptor;
    private songList: SongData[] = [];
    private currentIndex: number = 0;
    private playMode: PlayMode = PlayMode.SINGLE_LOOP;
    private playbackSpeed: number = 1.0;
    defaultPlay(rawFileDescriptor: resourceManager.RawFileDescriptor) {
        this.rawFileDescriptor = rawFileDescriptor;
        this.currentType = 1;
        this.avPlayerController = new AVPlayerController();
        this.avPlayerController.init(rawFileDescriptor.fd, rawFileDescriptor.offset, rawFileDescriptor.length);
        this.avPlayerController.setSpeed(this.playbackSpeed);
    }
    // [EndExclude PlayerController_avplayer_methods]
    // [EndExclude PlayerController_methods]
    // Modifying the audio format
    changeType(rawFileDescriptor: resourceManager.RawFileDescriptor, audioType: AudioType) {
        try {
            this.rawFileDescriptor = rawFileDescriptor;
            if (audioType === 1 || audioType === 2) {
                this.audioRendererController?.pause(); // Pause AudioRenderer playback
                // Reset AVPlayer playback
                this.avPlayerController?.reset(this.rawFileDescriptor.fd, this.rawFileDescriptor.offset, this.rawFileDescriptor.length);
            }
            else {
                // [StartExclude PlayerController_avplayer_methods]
                this.avPlayerController?.pause(); // Pause AVPlayer playback
                if (this.audioRendererController === undefined) {
                    this.audioRendererController = new AudioRendererController();
                }
                // Create an AudioRenderer instance and listen for audio data writing
                this.audioRendererController.initAudioRenderer(this.rawFileDescriptor.fd, this.rawFileDescriptor.offset, this.rawFileDescriptor.length).then(() => {
                    this.audioRendererController?.start(); // Start AudioRenderer audio render
                });
                // [StartExclude PlayerController_avplayer_methods]
            }
            this.currentType = audioType;
        }
        catch (error) {
            Logger.error('changeType error!');
        }
    }
    // [StartExclude PlayerController_methods]
    // [StartExclude PlayerController_avplayer_methods]
    start(): void {
        if (this.isAVPlayer()) {
            this.avPlayerController?.play();
        }
        else {
            this.audioRendererController?.start();
        }
    }
    stop(): void {
        if (this.isAVPlayer()) {
            this.avPlayerController?.stop();
        }
        else {
            this.audioRendererController?.stop();
        }
    }
    pause(): void {
        if (this.isAVPlayer()) {
            this.avPlayerController?.pause();
        }
        else {
            this.audioRendererController?.pause();
        }
    }
    // [EndExclude PlayerController_avplayer_methods]
    // [EndExclude PlayerController_methods]
    // Determine the return value of isAVPlayer() and call the corresponding seek() method
    seek(currentTime: number): void {
        if (this.isAVPlayer()) {
            this.avPlayerController?.seek(currentTime);
        }
        else {
            // [StartExclude PlayerController_avplayer_methods]
            this.audioRendererController?.seek(currentTime);
            // [EndExclude PlayerController_avplayer_methods]
        }
    }
    // [StartExclude PlayerController_avplayer_methods]
    // [StartExclude PlayerController_methods]
    release() {
        if (this.avPlayerController) {
            this.avPlayerController.release();
        }
        if (this.audioRendererController) {
            this.audioRendererController.release();
        }
    }
    // [EndExclude PlayerController_methods]
    // Determine whether to use AVPlayer for playback
    isAVPlayer(): boolean {
        return this.currentType === 1 || this.currentType === 2;
    }
    // 设置播放列表
    setPlayList(songList: SongData[], currentIndex: number): void {
        this.songList = songList;
        this.currentIndex = currentIndex;
    }
    // 获取当前歌曲索引
    getCurrentIndex(): number {
        return this.currentIndex;
    }
    // 切换歌曲
    switchSong(index: number, rawFileDescriptor: resourceManager.RawFileDescriptor, audioType: AudioType): void {
        this.currentIndex = index;
        this.changeType(rawFileDescriptor, audioType);
    }
    // 上一曲
    previousSong(rawFileDescriptor: resourceManager.RawFileDescriptor, audioType: AudioType): number {
        if (this.songList.length === 0) {
            return this.currentIndex;
        }
        let newIndex: number;
        switch (this.playMode) {
            case PlayMode.RANDOM:
                newIndex = Math.floor(Math.random() * this.songList.length);
                break;
            case PlayMode.LIST_LOOP:
                newIndex = (this.currentIndex - 1 + this.songList.length) % this.songList.length;
                break;
            case PlayMode.SINGLE_LOOP:
            default:
                newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.songList.length - 1;
                break;
        }
        this.switchSong(newIndex, rawFileDescriptor, audioType);
        return newIndex;
    }
    // 下一曲
    nextSong(rawFileDescriptor: resourceManager.RawFileDescriptor, audioType: AudioType): number {
        if (this.songList.length === 0) {
            return this.currentIndex;
        }
        let newIndex: number;
        switch (this.playMode) {
            case PlayMode.RANDOM:
                newIndex = Math.floor(Math.random() * this.songList.length);
                break;
            case PlayMode.LIST_LOOP:
                newIndex = (this.currentIndex + 1) % this.songList.length;
                break;
            case PlayMode.SINGLE_LOOP:
            default:
                newIndex = this.currentIndex < this.songList.length - 1 ? this.currentIndex + 1 : 0;
                break;
        }
        this.switchSong(newIndex, rawFileDescriptor, audioType);
        return newIndex;
    }
    // 设置播放模式
    setPlayMode(mode: PlayMode): void {
        this.playMode = mode;
    }
    // 获取播放模式
    getPlayMode(): PlayMode {
        return this.playMode;
    }
    // 设置播放速度
    setPlaybackSpeed(speed: number): void {
        this.playbackSpeed = speed;
        if (this.isAVPlayer()) {
            this.avPlayerController?.setSpeed(speed);
        }
        else {
            this.audioRendererController?.setPlaybackSpeed(speed);
        }
    }
    // 获取播放速度
    getPlaybackSpeed(): number {
        return this.playbackSpeed;
    }
    /**
     * 保存播放状态到 preferences（用于流转）
     */
    async savePlayerState(context: Context): Promise<void> {
        try {
            const preferences = await dataPreferences.getPreferences(context, 'player_state');
            // 获取当前播放进度
            let currentTime = 0;
            if (this.isAVPlayer() && this.avPlayerController) {
                currentTime = this.avPlayerController.getCurrentTime();
            }
            else if (this.audioRendererController) {
                currentTime = this.audioRendererController.getCurrentTime();
            }
            await preferences.put('isPlaying', false); // 流转时默认暂停
            await preferences.put('currentTime', currentTime);
            await preferences.put('currentSongIndex', this.currentIndex);
            await preferences.put('audioType', this.currentType);
            await preferences.put('playMode', this.playMode);
            await preferences.put('playbackSpeed', this.playbackSpeed);
            await preferences.flush();
            Logger.info(`播放器状态已保存: time=${currentTime}, song=${this.currentIndex}, type=${this.currentType}`);
        }
        catch (error) {
            Logger.error(`保存播放器状态失败: ${error}`);
        }
    }
    /**
     * 从 preferences 恢复播放状态（用于流转）
     */
    async restorePlayerState(context: Context): Promise<number> {
        try {
            const preferences = await dataPreferences.getPreferences(context, 'player_state');
            const currentTime = await preferences.get('currentTime', 0) as number;
            const currentSongIndex = await preferences.get('currentSongIndex', 0) as number;
            const audioType = await preferences.get('audioType', 1) as number;
            const playMode = await preferences.get('playMode', 0) as number;
            const playbackSpeed = await preferences.get('playbackSpeed', 1.0) as number;
            this.currentIndex = currentSongIndex;
            this.currentType = audioType;
            this.playMode = playMode;
            this.playbackSpeed = playbackSpeed;
            Logger.info(`播放器状态已恢复: time=${currentTime}, song=${currentSongIndex}, type=${audioType}`);
            // 返回需要跳转的时间点
            return currentTime;
        }
        catch (error) {
            Logger.error(`恢复播放器状态失败: ${error}`);
            return 0;
        }
    }
}
