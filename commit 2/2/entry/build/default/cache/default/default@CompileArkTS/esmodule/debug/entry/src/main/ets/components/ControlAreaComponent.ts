if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ControlAreaComponent_Params {
    isPlay?: boolean;
    currentTime?: string;
    totalTime?: string;
    value?: number;
    max?: number;
    songData?: SongData;
    imageColor?: string;
    isShowPlayList?: boolean;
    isFavorite?: boolean;
    currentSpeed?: number;
    playMode?: PlayMode;
    showSpectrum?: boolean;
    isABTestMode?: boolean;
    lastAudioType?: number;
    spectrumData?: SpectrumData;
    showAudioInfo?: boolean;
    audioInfo?: AudioFormatInfo | null;
    index?: number;
    text?: Resource;
    symbolGlyphModifier?: SymbolGlyphModifier;
    selectedOptionTextModifier?: TextModifier;
    playerController?: PlayerController;
    songIndex?: number;
    visualizer?: AudioVisualizer;
    spectrumTimer?: number;
    abTestTimer?: number;
}
import { LengthMetrics } from "@ohos:arkui.node";
import { SymbolGlyphModifier } from "@ohos:arkui.modifier";
import { TextModifier } from "@ohos:arkui.modifier";
import { SongData } from "@normalized:N&&&entry/src/main/ets/model/SongData&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/player/PlayerController&";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import type { BusinessError } from "@ohos:base";
import { AudioType, AudioName, PlayMode } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { songDataList } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { AudioVisualizer } from "@normalized:N&&&entry/src/main/ets/utils/AudioVisualizer&";
import type { SpectrumData } from "@normalized:N&&&entry/src/main/ets/utils/AudioVisualizer&";
import { AudioInfoParser } from "@normalized:N&&&entry/src/main/ets/utils/AudioInfoParser&";
import type { AudioFormatInfo } from "@normalized:N&&&entry/src/main/ets/utils/AudioInfoParser&";
import { EqualizerComponent } from "@normalized:N&&&entry/src/main/ets/components/EqualizerComponent&";
export class ControlAreaComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isPlay = new ObservedPropertySimplePU(false, this, "isPlay");
        this.__currentTime = this.createStorageLink('currentTime', '00:00', "currentTime");
        this.__totalTime = this.createStorageLink('totalTime', '00:00', "totalTime");
        this.__value = this.createStorageLink('progress', 0, "value");
        this.__max = this.createStorageLink('progressMax', 0, "max");
        this.__songData = new SynchedPropertyObjectOneWayPU(params.songData, this, "songData");
        this.__imageColor = new SynchedPropertySimpleOneWayPU(params.imageColor, this, "imageColor");
        this.__isShowPlayList = new ObservedPropertySimplePU(false, this, "isShowPlayList");
        this.__isFavorite = new ObservedPropertySimplePU(false, this, "isFavorite");
        this.__currentSpeed = new ObservedPropertySimplePU(1.0, this, "currentSpeed");
        this.__playMode = new ObservedPropertySimplePU(PlayMode.SINGLE_LOOP, this, "playMode");
        this.__showSpectrum = new ObservedPropertySimplePU(true, this, "showSpectrum");
        this.__isABTestMode = new ObservedPropertySimplePU(false, this, "isABTestMode");
        this.__lastAudioType = new ObservedPropertySimplePU(1, this, "lastAudioType");
        this.__spectrumData = new ObservedPropertyObjectPU({ frequencies: [], amplitude: [] }, this, "spectrumData");
        this.__showAudioInfo = new ObservedPropertySimplePU(false, this, "showAudioInfo");
        this.__audioInfo = new ObservedPropertyObjectPU(null, this, "audioInfo");
        this.index = 0;
        this.__text = new ObservedPropertyObjectPU({ "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }, this, "text");
        this.symbolGlyphModifier = new SymbolGlyphModifier();
        this.selectedOptionTextModifier = new TextModifier();
        this.playerController = new PlayerController();
        this.songIndex = 0;
        this.visualizer = new AudioVisualizer(32);
        this.spectrumTimer = -1;
        this.abTestTimer = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ControlAreaComponent_Params) {
        if (params.isPlay !== undefined) {
            this.isPlay = params.isPlay;
        }
        if (params.songData === undefined) {
            this.__songData.set(new SongData());
        }
        if (params.imageColor === undefined) {
            this.__imageColor.set('rgba(0, 0, 2, 1.00)');
        }
        if (params.isShowPlayList !== undefined) {
            this.isShowPlayList = params.isShowPlayList;
        }
        if (params.isFavorite !== undefined) {
            this.isFavorite = params.isFavorite;
        }
        if (params.currentSpeed !== undefined) {
            this.currentSpeed = params.currentSpeed;
        }
        if (params.playMode !== undefined) {
            this.playMode = params.playMode;
        }
        if (params.showSpectrum !== undefined) {
            this.showSpectrum = params.showSpectrum;
        }
        if (params.isABTestMode !== undefined) {
            this.isABTestMode = params.isABTestMode;
        }
        if (params.lastAudioType !== undefined) {
            this.lastAudioType = params.lastAudioType;
        }
        if (params.spectrumData !== undefined) {
            this.spectrumData = params.spectrumData;
        }
        if (params.showAudioInfo !== undefined) {
            this.showAudioInfo = params.showAudioInfo;
        }
        if (params.audioInfo !== undefined) {
            this.audioInfo = params.audioInfo;
        }
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.text !== undefined) {
            this.text = params.text;
        }
        if (params.symbolGlyphModifier !== undefined) {
            this.symbolGlyphModifier = params.symbolGlyphModifier;
        }
        if (params.selectedOptionTextModifier !== undefined) {
            this.selectedOptionTextModifier = params.selectedOptionTextModifier;
        }
        if (params.playerController !== undefined) {
            this.playerController = params.playerController;
        }
        if (params.songIndex !== undefined) {
            this.songIndex = params.songIndex;
        }
        if (params.visualizer !== undefined) {
            this.visualizer = params.visualizer;
        }
        if (params.spectrumTimer !== undefined) {
            this.spectrumTimer = params.spectrumTimer;
        }
        if (params.abTestTimer !== undefined) {
            this.abTestTimer = params.abTestTimer;
        }
    }
    updateStateVars(params: ControlAreaComponent_Params) {
        this.__songData.reset(params.songData);
        this.__imageColor.reset(params.imageColor);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isPlay.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTime.purgeDependencyOnElmtId(rmElmtId);
        this.__totalTime.purgeDependencyOnElmtId(rmElmtId);
        this.__value.purgeDependencyOnElmtId(rmElmtId);
        this.__max.purgeDependencyOnElmtId(rmElmtId);
        this.__songData.purgeDependencyOnElmtId(rmElmtId);
        this.__imageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPlayList.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorite.purgeDependencyOnElmtId(rmElmtId);
        this.__currentSpeed.purgeDependencyOnElmtId(rmElmtId);
        this.__playMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showSpectrum.purgeDependencyOnElmtId(rmElmtId);
        this.__isABTestMode.purgeDependencyOnElmtId(rmElmtId);
        this.__lastAudioType.purgeDependencyOnElmtId(rmElmtId);
        this.__spectrumData.purgeDependencyOnElmtId(rmElmtId);
        this.__showAudioInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__audioInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isPlay.aboutToBeDeleted();
        this.__currentTime.aboutToBeDeleted();
        this.__totalTime.aboutToBeDeleted();
        this.__value.aboutToBeDeleted();
        this.__max.aboutToBeDeleted();
        this.__songData.aboutToBeDeleted();
        this.__imageColor.aboutToBeDeleted();
        this.__isShowPlayList.aboutToBeDeleted();
        this.__isFavorite.aboutToBeDeleted();
        this.__currentSpeed.aboutToBeDeleted();
        this.__playMode.aboutToBeDeleted();
        this.__showSpectrum.aboutToBeDeleted();
        this.__isABTestMode.aboutToBeDeleted();
        this.__lastAudioType.aboutToBeDeleted();
        this.__spectrumData.aboutToBeDeleted();
        this.__showAudioInfo.aboutToBeDeleted();
        this.__audioInfo.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isPlay: ObservedPropertySimplePU<boolean>;
    get isPlay() {
        return this.__isPlay.get();
    }
    set isPlay(newValue: boolean) {
        this.__isPlay.set(newValue);
    }
    private __currentTime: ObservedPropertyAbstractPU<string>;
    get currentTime() {
        return this.__currentTime.get();
    }
    set currentTime(newValue: string) {
        this.__currentTime.set(newValue);
    }
    private __totalTime: ObservedPropertyAbstractPU<string>;
    get totalTime() {
        return this.__totalTime.get();
    }
    set totalTime(newValue: string) {
        this.__totalTime.set(newValue);
    }
    private __value: ObservedPropertyAbstractPU<number>;
    get value() {
        return this.__value.get();
    }
    set value(newValue: number) {
        this.__value.set(newValue);
    }
    private __max: ObservedPropertyAbstractPU<number>;
    get max() {
        return this.__max.get();
    }
    set max(newValue: number) {
        this.__max.set(newValue);
    }
    private __songData: SynchedPropertySimpleOneWayPU<SongData>;
    get songData() {
        return this.__songData.get();
    }
    set songData(newValue: SongData) {
        this.__songData.set(newValue);
    }
    private __imageColor: SynchedPropertySimpleOneWayPU<string>;
    get imageColor() {
        return this.__imageColor.get();
    }
    set imageColor(newValue: string) {
        this.__imageColor.set(newValue);
    }
    private __isShowPlayList: ObservedPropertySimplePU<boolean>;
    get isShowPlayList() {
        return this.__isShowPlayList.get();
    }
    set isShowPlayList(newValue: boolean) {
        this.__isShowPlayList.set(newValue);
    }
    private __isFavorite: ObservedPropertySimplePU<boolean>;
    get isFavorite() {
        return this.__isFavorite.get();
    }
    set isFavorite(newValue: boolean) {
        this.__isFavorite.set(newValue);
    }
    private __currentSpeed: ObservedPropertySimplePU<number>;
    get currentSpeed() {
        return this.__currentSpeed.get();
    }
    set currentSpeed(newValue: number) {
        this.__currentSpeed.set(newValue);
    }
    private __playMode: ObservedPropertySimplePU<PlayMode>;
    get playMode() {
        return this.__playMode.get();
    }
    set playMode(newValue: PlayMode) {
        this.__playMode.set(newValue);
    }
    private __showSpectrum: ObservedPropertySimplePU<boolean>; // 显示频谱
    get showSpectrum() {
        return this.__showSpectrum.get();
    }
    set showSpectrum(newValue: boolean) {
        this.__showSpectrum.set(newValue);
    }
    private __isABTestMode: ObservedPropertySimplePU<boolean>; // AB测试模式
    get isABTestMode() {
        return this.__isABTestMode.get();
    }
    set isABTestMode(newValue: boolean) {
        this.__isABTestMode.set(newValue);
    }
    private __lastAudioType: ObservedPropertySimplePU<number>; // 上次音质类型
    get lastAudioType() {
        return this.__lastAudioType.get();
    }
    set lastAudioType(newValue: number) {
        this.__lastAudioType.set(newValue);
    }
    private __spectrumData: ObservedPropertyObjectPU<SpectrumData>; // 频谱数据
    get spectrumData() {
        return this.__spectrumData.get();
    }
    set spectrumData(newValue: SpectrumData) {
        this.__spectrumData.set(newValue);
    }
    private __showAudioInfo: ObservedPropertySimplePU<boolean>; // 显示音频信息
    get showAudioInfo() {
        return this.__showAudioInfo.get();
    }
    set showAudioInfo(newValue: boolean) {
        this.__showAudioInfo.set(newValue);
    }
    private __audioInfo: ObservedPropertyObjectPU<AudioFormatInfo | null>; // 音频信息
    get audioInfo() {
        return this.__audioInfo.get();
    }
    set audioInfo(newValue: AudioFormatInfo | null) {
        this.__audioInfo.set(newValue);
    }
    private index: number;
    private __text: ObservedPropertyObjectPU<Resource>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: Resource) {
        this.__text.set(newValue);
    }
    private symbolGlyphModifier: SymbolGlyphModifier;
    private selectedOptionTextModifier: TextModifier;
    private playerController: PlayerController;
    private songIndex: number;
    private visualizer: AudioVisualizer; // 32个频谱柱
    private spectrumTimer: number; // 频谱更新定时器
    aboutToAppear(): void {
        this.symbolGlyphModifier
            .fontSize(12)
            .fontColor(['#999999']);
        this.selectedOptionTextModifier
            .maxLines(1)
            .fontSize(12)
            .textAlign(TextAlign.Start)
            .fontWeight(FontWeight.Bold)
            .width(160);
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.text);
            Button.fontSize(16);
            Button.width(100);
            Button.bindMenu({ builder: this.MyMenu.bind(this) });
            Button.backgroundColor(this.imageColor);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isFavorite ? { "id": 16777231, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" } : { "id": 16777230, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            globalThis.Context.animation({
                duration: 500
            });
            Image.fillColor(this.isFavorite ? Color.Red : Color.White);
            __Image__controlImageBuilder();
            globalThis.Context.animation(null);
            Image.width(24);
            Image.onClick(() => {
                this.isFavorite = !this.isFavorite;
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AB对比按钮
            Button.createWithLabel(this.isABTestMode ? 'AB对比中' : 'AB对比');
            // AB对比按钮
            Button.fontSize(12);
            // AB对比按钮
            Button.width(70);
            // AB对比按钮
            Button.backgroundColor(this.isABTestMode ? '#FF4444' : 'rgba(255, 255, 255, 0.1)');
            // AB对比按钮
            Button.fontColor(Color.White);
            // AB对比按钮
            Button.onClick(() => {
                this.toggleABTest();
            });
        }, Button);
        // AB对比按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音频信息按钮
            Image.create({ "id": 16777239, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            // 音频信息按钮
            Image.width(20);
            // 音频信息按钮
            Image.height(20);
            // 音频信息按钮
            Image.fillColor('#99FFFFFF');
            // 音频信息按钮
            Image.onClick(() => {
                this.showAudioInfoPanel();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 流转按钮
            Button.createWithLabel('流转');
            // 流转按钮
            Button.fontSize(12);
            // 流转按钮
            Button.width(60);
            // 流转按钮
            Button.backgroundColor('rgba(255, 255, 255, 0.15)');
            // 流转按钮
            Button.fontColor(Color.White);
            // 流转按钮
            Button.onClick(() => {
                this.startContinuation();
            });
        }, Button);
        // 流转按钮
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({
                top: 24,
                bottom: 12
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({
                min: 0,
                max: this.max,
                step: 1,
                style: SliderStyle.OutSet,
                value: this.value
            });
            Slider.selectedColor('#DBFFFFFF');
            Slider.trackColor('#33FFFFFF');
            Slider.onChange((value: number, mode: SliderChangeMode) => {
                if (mode === SliderChangeMode.End || mode === SliderChangeMode.Begin) {
                    this.playerController.seek(value);
                }
            });
            Slider.height(16);
            Slider.margin({
                left: -4,
                right: -4
            });
            Slider.hitTestBehavior(HitTestMode.Block);
        }, Slider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentTime);
            Text.fontColor('#99FFFFFF');
            Text.fontSize(10);
            Text.fontFamily('HarmonyHeiTi');
            Text.lineHeight('14vp');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.totalTime);
            Text.fontColor('#99FFFFFF');
            Text.fontSize(10);
            Text.fontFamily('HarmonyHeiTi');
            Text.lineHeight('14vp');
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 音频频谱可视化
            if (this.showSpectrum) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.SpectrumVisualizer.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.padding({
                left: 36,
                right: 36
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            __Image__controlImageBuilder();
            Image.width(32);
            Image.onClick(() => {
                this.playPrevious();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.isPlay ? { "id": 16777237, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" } : { "id": 16777236, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            __Image__controlImageBuilder();
            Image.width(72);
            Image.onClick(() => {
                if (this.isPlay) {
                    this.playerController.pause();
                }
                else {
                    this.playerController.start();
                }
                this.isPlay = !this.isPlay;
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777235, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            __Image__controlImageBuilder();
            Image.width(32);
            Image.onClick(() => {
                this.playNext();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 播放速度和播放模式控制
            Row.create();
            // 播放速度和播放模式控制
            Row.width('100%');
            // 播放速度和播放模式控制
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 播放速度控制
            Button.createWithLabel(`速度: ${this.currentSpeed.toFixed(1)}x`);
            // 播放速度控制
            Button.fontSize(12);
            // 播放速度控制
            Button.backgroundColor('rgba(255, 255, 255, 0.1)');
            // 播放速度控制
            Button.fontColor(Color.White);
            // 播放速度控制
            Button.bindMenu({ builder: this.SpeedMenu.bind(this) });
        }, Button);
        // 播放速度控制
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 播放模式切换
            Image.create(this.getPlayModeIcon());
            // 播放模式切换
            Image.width(24);
            // 播放模式切换
            Image.height(24);
            // 播放模式切换
            Image.fillColor('#99FFFFFF');
            // 播放模式切换
            Image.onClick(() => {
                this.togglePlayMode();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 播放列表按钮
            Image.create({ "id": 16777233, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            // 播放列表按钮
            Image.width(24);
            // 播放列表按钮
            Image.height(24);
            // 播放列表按钮
            Image.fillColor('#99FFFFFF');
            // 播放列表按钮
            Image.margin({ left: 16 });
            // 播放列表按钮
            Image.onClick(() => {
                this.isShowPlayList = !this.isShowPlayList;
            });
        }, Image);
        // 播放速度和播放模式控制
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 音频信息弹窗
            if (this.showAudioInfo && this.audioInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.AudioInfoDialog.bind(this)();
                });
            }
            // 均衡器组件
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 均衡器组件
                    EqualizerComponent(this, { imageColor: this.imageColor }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/ControlAreaComponent.ets", line: 258, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            imageColor: this.imageColor
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        imageColor: this.imageColor
                    });
                }
            }, { name: "EqualizerComponent" });
        }
        Column.pop();
        Scroll.pop();
    }
    MyMenu(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.create();
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.width(224);
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.font({ size: 16 });
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.height(152);
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.menuItemDivider({
                strokeWidth: LengthMetrics.vp(0.5),
                color: '#d5d5d5',
                mode: DividerMode.EMBEDDED_IN_MENU
            });
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.subMenuExpandingMode(SubMenuExpandingMode.EMBEDDED_EXPAND);
            // [Start menu_audioRender]
            // [Start menu_avplayer]
            Menu.backgroundColor(Color.White);
        }, Menu);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({
                content: { "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
            });
            MenuItem.onClick(() => {
                if (this.index === 0) {
                    return;
                }
                this.text = { "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
                this.index = 0;
                this.changeType(this.songData.src + AudioName.MP3, AudioType.MP3);
                this.isPlay = true;
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // [StartExclude menu_audioRender]
            MenuItem.create({
                content: { "id": 16777222, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
            });
            // [StartExclude menu_audioRender]
            MenuItem.onClick(() => {
                if (this.index === 1) {
                    return;
                }
                this.text = { "id": 16777222, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
                this.index = 1;
                this.changeType(this.songData.src + AudioName.FLAC, AudioType.FLAC);
                this.isPlay = true;
            });
        }, MenuItem);
        // [StartExclude menu_audioRender]
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // [EndExclude menu_audioRender]
            // [StartExclude menu_avplayer]
            MenuItem.create({
                content: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" }
            });
            // [EndExclude menu_audioRender]
            // [StartExclude menu_avplayer]
            MenuItem.onClick(() => {
                if (this.index === 2) {
                    return;
                }
                this.text = { "id": 16777225, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
                this.index = 2;
                this.changeType(this.songData.src + AudioName.PCM, AudioType.PCM);
                this.isPlay = true;
            });
        }, MenuItem);
        // [EndExclude menu_audioRender]
        // [StartExclude menu_avplayer]
        MenuItem.pop();
        // [Start menu_audioRender]
        // [Start menu_avplayer]
        Menu.pop();
    }
    // [Start component_changeType]
    private changeType(songSrc: string, audioType: AudioType): void {
        let current: number = this.value;
        this.getUIContext().getHostContext()?.resourceManager.getRawFd(songSrc).then((rawFileDescriptor) => {
            this.playerController.changeType(rawFileDescriptor, audioType);
            this.playerController.seek(current);
            this.updateAudioType(audioType); // 更新音质类型
        }).catch((error: BusinessError) => {
            Logger.error(`resourceManager error code ${error.code} message ${error.message}`);
        });
    }
    // [End component_changeType]
    // 上一曲
    private playPrevious(): void {
        try {
            const currentIndex = this.playerController.getCurrentIndex();
            const newIndex = this.playerController.previousSong(this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(songDataList[currentIndex].src + AudioName.MP3), AudioType.MP3);
            this.songIndex = newIndex;
            this.index = 0;
            this.text = { "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
        }
        catch (error) {
            Logger.error(`playPrevious error: ${error}`);
        }
    }
    // 下一曲
    private playNext(): void {
        try {
            const currentIndex = this.playerController.getCurrentIndex();
            const newIndex = this.playerController.nextSong(this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(songDataList[currentIndex].src + AudioName.MP3), AudioType.MP3);
            this.songIndex = newIndex;
            this.index = 0;
            this.text = { "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
        }
        catch (error) {
            Logger.error(`playNext error: ${error}`);
        }
    }
    // 获取播放模式图标
    private getPlayModeIcon(): Resource {
        switch (this.playMode) {
            case PlayMode.SINGLE_LOOP:
                return { "id": 16777240, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
            case PlayMode.LIST_LOOP:
                return { "id": 16777233, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
            case PlayMode.RANDOM:
                return { "id": 16777238, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
            default:
                return { "id": 16777240, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
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
    SpeedMenu(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Menu.create();
        }, Menu);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '0.5x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 0.5;
                this.playerController.setPlaybackSpeed(0.5);
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '0.75x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 0.75;
                this.playerController.setPlaybackSpeed(0.75);
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '1.0x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 1.0;
                this.playerController.setPlaybackSpeed(1.0);
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '1.25x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 1.25;
                this.playerController.setPlaybackSpeed(1.25);
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '1.5x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 1.5;
                this.playerController.setPlaybackSpeed(1.5);
            });
        }, MenuItem);
        MenuItem.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            MenuItem.create({ content: '2.0x' });
            MenuItem.onClick(() => {
                this.currentSpeed = 2.0;
                this.playerController.setPlaybackSpeed(2.0);
            });
        }, MenuItem);
        MenuItem.pop();
        Menu.pop();
    }
    // ==================== 新增功能方法 ====================
    /**
     * 频谱可视化组件
     */
    SpectrumVisualizer(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.margin({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const amplitude = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('2.5%');
                    Column.height(60);
                    Column.justifyContent(FlexAlign.End);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Rect.create();
                    Rect.width('100%');
                    Rect.height(`${amplitude * 60}vp`);
                    Rect.fill(AudioVisualizer.getColorByAudioType(this.lastAudioType, index, this.spectrumData.amplitude.length));
                    Rect.borderRadius(2);
                }, Rect);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.spectrumData.amplitude, forEachItemGenFunction, (amplitude: number, index: number) => `${index}-${amplitude}`, true, true);
        }, ForEach);
        ForEach.pop();
        Row.pop();
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
            }
            else {
                this.visualizer.setPlaying(false);
                this.spectrumData = this.visualizer.generateSpectrumData();
            }
        }, 50); // 20fps 更新频率
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
        }
        else {
            // 退出AB测试模式
            Logger.info('退出AB对比测试模式');
            this.stopABTestLoop();
        }
    }
    private abTestTimer: number;
    /**
     * 开始AB测试循环（每2秒切换一次）
     */
    private startABTestLoop(): void {
        let switchToMP3 = true;
        this.abTestTimer = setInterval(() => {
            const currentType = this.index;
            if (switchToMP3 && currentType !== 0) {
                // 切换到MP3
                this.text = { "id": 16777227, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
                this.index = 0;
                this.changeType(this.songData.src + AudioName.MP3, AudioType.MP3);
                this.lastAudioType = AudioType.MP3;
            }
            else if (!switchToMP3 && currentType !== 1) {
                // 切换到FLAC
                this.text = { "id": 16777222, "type": 10003, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" };
                this.index = 1;
                this.changeType(this.songData.src + AudioName.FLAC, AudioType.FLAC);
                this.lastAudioType = AudioType.FLAC;
            }
            switchToMP3 = !switchToMP3;
        }, 2000); // 每2秒切换一次
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
        this.audioInfo = AudioInfoParser.generateAudioInfo(this.lastAudioType, 5000, // 模拟文件大小 5MB
        180 // 模拟时长 3分钟
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
    AudioInfoDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.position({ x: '50%', y: '50%' });
            Column.translate({ x: '-50%', y: '-50%' });
            Column.width('85%');
            Column.padding(20);
            Column.backgroundColor('rgba(30, 30, 40, 0.95)');
            Column.borderRadius(16);
            Column.shadow({
                radius: 20,
                color: '#66000000',
                offsetX: 0,
                offsetY: 8
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音频参数详情');
            Text.fontSize(18);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor(Color.White);
            Image.rotate({ angle: 90 });
            Image.onClick(() => {
                this.showAudioInfo = false;
            });
        }, Image);
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 信息内容
            Column.create();
            // 信息内容
            Column.width('100%');
            // 信息内容
            Column.padding(16);
            // 信息内容
            Column.backgroundColor('rgba(0, 0, 0, 0.7)');
            // 信息内容
            Column.borderRadius(12);
        }, Column);
        // 格式名称
        this.InfoRow.bind(this)('格式', this.audioInfo!.format, '#00FFFF');
        // 采样率
        this.InfoRow.bind(this)('采样率', AudioInfoParser.formatSampleRate(this.audioInfo!.sampleRate));
        // 位深度
        this.InfoRow.bind(this)('位深度', `${this.audioInfo!.bitDepth} bit`);
        // 声道数
        this.InfoRow.bind(this)('声道数', `${this.audioInfo!.channels} (立体声)`);
        // 比特率
        this.InfoRow.bind(this)('比特率', `${this.audioInfo!.bitrate} kbps`);
        // 文件大小
        this.InfoRow.bind(this)('文件大小', AudioInfoParser.formatFileSize(this.audioInfo!.fileSize));
        // 时长
        this.InfoRow.bind(this)('时长', AudioInfoParser.formatDuration(this.audioInfo!.duration));
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.strokeWidth(1);
            Divider.color('#33FFFFFF');
            Divider.margin({ top: 8, bottom: 8 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 音质评分
            Row.create();
            // 音质评分
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('音质评分');
            Text.fontSize(14);
            Text.fontColor('#99FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.audioInfo!.qualityScore}/100`);
            Text.fontSize(24);
            Text.fontColor(this.getQualityColor(this.audioInfo!.qualityScore));
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 音质评分
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 格式描述
            Text.create(AudioInfoParser.getFormatDescription(this.audioInfo!.format));
            // 格式描述
            Text.fontSize(12);
            // 格式描述
            Text.fontColor('#66FFFFFF');
            // 格式描述
            Text.margin({ top: 8 });
            // 格式描述
            Text.lineHeight(18);
        }, Text);
        // 格式描述
        Text.pop();
        // 信息内容
        Column.pop();
        Column.pop();
    }
    /**
     * 信息行组件
     */
    InfoRow(label: string, value: string, highlightColor?: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 6, bottom: 6 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor('#99FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(14);
            Text.fontColor(highlightColor || Color.White);
            Text.fontWeight(highlightColor ? FontWeight.Bold : FontWeight.Normal);
        }, Text);
        Text.pop();
        Row.pop();
    }
    /**
     * 根据音质评分获取颜色
     */
    private getQualityColor(score: number): string {
        if (score >= 90)
            return '#00FF00'; // 绿色 - 优秀
        if (score >= 75)
            return '#00FFFF'; // 青色 - 良好
        if (score >= 60)
            return '#FFFF00'; // 黄色 - 一般
        return '#FF4444'; // 红色 - 较差
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
        }
        catch (error) {
            Logger.error(`流转异常: ${error}`);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function __Image__controlImageBuilder(): void {
    Image.aspectRatio(1);
    Image.opacity(0.86);
    Image.objectFit(ImageFit.Contain);
}
