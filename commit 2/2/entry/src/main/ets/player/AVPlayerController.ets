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

import { media } from '@kit.MediaKit';
import { Logger } from '../utils/Logger';
import { MediaTools } from '../utils/MediaTools';
import { BusinessError } from '@kit.BasicServicesKit';
import { audio } from '@kit.AudioKit';
import { EqualizerController, EqPresetName } from '../utils/EqualizerController';
// [Start AVPlayerController_methods]
export class AVPlayerController {
  // [StartExclude AVPlayerController_methods]
  private avPlayer: media.AVPlayer | undefined = undefined;
  private currentTime: number = 0;
  private isReset = false;
  private eqController: EqualizerController | undefined = undefined;

  async init(fd: number, offset: number, length: number): Promise<void> {
    try {
      this.avPlayer = await media.createAVPlayer();
      this.avPlayer.audioInterruptMode = audio.InterruptMode.INDEPENDENT_MODE;
      await this.setAVPlayerCallback();
      this.avPlayer.fdSrc = { fd: fd, offset: offset, length: length };
    } catch (error) {
      Logger.error('AVPlayer init fail.');
    }
  }

  prepare(): void {
    this.avPlayer?.prepare((err: BusinessError) => {
      if (err) {
        Logger.error('Failed to prepare,error message is :' + err.message);
      } else {
        Logger.info('Succeeded in preparing');
      }
    });
  }
  // [EndExclude AVPlayerController_methods]

  reset(fd: number, offset: number, length: number): void {
    this.currentTime = AppStorage.get('progress') as number;
    this.isReset = true;
    this.avPlayer?.reset(() => {
      if (this.avPlayer != undefined) {
        this.avPlayer.fdSrc = { fd: fd, offset: offset, length: length };
      }
    })
  }
  // [StartExclude AVPlayerController_methods]
  stop(): void {
    this.avPlayer?.stop().catch(() => {
      Logger.error('AVPlayerController stop error!');
    })
  }

  play(): void {
    this.avPlayer?.play().catch(() => {
      Logger.error('AVPlayerController play error!');
    })
  }
  // [EndExclude AVPlayerController_methods]

  // Pause playback
  pause(): void {
    this.avPlayer?.pause().catch(() => {
      Logger.error('AVPlayerController pause error!');
    })
  }

  // Jump to playback
  seek(currentTime: number): void {
    this.avPlayer?.seek(currentTime, media.SeekMode.SEEK_NEXT_SYNC);
  }

  // 设置播放速度
  setSpeed(speed: number): void {
    if (this.avPlayer) {
      this.avPlayer.setSpeed(speed);
    }
  }

  // 获取当前播放时间（毫秒）
  getCurrentTime(): number {
    return this.currentTime;
  }

  /**
   * 设置均衡器控制器 (通过系统音效模式)
   */
  setEqualizer(eq: EqualizerController): void {
    this.eqController = eq;
    this.applySystemAudioEffect();
    Logger.info('AVPlayer equalizer set');
  }

  /**
   * 应用系统音频效果
   */
  private applySystemAudioEffect(): void {
    if (!this.avPlayer || !this.eqController) {
      return;
    }

    // AudioEffectMode 仅支持 EFFECT_NONE 和 EFFECT_DEFAULT
    // 根据均衡器开关切换系统音效
    let effectMode: audio.AudioEffectMode = this.eqController.getEnabled()
      ? audio.AudioEffectMode.EFFECT_DEFAULT
      : audio.AudioEffectMode.EFFECT_NONE;

    try {
      this.avPlayer.audioEffectMode = effectMode;
      Logger.info(`AVPlayer audio effect mode set to: ${effectMode}`);
    } catch (error) {
      Logger.error(`Failed to set audio effect mode: ${error}`);
    }
  }

  /**
   * 获取均衡器控制器
   */
  getEqualizer(): EqualizerController | undefined {
    return this.eqController;
  }
  // [StartExclude AVPlayerController_methods]
  private async setAVPlayerCallback(): Promise<void> {
    if (!this.avPlayer) {
      return;
    }

    this.avPlayer.on('timeUpdate', (currentTime: number) => {
      if (!this.isReset) {
        AppStorage.setOrCreate('progress', currentTime);
        AppStorage.setOrCreate('currentTime', MediaTools.msToCountdownTime(currentTime));
      }
    });

    this.avPlayer.on('durationUpdate', (time: number) => {
      AppStorage.setOrCreate('progressMax', time);
      AppStorage.setOrCreate('totalTime', MediaTools.msToCountdownTime(time));
    });

    this.avPlayer.on('error', (error: BusinessError) => {
      Logger.error('error happened,and error message is :' + error.message);
      Logger.error('error happened,and error code is :' + error.code);
    });

    this.avPlayer.on('stateChange', (state, reason) => {
      if (!this.avPlayer) {
        return;
      }
      switch (state) {
        case 'idle':
          break;
        case 'initialized':
          this.prepare();
          break;
        case 'prepared': // This state machine is reported after the prepare interface is successfully invoked.
          this.avPlayer.loop = true
          this.avPlayer.play().then(() => {
            this.seek(this.currentTime);
            this.isReset = false;
          }).catch(() => {
          });
          break;
        case 'playing': // After the play interface is successfully invoked, the state machine is reported.
          break;
        case 'completed': // This state machine is triggered to report when the playback ends.
          break;
        case 'error':
          Logger.error('AVPlayer error!' + reason);
          break;
        default:
          break;
      }
    });
  }

  release() {
    this.avPlayer?.release().catch(() => {
      Logger.error('AVPlayerController release error!');
    });
  }
  // [EndExclude AVPlayerController_methods]
}
// [Start AVPlayerController_methods]