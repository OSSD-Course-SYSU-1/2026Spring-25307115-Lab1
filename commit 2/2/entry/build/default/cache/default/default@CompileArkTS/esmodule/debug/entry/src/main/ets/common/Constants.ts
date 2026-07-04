import type { SongData } from '../model/SongData';
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
