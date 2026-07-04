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

import { SongData } from '../model/SongData';
import { PlayMode, DeviceUtil } from '../common/Constants';

@Component
export struct PlayListComponent {
  @Prop songList: SongData[] = [];
  @Prop currentIndex: number = 0;
  @Prop playMode: PlayMode = PlayMode.SINGLE_LOOP;
  @Prop imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @Consume isShowPlayList: boolean;
  @State isWearable: boolean = false;

  // 回调函数
  onSongSelect?: (index: number) => void;
  onClose?: () => void;

  aboutToAppear(): void {
    this.isWearable = DeviceUtil.isWearable();
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Text('播放列表')
          .fontSize(this.isWearable ? 16 : 20)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Bold)

        Blank()

        // 播放模式切换按钮
        Image(this.getPlayModeIcon())
          .width(this.isWearable ? 20 : 24)
          .height(this.isWearable ? 20 : 24)
          .fillColor(Color.White)
          .onClick(() => {
            this.togglePlayMode();
          })

        Image($r('app.media.ic_public_forward'))
          .width(this.isWearable ? 20 : 24)
          .height(this.isWearable ? 20 : 24)
          .fillColor(Color.White)
          .rotate({ angle: 180 })
          .margin({ left: 16 })
          .onClick(() => {
            this.isShowPlayList = false;
          })
      }
      .width('100%')
      .padding(this.isWearable ? 
        { left: 16, right: 16, top: 12, bottom: 12 } : 
        { left: 24, right: 24, top: 16, bottom: 16 })

      Divider()
        .color('#33FFFFFF')
        .strokeWidth(1)

      // 歌曲列表
      List({ space: 8 }) {
        ForEach(this.songList, (song: SongData, index: number) => {
          ListItem() {
            Row() {
              // 序号或播放图标
              if (this.currentIndex === index) {
                Image($r('app.media.order_play'))
                  .width(20)
                  .height(20)
                  .fillColor('#00FFFF')
              } else {
                Text(`${index + 1}`)
                  .fontSize(14)
                  .fontColor('#99FFFFFF')
                  .width(20)
                  .textAlign(TextAlign.Center)
              }

              // 歌曲信息
              Column() {
                Text(song.title)
                  .fontSize(this.isWearable ? 13 : 16)
                  .fontColor(this.currentIndex === index ? '#00FFFF' : Color.White)
                  .fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Regular)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })

                Text(song.singer)
                  .fontSize(this.isWearable ? 10 : 12)
                  .fontColor('#66FFFFFF')
                  .margin({ top: this.isWearable ? 2 : 4 })
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
              }
              .alignItems(HorizontalAlign.Start)
              .margin({ left: this.isWearable ? 8 : 12 })
              .layoutWeight(1)

              // VIP标识
              if (song.mark && !this.isWearable) {
                Image(song.mark)
                  .width(32)
                  .height(16)
                  .objectFit(ImageFit.Contain)
              }
            }
            .width('100%')
            .padding(this.isWearable ? 
              { left: 16, right: 16, top: 8, bottom: 8 } : 
              { left: 24, right: 24, top: 12, bottom: 12 })
            .backgroundColor(this.currentIndex === index ? 'rgba(0, 255, 255, 0.1)' : 'transparent')
            .borderRadius(8)
            .onClick(() => {
              if (this.onSongSelect) {
                this.onSongSelect(index);
              }
              this.isShowPlayList = false;
            })
          }
        }, (song: SongData) => song.id.toString())
      }
      .width('100%')
      .layoutWeight(1)
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.imageColor)
  }

  // 获取播放模式图标
  private getPlayModeIcon(): Resource {
    switch (this.playMode) {
      case PlayMode.SINGLE_LOOP:
        return $r('app.media.order_play');
      case PlayMode.LIST_LOOP:
        return $r('app.media.ic_music_list');
      case PlayMode.RANDOM:
        return $r('app.media.ic_sort_list');
      default:
        return $r('app.media.order_play');
    }
  }

  // 切换播放模式
  private togglePlayMode(): void {
    // 播放模式切换逻辑由父组件处理
  }
}
