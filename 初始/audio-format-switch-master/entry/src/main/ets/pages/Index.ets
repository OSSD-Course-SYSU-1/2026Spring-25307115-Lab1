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
import { songDataList } from '../common/Constants';
import { ColorTools } from '../utils/ColorTools';

@Entry
@Component
struct Index {
  private songDataList: SongData[] = songDataList;
  @State imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @State imageLabel: PixelMap | Resource = this.songDataList[0].label;

  aboutToAppear(): void {
    this.getImageColor();
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
        ControlAreaComponent({ songData: this.songDataList[0], imageColor: this.imageColor })
      }
      .height('100%')
      .width('100%')
      .padding({
        top: 64,
        left: 24,
        right: 24,
        bottom: 24
      })

    }
    .height('100%')
    .width('100%')
    .backgroundColor(this.imageColor)
  }

  @Builder
  CoverInfo() {
    Row() {
      Image(this.songDataList[0].label)
        .height('100%')
        .aspectRatio(1)
        .borderRadius(8)
        .shadow({
          radius: 12,
          color: '#66000000',
          offsetX: 0,
          offsetY: 8
        })
        .margin(3)
    }
    .height('40%')
  }

  @Builder
  MusicInfo() {
    Column() {
      Flex({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center }) {
        Text(this.songDataList[0].title)
          .fontSize(20)
          .fontColor(Color.White)
          .opacity(0.86)
          .fontWeight(FontWeight.Bold)
          .fontFamily('HarmonyHeiTi-Bold')
      }

      Text(this.songDataList[0].singer)
        .textAlign(TextAlign.Start)
        .fontSize(14)
        .fontColor('#99FFFFFF')
        .fontFamily('HarmonyHeiTi')
        .width('100%')
        .fontWeight(FontWeight.Regular)
    }
    .margin({ top: 24 })
  }

  getImageColor() {
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
  }
}