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

import { AudioType } from '../common/Constants';
import { AudioRendererController } from './AudioRendererController';
import { AVPlayerController } from './AVPlayerController';
import { resourceManager } from '@kit.LocalizationKit';
import { Logger } from '../utils/Logger';
// [Start PlayerController_methods]
// [Start PlayerController_avplayer_methods]
export class PlayerController {
  // [StartExclude PlayerController_methods]
  // [StartExclude PlayerController_avplayer_methods]
  private avPlayerController: AVPlayerController | undefined = undefined;
  private audioRendererController: AudioRendererController | undefined = undefined;
  private currentType: AudioType = 0;
  private rawFileDescriptor?: resourceManager.RawFileDescriptor;

  defaultPlay(rawFileDescriptor: resourceManager.RawFileDescriptor) {
    this.rawFileDescriptor = rawFileDescriptor;
    this.currentType = 1;
    this.avPlayerController = new AVPlayerController();
    this.avPlayerController.init(rawFileDescriptor.fd, rawFileDescriptor.offset, rawFileDescriptor.length);
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
  // [EndExclude PlayerController_avplayer_methods]
}
// [End PlayerController_avplayer_methods]
// [End PlayerController_methods]