/**
 * 音频格式信息
 */
export interface AudioFormatInfo {
    format: string; // 格式名称
    sampleRate: number; // 采样率 (Hz)
    bitDepth: number; // 位深度 (bit)
    channels: number; // 声道数
    bitrate: number; // 比特率 (kbps)
    fileSize: number; // 文件大小 (KB)
    duration: number; // 时长 (秒)
    qualityScore: number; // 音质评分 (0-100)
}
/**
 * 标准音频参数
 */
export interface StandardAudioParams {
    sampleRate: number;
    bitDepth: number;
    channels: number;
    bitrate: number;
}
/**
 * 音质评分参数
 */
export interface QualityScoreParams {
    sampleRate: number;
    bitDepth: number;
    bitrate: number;
    format: string;
}
/**
 * 格式对比结果
 */
export interface FormatCompareResult {
    better: number;
    difference: string;
}
/**
 * 音频信息解析工具类
 * 用于解析和计算音频文件的各项参数
 */
export class AudioInfoParser {
    /**
     * 根据音频类型获取标准参数配置
     */
    static getStandardParams(audioType: number): StandardAudioParams {
        switch (audioType) {
            case 1: // MP3
                return {
                    sampleRate: 44100,
                    bitDepth: 16,
                    channels: 2,
                    bitrate: 320 // 高质量MP3
                } as StandardAudioParams;
            case 2: // FLAC
                return {
                    sampleRate: 44100,
                    bitDepth: 16,
                    channels: 2,
                    bitrate: 1411 // CD音质
                } as StandardAudioParams;
            case 3: // PCM
                return {
                    sampleRate: 44100,
                    bitDepth: 16,
                    channels: 2,
                    bitrate: 1411 // 无损原始数据
                } as StandardAudioParams;
            default:
                return {
                    sampleRate: 44100,
                    bitDepth: 16,
                    channels: 2,
                    bitrate: 320
                } as StandardAudioParams;
        }
    }
    /**
     * 计算音质评分
     * 基于比特率、采样率、位深度等参数综合评估
     */
    static calculateQualityScore(params: QualityScoreParams): number {
        let score = 0;
        // 比特率评分 (0-40分)
        const bitrateScore = Math.min(40, (params.bitrate / 1411) * 40);
        score += bitrateScore;
        // 采样率评分 (0-30分)
        const sampleRateScore = Math.min(30, (params.sampleRate / 48000) * 30);
        score += sampleRateScore;
        // 位深度评分 (0-20分)
        const bitDepthScore = Math.min(20, (params.bitDepth / 24) * 20);
        score += bitDepthScore;
        // 格式系数 (0-10分)
        let formatBonus = 0;
        switch (params.format.toLowerCase()) {
            case 'flac':
            case 'pcm':
                formatBonus = 10; // 无损格式加分
                break;
            case 'mp3':
                formatBonus = 5; // 有损压缩
                break;
            default:
                formatBonus = 3;
        }
        score += formatBonus;
        return Math.min(100, Math.round(score));
    }
    /**
     * 格式化文件大小
     */
    static formatFileSize(sizeInKB: number): string {
        if (sizeInKB < 1024) {
            return `${sizeInKB.toFixed(1)} KB`;
        }
        else {
            return `${(sizeInKB / 1024).toFixed(2)} MB`;
        }
    }
    /**
     * 格式化时长
     */
    static formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    /**
     * 格式化采样率显示
     */
    static formatSampleRate(sampleRate: number): string {
        if (sampleRate >= 1000) {
            return `${(sampleRate / 1000).toFixed(1)} kHz`;
        }
        return `${sampleRate} Hz`;
    }
    /**
     * 获取格式描述
     */
    static getFormatDescription(format: string): string {
        switch (format.toLowerCase()) {
            case 'mp3':
                return 'MPEG-1 Audio Layer III，有损压缩格式，广泛兼容';
            case 'flac':
                return 'Free Lossless Audio Codec，无损压缩格式，音质完美';
            case 'pcm':
                return 'Pulse Code Modulation，原始脉冲编码，未压缩数据';
            default:
                return '未知音频格式';
        }
    }
    /**
     * 生成完整的音频信息
     */
    static generateAudioInfo(audioType: number, fileSize: number, duration: number): AudioFormatInfo {
        const params = AudioInfoParser.getStandardParams(audioType);
        const formatName = audioType === 1 ? 'MP3' : audioType === 2 ? 'FLAC' : 'PCM';
        const qualityScore = AudioInfoParser.calculateQualityScore({
            sampleRate: params.sampleRate,
            bitDepth: params.bitDepth,
            bitrate: params.bitrate,
            format: formatName
        } as QualityScoreParams);
        return {
            format: formatName,
            sampleRate: params.sampleRate,
            bitDepth: params.bitDepth,
            channels: params.channels,
            bitrate: params.bitrate,
            fileSize: fileSize,
            duration: duration,
            qualityScore: qualityScore
        };
    }
    /**
     * 对比两种格式的音质差异
     */
    static compareFormats(type1: number, type2: number): FormatCompareResult {
        const info1 = AudioInfoParser.generateAudioInfo(type1, 0, 0);
        const info2 = AudioInfoParser.generateAudioInfo(type2, 0, 0);
        if (info1.qualityScore > info2.qualityScore) {
            return {
                better: type1,
                difference: `${info1.format} 音质评分高 ${info1.qualityScore - info2.qualityScore} 分`
            } as FormatCompareResult;
        }
        else if (info2.qualityScore > info1.qualityScore) {
            return {
                better: type2,
                difference: `${info2.format} 音质评分高 ${info2.qualityScore - info1.qualityScore} 分`
            } as FormatCompareResult;
        }
        else {
            return {
                better: 0,
                difference: '两种格式音质相同'
            } as FormatCompareResult;
        }
    }
}
