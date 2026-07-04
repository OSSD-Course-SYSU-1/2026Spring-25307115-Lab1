import type { SongData } from '../model/SongData';
import deviceInfo from "@ohos:deviceInfo";
export enum AudioType {
    MP3 = 1,
    FLAC = 2,
    PCM = 3
}
export enum AudioName {
    MP3 = ".mp3",
    FLAC = ".flac",
    PCM = ".pcm"
}
export const songDataList: SongData[] = [
    {
        id: 1,
        title: 'Dream It Possible',
        singer: 'Delacey',
        label: { "id": 16777232, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" },
        src: 'Delacey - Dream It Possible',
        index: 0,
        isDarkBackground: true,
        mark: { "id": 16777239, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
    },
    {
        id: 2,
        title: '夜空中最亮的星',
        singer: '逃跑计划',
        label: { "id": 16777232, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" },
        src: '夜空中最亮的星',
        index: 1,
        isDarkBackground: true,
        mark: { "id": 16777239, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
    },
    {
        id: 3,
        title: '平凡之路',
        singer: '朴树',
        label: { "id": 16777232, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" },
        src: '平凡之路',
        index: 2,
        isDarkBackground: false,
        mark: { "id": 16777239, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
    }
];
// 播放模式枚举
export enum PlayMode {
    SINGLE_LOOP = 0,
    LIST_LOOP = 1,
    RANDOM = 2 // 随机播放
}
// 设备类型枚举
export enum DeviceType {
    PHONE = 0,
    TABLET = 1,
    WEARABLE = 2,
    OTHER = 3
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
            }
            else if (deviceType === 'tablet') {
                return DeviceType.TABLET;
            }
            else if (deviceType === 'phone') {
                return DeviceType.PHONE;
            }
        }
        catch (e) {
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
