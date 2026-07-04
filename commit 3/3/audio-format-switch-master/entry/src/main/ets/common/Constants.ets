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
import { deviceInfo } from '@kit.BasicServicesKit';

export enum AudioType {
  MP3 = 1,
  FLAC = 2,
  PCM = 3
}

export enum AudioName {
  MP3 = '.mp3',
  FLAC = '.flac',
  PCM = '.pcm'
}

export const songDataList: SongData[] = [
  {
    id: 1,
    title: 'Dream It Possible',
    singer: 'Delacey',
    label: $r('app.media.ic_dream'),
    src: 'Delacey - Dream It Possible',
    index: 0,
    isDarkBackground: true,
    mark: $r('app.media.ic_vip')
  },
  {
    id: 2,
    title: '夜空中最亮的星',
    singer: '逃跑计划',
    label: $r('app.media.ic_dream'),
    src: '夜空中最亮的星',
    index: 1,
    isDarkBackground: true,
    mark: $r('app.media.ic_vip')
  },
  {
    id: 3,
    title: '平凡之路',
    singer: '朴树',
    label: $r('app.media.ic_dream'),
    src: '平凡之路',
    index: 2,
    isDarkBackground: false,
    mark: $r('app.media.ic_vip')
  }
]

// 播放模式枚举
export enum PlayMode {
  SINGLE_LOOP = 0,  // 单曲循环
  LIST_LOOP = 1,    // 列表循环
  RANDOM = 2        // 随机播放
}

// 设备类型枚举
export enum DeviceType {
  PHONE,
  TABLET,
  WEARABLE,
  OTHER
}

/**
 * 设备工具类 - 用于判断当前运行设备类型
 */
export class DeviceUtil {
  /**
   * 获取当前设备类型
   */
  static getDeviceType(): DeviceType {
    try {
      const deviceType = deviceInfo.deviceType;
      if (deviceType === 'wearable') {
        return DeviceType.WEARABLE;
      } else if (deviceType === 'tablet') {
        return DeviceType.TABLET;
      } else if (deviceType === 'phone') {
        return DeviceType.PHONE;
      }
    } catch (e) {
      // 获取失败时默认手机
    }
    return DeviceType.PHONE;
  }

  /**
   * 是否为手表设备
   */
  static isWearable(): boolean {
    return DeviceUtil.getDeviceType() === DeviceType.WEARABLE;
  }

  /**
   * 是否为大屏设备（平板/2in1）
   */
  static isLargeScreen(): boolean {
    const type = DeviceUtil.getDeviceType();
    return type === DeviceType.TABLET || type === DeviceType.OTHER;
  }
}