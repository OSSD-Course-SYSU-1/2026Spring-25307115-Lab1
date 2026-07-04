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

import { AudioType, PlayMode } from '../common/Constants';
import { AudioRendererController } from './AudioRendererController';
import { AVPlayerController } from './AVPlayerController';
import { resourceManager } from '@kit.LocalizationKit';
import { Logger } from '../utils/Logger';
import { SongData } from '../model/SongData';
import dataPreferences from '@ohos.data.preferences';
import { EqualizerController, EqPresetName, EqBand } from '../utils/EqualizerController';
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
  private eqController: EqualizerController = new EqualizerController();

  defaultPlay(rawFileDescriptor: resourceManager.RawFileDescriptor) {
    this.rawFileDescriptor = rawFileDescriptor;
    this.currentType = 1;
    this.avPlayerController = new AVPlayerController();
    this.avPlayerController.init(rawFileDescriptor.fd, rawFileDescriptor.offset, rawFileDescriptor.length);
    this.avPlayerController.setSpeed(this.playbackSpeed);
    // 设置均衡器
    this.avPlayerController.setEqualizer(this.eqController);
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
        this.avPlayerController?.reset(this.rawFileDescriptor.fd, this.rawFileDescriptor.offset,
          this.rawFileDescriptor.length);
      } else {
        // [StartExclude PlayerController_avplayer_methods]
        this.avPlayerController?.pause(); // Pause AVPlayer playback
        if (this.audioRendererController === undefined) {
          this.audioRendererController = new AudioRendererController();
        }
        // Create an AudioRenderer instance and listen for audio data writing
        this.audioRendererController.initAudioRenderer(this.rawFileDescriptor.fd, this.rawFileDescriptor.offset,
          this.rawFileDescriptor.length).then(() => {
          // 设置均衡器
          this.audioRendererController?.setEqualizer(this.eqController);
          this.audioRendererController?.start(); // Start AudioRenderer audio render
        });
        // [StartExclude PlayerController_avplayer_methods]
      }
      this.currentType = audioType;
    } catch (error) {
      Logger.error('changeType error!');
    }
  }
  // [StartExclude PlayerController_methods]
  // [StartExclude PlayerController_avplayer_methods]
  start(): void {
    if (this.isAVPlayer()) {
      this.avPlayerController?.play();
    } else {
      this.audioRendererController?.start();
    }
  }

  stop(): void {
    if (this.isAVPlayer()) {
      this.avPlayerController?.stop();
    } else {
      this.audioRendererController?.stop();
    }
  }

  pause(): void {
    if (this.isAVPlayer()) {
      this.avPlayerController?.pause();
    } else {
      this.audioRendererController?.pause();
    }
  }
  // [EndExclude PlayerController_avplayer_methods]
  // [EndExclude PlayerController_methods]
  // Determine the return value of isAVPlayer() and call the corresponding seek() method
  seek(currentTime: number): void {
    if (this.isAVPlayer()) {
      this.avPlayerController?.seek(currentTime);
    } else {
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
    } else {
      this.audioRendererController?.setPlaybackSpeed(speed);
    }
  }

  // 获取播放速度
  getPlaybackSpeed(): number {
    return this.playbackSpeed;
  }

  /**
   * 获取均衡器控制器
   */
  getEqualizer(): EqualizerController {
    return this.eqController;
  }

  /**
   * 应用均衡器预设
   */
  applyEqPreset(preset: EqPresetName): void {
    this.eqController.applyPreset(preset);
    // 通知当前播放器应用效果
    if (this.isAVPlayer() && this.avPlayerController) {
      this.avPlayerController.setEqualizer(this.eqController);
    } else if (this.audioRendererController) {
      this.audioRendererController.setEqualizer(this.eqController);
    }
    Logger.info(`EQ preset applied: ${preset}`);
  }

  /**
   * 设置均衡器启用状态
   */
  setEqEnabled(enabled: boolean): void {
    this.eqController.setEnabled(enabled);
    // 通知当前播放器
    if (this.isAVPlayer() && this.avPlayerController) {
      this.avPlayerController.setEqualizer(this.eqController);
    } else if (this.audioRendererController) {
      this.audioRendererController.setEqualizer(this.eqController);
    }
    Logger.info(`EQ enabled: ${enabled}`);
  }

  /**
   * 设置某个频段增益
   */
  setEqBandGain(bandIndex: number, gainDb: number): void {
    this.eqController.setBandGain(bandIndex, gainDb);
    // 通知当前播放器
    if (this.isAVPlayer() && this.avPlayerController) {
      this.avPlayerController.setEqualizer(this.eqController);
    } else if (this.audioRendererController) {
      this.audioRendererController.setEqualizer(this.eqController);
    }
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
      } else if (this.audioRendererController) {
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
    } catch (error) {
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
    } catch (error) {
      Logger.error(`恢复播放器状态失败: ${error}`);
      return 0;
    }
  }
  // [EndExclude PlayerController_avplayer_methods]
}
// [End PlayerController_avplayer_methods]
// [End PlayerController_methods]