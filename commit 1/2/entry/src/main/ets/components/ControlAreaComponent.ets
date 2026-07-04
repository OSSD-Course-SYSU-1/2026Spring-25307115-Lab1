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
import { AudioType, AudioName, PlayMode } from '../common/Constants';
import { songDataList } from '../common/Constants';
import { AudioVisualizer, SpectrumData } from '../utils/AudioVisualizer';
import { AudioInfoParser, AudioFormatInfo } from '../utils/AudioInfoParser';

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
  @State currentSpeed: number = 1.0;
  @State playMode: PlayMode = PlayMode.SINGLE_LOOP;
  @State showSpectrum: boolean = true;  // 显示频谱
  @State isABTestMode: boolean = false;  // AB测试模式
  @State lastAudioType: number = 1;  // 上次音质类型
  @State spectrumData: SpectrumData = { frequencies: [], amplitude: [] };  // 频谱数据
  @State showAudioInfo: boolean = false;  // 显示音频信息
  @State audioInfo: AudioFormatInfo | null = null;  // 音频信息
  private index: number = 0;
  @State text: Resource = $r('app.string.standard_quality');
  symbolGlyphModifier: SymbolGlyphModifier = new SymbolGlyphModifier();
  selectedOptionTextModifier: TextModifier = new TextModifier();
  private playerController: PlayerController = new PlayerController();
  private songIndex: number = 0;
  private visualizer: AudioVisualizer = new AudioVisualizer(32);  // 32个频谱柱
  private spectrumTimer: number = -1;  // 频谱更新定时器

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
    
    // 设置播放列表
    this.playerController.setPlayList(songDataList, this.songIndex);
    
    this.getUIContext().getHostContext()?.resourceManager.getRawFd(this.songData.src + AudioName.MP3)
      .then((rawFileDescriptor) => {
        this.playerController.defaultPlay(rawFileDescriptor);
        this.isPlay = true;
        this.lastAudioType = AudioType.MP3;
        this.startSpectrumUpdate();
      })
      .catch((error: BusinessError) => {
        Logger.error(`resourceManager error code ${error.code} message ${error.message}`);
      });
  }

  aboutToDisappear(): void {
    this.stopSpectrumUpdate();
    this.visualizer.release();
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
        
        // AB对比按钮
        Button(this.isABTestMode ? 'AB对比中' : 'AB对比')
          .fontSize(12)
          .width(70)
          .backgroundColor(this.isABTestMode ? '#FF4444' : 'rgba(255, 255, 255, 0.1)')
          .fontColor(Color.White)
          .onClick(() => {
            this.toggleABTest();
          })
        
        // 音频信息按钮
        Image($r('app.media.ic_vip'))
          .width(20)
          .height(20)
          .fillColor('#99FFFFFF')
          .onClick(() => {
            this.showAudioInfoPanel();
          })
        
        // 流转按钮
        Button('流转')
          .fontSize(12)
          .width(60)
          .backgroundColor('rgba(255, 255, 255, 0.15)')
          .fontColor(Color.White)
          .onClick(() => {
            this.startContinuation();
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
      
      // 音频频谱可视化
      if (this.showSpectrum) {
        this.SpectrumVisualizer()
      }

      Row() {
        Image($r('app.media.ic_public_forward'))
          .controlImageBuilder()
          .width(32)
          .onClick(() => {
            this.playPrevious();
          })
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
          .onClick(() => {
            this.playNext();
          })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceBetween)
      .padding({
        left: 36,
        right: 36
      })

      // 播放速度和播放模式控制
      Row() {
        // 播放速度控制
        Button(`速度: ${this.currentSpeed.toFixed(1)}x`)
          .fontSize(12)
          .backgroundColor('rgba(255, 255, 255, 0.1)')
          .fontColor(Color.White)
          .bindMenu(this.SpeedMenu)

        Blank()

        // 播放模式切换
        Image(this.getPlayModeIcon())
          .width(24)
          .height(24)
          .fillColor('#99FFFFFF')
          .onClick(() => {
            this.togglePlayMode();
          })

        // 播放列表按钮
        Image($r('app.media.ic_music_list'))
          .width(24)
          .height(24)
          .fillColor('#99FFFFFF')
          .margin({ left: 16 })
          .onClick(() => {
            this.isShowPlayList = !this.isShowPlayList;
          })
      }
      .width('100%')
      .margin({ top: 16 })
      
      // 音频信息弹窗
      if (this.showAudioInfo && this.audioInfo) {
        this.AudioInfoDialog()
      }
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
      this.updateAudioType(audioType);  // 更新音质类型
    }).catch((error: BusinessError) => {
      Logger.error(`resourceManager error code ${error.code} message ${error.message}`);
    });
  }
  // [End component_changeType]

  // 上一曲
  private playPrevious(): void {
    try {
      const currentIndex = this.playerController.getCurrentIndex();
      const newIndex = this.playerController.previousSong(
        this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(songDataList[currentIndex].src + AudioName.MP3),
        AudioType.MP3
      );
      this.songIndex = newIndex;
      this.index = 0;
      this.text = $r('app.string.standard_quality');
    } catch (error) {
      Logger.error(`playPrevious error: ${error}`);
    }
  }

  // 下一曲
  private playNext(): void {
    try {
      const currentIndex = this.playerController.getCurrentIndex();
      const newIndex = this.playerController.nextSong(
        this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(songDataList[currentIndex].src + AudioName.MP3),
        AudioType.MP3
      );
      this.songIndex = newIndex;
      this.index = 0;
      this.text = $r('app.string.standard_quality');
    } catch (error) {
      Logger.error(`playNext error: ${error}`);
    }
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
    const modes = [PlayMode.SINGLE_LOOP, PlayMode.LIST_LOOP, PlayMode.RANDOM];
    const currentIndex = modes.indexOf(this.playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.playMode = modes[nextIndex];
    this.playerController.setPlayMode(this.playMode);
  }

  @Builder
  SpeedMenu() {
    Menu() {
      MenuItem({ content: '0.5x' })
        .onClick(() => {
          this.currentSpeed = 0.5;
          this.playerController.setPlaybackSpeed(0.5);
        })
      MenuItem({ content: '0.75x' })
        .onClick(() => {
          this.currentSpeed = 0.75;
          this.playerController.setPlaybackSpeed(0.75);
        })
      MenuItem({ content: '1.0x' })
        .onClick(() => {
          this.currentSpeed = 1.0;
          this.playerController.setPlaybackSpeed(1.0);
        })
      MenuItem({ content: '1.25x' })
        .onClick(() => {
          this.currentSpeed = 1.25;
          this.playerController.setPlaybackSpeed(1.25);
        })
      MenuItem({ content: '1.5x' })
        .onClick(() => {
          this.currentSpeed = 1.5;
          this.playerController.setPlaybackSpeed(1.5);
        })
      MenuItem({ content: '2.0x' })
        .onClick(() => {
          this.currentSpeed = 2.0;
          this.playerController.setPlaybackSpeed(2.0);
        })
    }
  }
  
  // ==================== 新增功能方法 ====================
  
  /**
   * 频谱可视化组件
   */
  @Builder
  SpectrumVisualizer() {
    Row() {
      ForEach(this.spectrumData.amplitude, (amplitude: number, index: number) => {
        Column() {
          Rect()
            .width('100%')
            .height(`${amplitude * 60}vp`)  // 最大高度60vp
            .fill(AudioVisualizer.getColorByAudioType(this.lastAudioType, index, this.spectrumData.amplitude.length))
            .borderRadius(2)
        }
        .width('2.5%')
        .height(60)
        .justifyContent(FlexAlign.End)
      }, (amplitude: number, index: number) => `${index}-${amplitude}`)
    }
    .width('100%')
    .height(60)
    .margin({ top: 8, bottom: 8 })
  }
  
  /**
   * 启动频谱更新定时器
   */
  private startSpectrumUpdate(): void {
    this.stopSpectrumUpdate();
    this.spectrumTimer = setInterval(() => {
      if (this.isPlay && this.showSpectrum) {
        this.visualizer.setPlaying(true);
        this.spectrumData = this.visualizer.generateSpectrumData();
      } else {
        this.visualizer.setPlaying(false);
        this.spectrumData = this.visualizer.generateSpectrumData();
      }
    }, 50);  // 20fps 更新频率
  }
  
  /**
   * 停止频谱更新定时器
   */
  private stopSpectrumUpdate(): void {
    if (this.spectrumTimer !== -1) {
      clearInterval(this.spectrumTimer);
      this.spectrumTimer = -1;
    }
  }
  
  /**
   * 切换AB测试模式
   */
  private toggleABTest(): void {
    this.isABTestMode = !this.isABTestMode;
    
    if (this.isABTestMode) {
      // 进入AB测试模式：快速在两种格式间切换
      Logger.info('进入AB对比测试模式');
      this.startABTestLoop();
    } else {
      // 退出AB测试模式
      Logger.info('退出AB对比测试模式');
      this.stopABTestLoop();
    }
  }
  
  private abTestTimer: number = -1;
  
  /**
   * 开始AB测试循环（每2秒切换一次）
   */
  private startABTestLoop(): void {
    let switchToMP3 = true;
    this.abTestTimer = setInterval(() => {
      const currentType = this.index;
      if (switchToMP3 && currentType !== 0) {
        // 切换到MP3
        this.text = $r('app.string.standard_quality');
        this.index = 0;
        this.changeType(this.songData.src + AudioName.MP3, AudioType.MP3);
        this.lastAudioType = AudioType.MP3;
      } else if (!switchToMP3 && currentType !== 1) {
        // 切换到FLAC
        this.text = $r('app.string.flac_high_quality');
        this.index = 1;
        this.changeType(this.songData.src + AudioName.FLAC, AudioType.FLAC);
        this.lastAudioType = AudioType.FLAC;
      }
      switchToMP3 = !switchToMP3;
    }, 2000);  // 每2秒切换一次
  }
  
  /**
   * 停止AB测试循环
   */
  private stopABTestLoop(): void {
    if (this.abTestTimer !== -1) {
      clearInterval(this.abTestTimer);
      this.abTestTimer = -1;
    }
  }
  
  /**
   * 显示音频信息面板
   */
  private showAudioInfoPanel(): void {
    this.audioInfo = AudioInfoParser.generateAudioInfo(
      this.lastAudioType,
      5000,  // 模拟文件大小 5MB
      180    // 模拟时长 3分钟
    );
    this.showAudioInfo = true;
  }
  
  /**
   * 音质切换时更新状态
   */
  private updateAudioType(audioType: number): void {
    this.lastAudioType = audioType;
    this.visualizer.reset();
  }
  
  /**
   * 音频信息弹窗
   */
  @Builder
  AudioInfoDialog() {
    Column() {
      // 标题栏
      Row() {
        Text('音频参数详情')
          .fontSize(18)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Bold)
        
        Blank()
        
        Image($r('app.media.ic_public_forward'))
          .width(20)
          .height(20)
          .fillColor(Color.White)
          .rotate({ angle: 90 })
          .onClick(() => {
            this.showAudioInfo = false;
          })
      }
      .width('100%')
      .padding({ bottom: 12 })
      
      // 信息内容
      Column() {
        // 格式名称
        this.InfoRow('格式', this.audioInfo!.format, '#00FFFF')
        
        // 采样率
        this.InfoRow('采样率', AudioInfoParser.formatSampleRate(this.audioInfo!.sampleRate))
        
        // 位深度
        this.InfoRow('位深度', `${this.audioInfo!.bitDepth} bit`)
        
        // 声道数
        this.InfoRow('声道数', `${this.audioInfo!.channels} (立体声)`)
        
        // 比特率
        this.InfoRow('比特率', `${this.audioInfo!.bitrate} kbps`)
        
        // 文件大小
        this.InfoRow('文件大小', AudioInfoParser.formatFileSize(this.audioInfo!.fileSize))
        
        // 时长
        this.InfoRow('时长', AudioInfoParser.formatDuration(this.audioInfo!.duration))
        
        Divider()
          .strokeWidth(1)
          .color('#33FFFFFF')
          .margin({ top: 8, bottom: 8 })
        
        // 音质评分
        Row() {
          Text('音质评分')
            .fontSize(14)
            .fontColor('#99FFFFFF')
          
          Blank()
          
          Text(`${this.audioInfo!.qualityScore}/100`)
            .fontSize(24)
            .fontColor(this.getQualityColor(this.audioInfo!.qualityScore))
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
        
        // 格式描述
        Text(AudioInfoParser.getFormatDescription(this.audioInfo!.format))
          .fontSize(12)
          .fontColor('#66FFFFFF')
          .margin({ top: 8 })
          .lineHeight(18)
      }
      .width('100%')
      .padding(16)
      .backgroundColor('rgba(0, 0, 0, 0.7)')
      .borderRadius(12)
    }
    .position({ x: '50%', y: '50%' })
    .translate({ x: '-50%', y: '-50%' })
    .width('85%')
    .padding(20)
    .backgroundColor('rgba(30, 30, 40, 0.95)')
    .borderRadius(16)
    .shadow({
      radius: 20,
      color: '#66000000',
      offsetX: 0,
      offsetY: 8
    })
  }
  
  /**
   * 信息行组件
   */
  @Builder
  InfoRow(label: string, value: string, highlightColor?: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor('#99FFFFFF')
      
      Blank()
      
      Text(value)
        .fontSize(14)
        .fontColor(highlightColor || Color.White)
        .fontWeight(highlightColor ? FontWeight.Bold : FontWeight.Normal)
    }
    .width('100%')
    .padding({ top: 6, bottom: 6 })
  }
  
  /**
   * 根据音质评分获取颜色
   */
  private getQualityColor(score: number): string {
    if (score >= 90) return '#00FF00';  // 绿色 - 优秀
    if (score >= 75) return '#00FFFF';  // 青色 - 良好
    if (score >= 60) return '#FFFF00';  // 黄色 - 一般
    return '#FF4444';  // 红色 - 较差
  }
  
  /**
   * 发起流转
   */
  private async startContinuation(): Promise<void> {
    try {
      Logger.info('开始发起流转');
      
      // TODO: 流转功能需要确认正确的 API
      // HarmonyOS 的跨设备流转功能需要使用特定的系统 API
      // 当前版本暂不支持或需要不同的实现方式
      Logger.warn('流转功能暂未实现，需要确认正确的系统 API');
      
      /*
      // 保存当前播放器状态
      const context = this.getUIContext().getHostContext();
      if (context) {
        await this.playerController.savePlayerState(context);
      }
      
      // 调用系统流转 API
      const abilityDelegator = this.getUIContext().getHostContext();
      if (abilityDelegator) {
        abilityDelegator.startAbilityContinuation((error: BusinessError, data: Object) => {
          if (error) {
            Logger.error(`流转失败: ${error.code}, ${error.message}`);
          } else {
            Logger.info('流转成功发起');
          }
        });
      }
      */
    } catch (error) {
      Logger.error(`流转异常: ${error}`);
    }
  }
}

@Extend(Image)
function controlImageBuilder() {
  .aspectRatio(1)
  .opacity(0.86)
  .objectFit(ImageFit.Contain)
}
