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

import { BusinessError } from '@kit.BasicServicesKit';
import { effectKit } from '@kit.ArkGraphics2D';
import { image } from '@kit.ImageKit';
import { Logger } from '../utils/Logger';
import { SongData } from '../model/SongData';
import { ControlAreaComponent } from '../components/ControlAreaComponent';
import { PlayListComponent } from '../components/PlayListComponent';
import { songDataList, AudioName, AudioType, PlayMode, DeviceUtil } from '../common/Constants';
import { ColorTools } from '../utils/ColorTools';
import { PlayerController } from '../player/PlayerController';

@Entry
@Component
struct Index {
  private songDataList: SongData[] = songDataList;
  @State imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @State imageLabel: PixelMap | Resource = this.songDataList[0].label;
  @State currentSongIndex: number = 0;
  @State isShowPlayList: boolean = false;
  @Provide isShowPlayListProvider: boolean = false;
  @State isWearable: boolean = false;
  private playerController: PlayerController = new PlayerController();

  aboutToAppear(): void {
    this.isWearable = DeviceUtil.isWearable();
    // 手表端跳过effectKit调用，避免不兼容崩溃
    if (!this.isWearable) {
      this.getImageColor();
    }
    this.restoreContinuationState();
  }

  build() {
    Stack() {
      Image(this.imageLabel)
        .size({ height: '120%' })
        .aspectRatio(1)
        .objectFit(ImageFit.Cover)
        .opacity(0.5)

      Column() {
        this.CoverInfo()
        this.MusicInfo()
        Blank()
        ControlAreaComponent({ 
          songData: this.songDataList[this.currentSongIndex], 
          imageColor: this.imageColor,
          isWearable: this.isWearable
        })
      }
      .height('100%')
      .width('100%')
      .padding(this.isWearable ? {
        top: 12,
        left: 12,
        right: 12,
        bottom: 12
      } : {
        top: 64,
        left: 24,
        right: 24,
        bottom: 24
      })
      .gesture(
        GestureGroup(GestureMode.Parallel,
          // 左滑下一曲
          PanGesture({ direction: PanDirection.Left, distance: 80 })
            .onActionEnd(() => {
              this.playNext();
            }),
          // 右滑上一曲
          PanGesture({ direction: PanDirection.Right, distance: 80 })
            .onActionEnd(() => {
              this.playPrevious();
            })
        )
      )

      // 播放列表弹窗
      if (this.isShowPlayList) {
        PlayListComponent({
          songList: this.songDataList,
          currentIndex: this.currentSongIndex,
          playMode: this.playerController.getPlayMode(),
          imageColor: this.imageColor,
          onSongSelect: (index: number) => {
            this.switchSong(index);
          }
        })
          .position({ x: 0, y: '100%' })
          .translate({ y: this.isShowPlayList ? '-100%' : '0%' })
          .animation({
            duration: 300
          })
      }
    }
    .height('100%')
    .width('100%')
    .backgroundColor(this.imageColor)
  }

  @Builder
  CoverInfo() {
    Row() {
      Image(this.songDataList[this.currentSongIndex].label)
        .height('100%')
        .aspectRatio(1)
        .borderRadius(this.isWearable ? 4 : 8)
        .shadow(this.isWearable ? {
          radius: 6,
          color: '#66000000',
          offsetX: 0,
          offsetY: 4
        } : {
          radius: 12,
          color: '#66000000',
          offsetX: 0,
          offsetY: 8
        })
        .margin(3)
    }
    .height(this.isWearable ? '30%' : '40%')
  }

  // 切换歌曲
  private switchSong(index: number): void {
    this.currentSongIndex = index;
    this.getImageColor();
    
    // 通知播放器切换歌曲
    const song = this.songDataList[index];
    this.getUIContext().getHostContext()?.resourceManager.getRawFd(song.src + AudioName.MP3)
      .then((rawFileDescriptor) => {
        this.playerController.switchSong(index, rawFileDescriptor, AudioType.MP3);
      })
      .catch((error: BusinessError) => {
        Logger.error(`Switch song error: ${error.code}, message: ${error.message}`);
      });
  }

