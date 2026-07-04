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

import { LengthMetrics, SymbolGlyphModifier, TextModifier } from '@kit.ArkUI';
import { SongData } from '../model/SongData';
import { PlayerController } from '../player/PlayerController';
import { Logger } from '../utils/Logger';
import { BusinessError } from '@kit.BasicServicesKit';
import { AudioType, AudioName } from '../common/Constants';

@Component
export struct ControlAreaComponent {
  @State isPlay: boolean = false;
  @StorageLink('currentTime') currentTime: string = '00:00';
  @StorageLink('totalTime') totalTime: string = '00:00';
  @StorageLink('progress') value: number = 0;
  @StorageLink('progressMax') max: number = 0;
  @Prop songData: SongData = new SongData();
  @Prop imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @State isShowPlayList: boolean = false;
  @State isFavorite: boolean = false;
  private index: number = 0;
  @State text: Resource = $r('app.string.standard_quality');
  symbolGlyphModifier: SymbolGlyphModifier = new SymbolGlyphModifier();
  selectedOptionTextModifier: TextModifier = new TextModifier();
  private playerController: PlayerController = new PlayerController();

  aboutToAppear(): void {
    this.symbolGlyphModifier
      .fontSize(12)
      .fontColor(['#999999'])

    this.selectedOptionTextModifier
      .maxLines(1)
      .fontSize(12)
      .textAlign(TextAlign.Start)
      .fontWeight(FontWeight.Bold)
      .width(160)
    this.getUIContext().getHostContext()?.resourceManager.getRawFd(this.songData.src + AudioName.MP3)
      .then((rawFileDescriptor) => {
        this.playerController.defaultPlay(rawFileDescriptor);
        this.isPlay = true;
      })
      .catch((error: BusinessError) => {
        Logger.error(`resourceManager error code ${error.code} message ${error.message}`);
      });
  }

  aboutToDisappear(): void {
    this.playerController.release();
  }

  build() {
    Column() {
      Row() {
        Button(this.text)
          .fontSize(16)
          .width(100)
          .bindMenu(this.MyMenu)
          .backgroundColor(this.imageColor);

        Image(this.isFavorite ? $r('app.media.heart_fill') : $r('app.media.heart'))
          .fillColor(this.isFavorite ? Color.Red : Color.White)
          .controlImageBuilder()
          .animation({
            duration: 500
          })
          .width(24)
          .onClick(() => {
            this.isFavorite = !this.isFavorite;
          })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)

      Column() {
        Slider({
          min: 0,
          max: this.max,
          step: 1,
          style: SliderStyle.OutSet,
          value: this.value
        })
          .selectedColor('#DBFFFFFF')
          .trackColor('#33FFFFFF')
          .onChange((value: number, mode: SliderChangeMode) => {
            if (mode === SliderChangeMode.End || mode === SliderChangeMode.Begin) {
              this.playerController.seek(value);
            }
          })
          .height(16)
          .margin({
            left: -4,
            right: -4
          })
          .hitTestBehavior(HitTestMode.Block)
        Row() {
          Text(this.currentTime)
            .fontColor('#99FFFFFF')
            .fontSize(10)
            .fontFamily('HarmonyHeiTi')
            .lineHeight('14vp')
          Text(this.totalTime)
            .fontColor('#99FFFFFF')
            .fontSize(10)
            .fontFamily('HarmonyHeiTi')
            .lineHeight('14vp')
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .margin({
        top: 24,
        bottom: 12
      })

      Row() {
        Image($r('app.media.ic_public_forward'))
          .controlImageBuilder()
          .width(32)
        Image(this.isPlay ? $r('app.media.ic_public_play') : $r('app.media.ic_public_pause'))
          .controlImageBuilder()
          .width(72)
          .onClick(() => {
            if (this.isPlay) {
              this.playerController.pause();
            } else {
              this.playerController.start();
            }
            this.isPlay = !this.isPlay;
          })
        Image($r('app.media.ic_public_next'))
          .controlImageBuilder()
          .width(32)
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .padding({
        left: 36,
        right: 36
      })
    }
  }

  @Builder
  MyMenu() {
    // [Start menu_audioRender]
    // [Start menu_avplayer]
    Menu() {
      MenuItem({
        content: $r('app.string.standard_quality'),
      }).onClick(() => {
        if (this.index === 0) {
          return;
        }
        this.text = $r('app.string.standard_quality');
        this.index = 0;
        this.changeType(this.songData.src + AudioName.MP3, AudioType.MP3);
        this.isPlay = true;
      })
      // [StartExclude menu_audioRender]
      MenuItem({
        content: $r('app.string.flac_high_quality'),
      })
        .onClick(() => {
          if (this.index === 1) {
            return;
          }
          this.text = $r('app.string.flac_high_quality');
          this.index = 1;
          this.changeType(this.songData.src + AudioName.FLAC, AudioType.FLAC);
          this.isPlay = true;
        })
      // [EndExclude menu_audioRender]
      // [StartExclude menu_avplayer]
      MenuItem({
        content: $r('app.string.pcm_high_quality'),
      })
        .onClick(() => {
          if (this.index === 2) {
            return;
          }
          this.text = $r('app.string.pcm_high_quality');
          this.index = 2;
          this.changeType(this.songData.src + AudioName.PCM, AudioType.PCM);
          this.isPlay = true;
        })
      // [EndExclude menu_avplayer]
    }
    // [StartExclude menu_audioRender]
    // [StartExclude menu_avplayer]
    .width(224)
    .font({ size: 16 })
    .height(152)
    .menuItemDivider({
      strokeWidth: LengthMetrics.vp(0.5),
      color: '#d5d5d5',
      mode: DividerMode.EMBEDDED_IN_MENU
    })
    .subMenuExpandingMode(SubMenuExpandingMode.EMBEDDED_EXPAND)
    .backgroundColor(Color.White)
    // [EndExclude menu_avplayer]
    // [EndExclude menu_audioRender]
    // [Start menu_avplayer]
    // [Start menu_audioRender]
  }
  // [Start component_changeType]
  private changeType(songSrc: string, audioType: AudioType): void {
    let current: number = this.value;
    this.getUIContext().getHostContext()?.resourceManager.getRawFd(songSrc).then((rawFileDescriptor) => {
      this.playerController.changeType(rawFileDescriptor, audioType);
      this.playerController.seek(current);
    }).catch((error: BusinessError) => {
      Logger.error(`resourceManager error code ${error.code} message ${error.message}`);
    });
  }
  // [End component_changeType]
}

@Extend(Image)
function controlImageBuilder() {
  .aspectRatio(1)
  .opacity(0.86)
  .objectFit(ImageFit.Contain)
}
