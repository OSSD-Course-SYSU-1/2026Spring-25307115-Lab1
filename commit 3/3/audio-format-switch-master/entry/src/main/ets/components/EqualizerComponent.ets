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

import {
  EqualizerController,
  EqBand,
  EqPresetName
} from '../utils/EqualizerController';

/**
 * 均衡器组件 - 提供10段均衡器UI与交互
 */
@Component
export struct EqualizerComponent {
  @Prop imageColor: string = 'rgba(0, 0, 2, 1.00)';
  @State eqBands: EqBand[] = [];
  @State isEnabled: boolean = false;
  @State currentPreset: EqPresetName = 'FLAT';
  @State showPanel: boolean = false;
  private eqController: EqualizerController = new EqualizerController();
  onEqChange?: (enabled: boolean, preset: EqPresetName, bands: EqBand[]) => void;

  aboutToAppear(): void {
    this.eqBands = this.eqController.getBands();
    this.isEnabled = this.eqController.getEnabled();
    this.currentPreset = this.eqController.getPreset();
  }

  build() {
    Column() {
      // 标题行：均衡器 + 开关
      Row() {
        Image($r('app.media.ic_sort_list'))
          .width(20)
          .height(20)
          .fillColor(this.isEnabled ? '#00FFFF' : '#99FFFFFF')
          .margin({ right: 6 })

        Text('均衡器')
          .fontSize(14)
          .fontColor(this.isEnabled ? '#00FFFF' : '#99FFFFFF')
          .fontWeight(FontWeight.Bold)

        Blank()

        // 开关
        Toggle({ type: ToggleType.Switch, isOn: this.isEnabled })
          .selectedColor('#00FFFF')
          .switchPointColor(Color.White)
          .width(40)
          .height(20)
          .onChange((isOn: boolean) => {
            this.isEnabled = isOn;
            this.eqController.setEnabled(isOn);
            this.notifyChange();
          })
      }
      .width('100%')
      .padding({ top: 8, bottom: 8 })

      // 预设按钮网格 (2行 x 4列) - 始终可见
      this.PresetGrid()

      // 展开/收起滑块区域
      Row() {
        Text(this.showPanel ? '收起调节器' : '频段精细调节')
          .fontSize(12)
          .fontColor('#99FFFFFF')

        Image($r('app.media.ic_public_forward'))
          .width(12)
          .height(12)
          .fillColor('#99FFFFFF')
          .rotate({ angle: this.showPanel ? 180 : 90 })
          .margin({ left: 4 })
      }
      .width('100%')
      .padding({ top: 8, bottom: 4 })
      .onClick(() => {
        this.showPanel = !this.showPanel;
      })

      // 10段滑块（可展开）
      if (this.showPanel) {
        this.BandSliders()
      }
    }
    .width('100%')
    .padding(12)
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .borderRadius(16)
    .margin({ top: 8 })
  }

  /**
   * 预设按钮网格 - 2行4列布局
   */
  @Builder
  PresetGrid() {
    Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween }) {
      ForEach(this.getPresetList(), (item: number) => {
        Column() {
          Text(this.getPresetIcon(item))
            .fontSize(18)
            .margin({ bottom: 2 })

          Text(this.getPresetLabel(item))
            .fontSize(10)
            .fontColor(this.currentPreset === this.getPresetName(item) ? '#00FFFF' : '#CCFFFFFF')
            .fontWeight(this.currentPreset === this.getPresetName(item) ? FontWeight.Bold : FontWeight.Normal)
            .maxLines(1)
        }
        .width('23%')
        .height(56)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
        .backgroundColor(this.currentPreset === this.getPresetName(item) ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)')
        .borderRadius(10)
        .border({
          width: this.currentPreset === this.getPresetName(item) ? 1 : 0,
          color: '#00FFFF'
        })
        .margin({ bottom: 6 })
        .onClick(() => {
          const preset = this.getPresetName(item);
          this.currentPreset = preset;
          this.eqController.applyPreset(preset);
          this.isEnabled = this.eqController.getEnabled();
          this.eqBands = this.eqController.getBands();
          this.notifyChange();
        })
      }, (item: number) => `${item}`)
    }
    .width('100%')
  }

  /**
   * 预设列表索引 (0-7)
   */
  private getPresetList(): number[] {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  }

  /**
   * 通过索引获取预设名称
   */
  private getPresetName(index: number): EqPresetName {
    const names: EqPresetName[] = ['FLAT', 'POP', 'ROCK', 'JAZZ', 'CLASSICAL', 'VOCAL', 'BASS_BOOST', 'TREBLE_BOOST'];
    return names[index];
  }

  /**
   * 通过索引获取预设显示名称
   */
  private getPresetLabel(index: number): string {
    const labels: string[] = ['默认', '流行', '摇滚', '爵士', '古典', '人声', '低音', '高音'];
    return labels[index];
  }

  /**
   * 通过索引获取预设图标
   */
  private getPresetIcon(index: number): string {
    const icons: string[] = ['♪', '♫', '♬', '♩', '🎻', '🎤', '🔊', '🔔'];
    return icons[index];
  }

  /**
   * 10段均衡滑块
   */
  @Builder
  BandSliders() {
    Row() {
      ForEach(this.eqBands, (band: EqBand, index: number) => {
        Column() {
          // 增益值显示
          Text(`${band.gain > 0 ? '+' : ''}${band.gain.toFixed(0)}`)
            .fontSize(9)
            .fontColor(band.gain > 0 ? '#00FF00' : band.gain < 0 ? '#FF4444' : '#99FFFFFF')
            .margin({ bottom: 4 })

          // 竖向滑块（通过旋转实现）
          Slider({
            min: -12,
            max: 12,
            step: 1,
            value: band.gain,
            style: SliderStyle.OutSet
          })
            .selectedColor('#00FFFF')
            .trackColor('#33FFFFFF')
            .blockColor(Color.White)
            .width(120)
            .height(40)
            .rotate({ angle: -90 })
            .onChange((value: number) => {
              this.eqController.setBandGain(index, value);
              this.eqBands = this.eqController.getBands();
              this.currentPreset = this.eqController.getPreset();
              this.notifyChange();
            })

          // 频率标签
          Text(band.label)
            .fontSize(9)
            .fontColor('#99FFFFFF')
            .margin({ top: 4 })

          // Hz单位
          Text(index === 0 || index === 5 || index === 9 ? 'Hz' : '')
            .fontSize(7)
            .fontColor('#66FFFFFF')
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
      }, (band: EqBand, index: number) => `${index}-${band.gain}`)
    }
    .width('100%')
    .padding({ left: 8, right: 8 })
  }

  /**
   * 通知外部均衡器状态变化
   */
  private notifyChange(): void {
    if (this.onEqChange) {
      this.onEqChange(this.isEnabled, this.currentPreset, this.eqBands);
    }
  }

  /**
   * 获取均衡器控制器 (供外部访问)
   */
  getController(): EqualizerController {
    return this.eqController;
  }
}