  // 上一曲
  private playPrevious(): void {
    try {
      const currentIndex = this.playerController.getCurrentIndex();
      const newIndex = this.playerController.previousSong(
        this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(
          this.songDataList[currentIndex].src + AudioName.MP3
        ),
        AudioType.MP3
      );
      this.switchSong(newIndex);
    } catch (error) {
      Logger.error(`playPrevious error: ${error}`);
    }
  }

  // 下一曲
  private playNext(): void {
    try {
      const currentIndex = this.playerController.getCurrentIndex();
      const newIndex = this.playerController.nextSong(
        this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(
          this.songDataList[currentIndex].src + AudioName.MP3
        ),
        AudioType.MP3
      );
      this.switchSong(newIndex);
    } catch (error) {
      Logger.error(`playNext error: ${error}`);
    }
  }

  @Builder
  MusicInfo() {
    Column() {
      Flex({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center }) {
        Text(this.songDataList[this.currentSongIndex].title)
          .fontSize(this.isWearable ? 14 : 20)
          .fontColor(Color.White)
          .opacity(0.86)
          .fontWeight(FontWeight.Bold)
          .fontFamily(this.isWearable ? '' : 'HarmonyHeiTi-Bold')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }

      Text(this.songDataList[this.currentSongIndex].singer)
        .textAlign(TextAlign.Start)
        .fontSize(this.isWearable ? 11 : 14)
        .fontColor('#99FFFFFF')
        .fontFamily(this.isWearable ? '' : 'HarmonyHeiTi')
        .width('100%')
        .fontWeight(FontWeight.Regular)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .margin({ top: this.isWearable ? 8 : 24 })
  }

  getImageColor() {
    try {
      this.getUIContext().getHostContext()!.resourceManager.getMediaContent(this.songDataList[0].label.id)
        .then((value: Uint8Array) => {
          let buffer = value.buffer as ArrayBuffer;
          let imageSource: image.ImageSource = image.createImageSource(buffer);
          let currentPixelMap: image.PixelMap | undefined = undefined;
          imageSource.createPixelMap().then((pixelMap) => {
            effectKit.createColorPicker(pixelMap, (error, colorPicker) => {
              if (error) {
                Logger.error(`Failed to create color picker. Error: ${error.code}, message: ${error.message}`);
              } else {
                currentPixelMap = pixelMap;
                let color: effectKit.Color = colorPicker.getLargestProportionColor();
                let colorArr: number[] = ColorTools.dealColor(color.red, color.green, color.blue);
                this.imageColor = `rgba(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]}, 1)`;
              }
            })
            let headFilter = effectKit.createEffect(pixelMap);
            if (headFilter !== null) {
              headFilter.blur(15);
              headFilter.getEffectPixelMap().then((value) => {
                this.imageLabel = value;
              })
            }
          })
            .finally(() => {
              imageSource?.release();
              currentPixelMap?.release();
            })
            .catch((error: BusinessError) => {
              Logger.error(`createPixelMap error: ${error.code}, message: ${error.message}`);
            })
        })
        .catch((error: BusinessError) => {
          Logger.error(`getMediaContent error: ${error.code}, message: ${error.message}`);
        })
    } catch (error) {
      Logger.error(`getImageColor error: ${error}`);
    }
  }
  
  /**
   * 恢复流转状态
   */
  private async restoreContinuationState(): Promise<void> {
    try {
      const context = this.getUIContext().getHostContext();
      if (!context) return;
      
      // 恢复播放器状态
      const restoredTime = await this.playerController.restorePlayerState(context);
      
      // 如果有保存的播放进度，跳转到该位置
      if (restoredTime > 0) {
        Logger.info(`流转到设备，恢复到 ${restoredTime}ms`);
        // 延迟一下再跳转，等待播放器初始化完成
        setTimeout(() => {
          this.playerController.seek(restoredTime);
        }, 500);
      }
    } catch (error) {
      Logger.error(`恢复流转状态失败: ${error}`);
    }
  }
}