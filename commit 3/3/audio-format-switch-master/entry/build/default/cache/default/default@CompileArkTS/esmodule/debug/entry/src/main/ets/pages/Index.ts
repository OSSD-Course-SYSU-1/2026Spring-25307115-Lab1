if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    songDataList?: SongData[];
    imageColor?: string;
    imageLabel?: PixelMap | Resource;
    currentSongIndex?: number;
    isShowPlayList?: boolean;
    isShowPlayListProvider?: boolean;
    isWearable?: boolean;
    playerController?: PlayerController;
}
import type { BusinessError } from "@ohos:base";
import effectKit from "@ohos:effectKit";
import image from "@ohos:multimedia.image";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import type { SongData } from '../model/SongData';
import { ControlAreaComponent } from "@normalized:N&&&entry/src/main/ets/components/ControlAreaComponent&";
import { PlayListComponent } from "@normalized:N&&&entry/src/main/ets/components/PlayListComponent&";
import { songDataList, AudioName, AudioType, DeviceUtil } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { ColorTools } from "@normalized:N&&&entry/src/main/ets/utils/ColorTools&";
import { PlayerController } from "@normalized:N&&&entry/src/main/ets/player/PlayerController&";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.songDataList = songDataList;
        this.__imageColor = new ObservedPropertySimplePU('rgba(0, 0, 2, 1.00)', this, "imageColor");
        this.__imageLabel = new ObservedPropertyObjectPU(this.songDataList[0].label, this, "imageLabel");
        this.__currentSongIndex = new ObservedPropertySimplePU(0, this, "currentSongIndex");
        this.__isShowPlayList = new ObservedPropertySimplePU(false, this, "isShowPlayList");
        this.__isShowPlayListProvider = new ObservedPropertySimplePU(false, this, "isShowPlayListProvider");
        this.addProvidedVar("isShowPlayListProvider", this.__isShowPlayListProvider, false);
        this.__isWearable = new ObservedPropertySimplePU(false, this, "isWearable");
        this.playerController = new PlayerController();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.songDataList !== undefined) {
            this.songDataList = params.songDataList;
        }
        if (params.imageColor !== undefined) {
            this.imageColor = params.imageColor;
        }
        if (params.imageLabel !== undefined) {
            this.imageLabel = params.imageLabel;
        }
        if (params.currentSongIndex !== undefined) {
            this.currentSongIndex = params.currentSongIndex;
        }
        if (params.isShowPlayList !== undefined) {
            this.isShowPlayList = params.isShowPlayList;
        }
        if (params.isShowPlayListProvider !== undefined) {
            this.isShowPlayListProvider = params.isShowPlayListProvider;
        }
        if (params.isWearable !== undefined) {
            this.isWearable = params.isWearable;
        }
        if (params.playerController !== undefined) {
            this.playerController = params.playerController;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__imageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__imageLabel.purgeDependencyOnElmtId(rmElmtId);
        this.__currentSongIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPlayList.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPlayListProvider.purgeDependencyOnElmtId(rmElmtId);
        this.__isWearable.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__imageColor.aboutToBeDeleted();
        this.__imageLabel.aboutToBeDeleted();
        this.__currentSongIndex.aboutToBeDeleted();
        this.__isShowPlayList.aboutToBeDeleted();
        this.__isShowPlayListProvider.aboutToBeDeleted();
        this.__isWearable.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private songDataList: SongData[];
    private __imageColor: ObservedPropertySimplePU<string>;
    get imageColor() {
        return this.__imageColor.get();
    }
    set imageColor(newValue: string) {
        this.__imageColor.set(newValue);
    }
    private __imageLabel: ObservedPropertyObjectPU<PixelMap | Resource>;
    get imageLabel() {
        return this.__imageLabel.get();
    }
    set imageLabel(newValue: PixelMap | Resource) {
        this.__imageLabel.set(newValue);
    }
    private __currentSongIndex: ObservedPropertySimplePU<number>;
    get currentSongIndex() {
        return this.__currentSongIndex.get();
    }
    set currentSongIndex(newValue: number) {
        this.__currentSongIndex.set(newValue);
    }
    private __isShowPlayList: ObservedPropertySimplePU<boolean>;
    get isShowPlayList() {
        return this.__isShowPlayList.get();
    }
    set isShowPlayList(newValue: boolean) {
        this.__isShowPlayList.set(newValue);
    }
    private __isShowPlayListProvider: ObservedPropertySimplePU<boolean>;
    get isShowPlayListProvider() {
        return this.__isShowPlayListProvider.get();
    }
    set isShowPlayListProvider(newValue: boolean) {
        this.__isShowPlayListProvider.set(newValue);
    }
    private __isWearable: ObservedPropertySimplePU<boolean>;
    get isWearable() {
        return this.__isWearable.get();
    }
    set isWearable(newValue: boolean) {
        this.__isWearable.set(newValue);
    }
    private playerController: PlayerController;
    aboutToAppear(): void {
        this.isWearable = DeviceUtil.isWearable();
        // 手表端跳过effectKit调用，避免不兼容崩溃
        if (!this.isWearable) {
            this.getImageColor();
        }
        this.restoreContinuationState();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.height('100%');
            Stack.width('100%');
            Stack.backgroundColor(this.imageColor);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.imageLabel);
            Image.size({ height: '120%' });
            Image.aspectRatio(1);
            Image.objectFit(ImageFit.Cover);
            Image.opacity(0.5);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.height('100%');
            Column.width('100%');
            Column.padding(this.isWearable ? {
                top: 12,
                left: 12,
                right: 12,
                bottom: 12
            } : {
                top: 64,
                left: 24,
                right: 24,
                bottom: 24
            });
            globalThis.Gesture.create(GesturePriority.Low);
            GestureGroup.create(GestureMode.Parallel);
            // 左滑下一曲
            PanGesture.create({ direction: PanDirection.Left, distance: 80 });
            // 左滑下一曲
            PanGesture.onActionEnd(() => {
                this.playNext();
            });
            // 左滑下一曲
            PanGesture.pop();
            // 右滑上一曲
            PanGesture.create({ direction: PanDirection.Right, distance: 80 });
            // 右滑上一曲
            PanGesture.onActionEnd(() => {
                this.playPrevious();
            });
            // 右滑上一曲
            PanGesture.pop();
            GestureGroup.pop();
            globalThis.Gesture.pop();
        }, Column);
        this.CoverInfo.bind(this)();
        this.MusicInfo.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ControlAreaComponent(this, {
                        songData: this.songDataList[this.currentSongIndex],
                        imageColor: this.imageColor,
                        isWearable: this.isWearable
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 60, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            songData: this.songDataList[this.currentSongIndex],
                            imageColor: this.imageColor,
                            isWearable: this.isWearable
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        songData: this.songDataList[this.currentSongIndex],
                        imageColor: this.imageColor,
                        isWearable: this.isWearable
                    });
                }
            }, { name: "ControlAreaComponent" });
        }
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 播放列表弹窗
            if (this.isShowPlayList) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        globalThis.Context.animation({
                            duration: 300
                        });
                        __Common__.position({ x: 0, y: '100%' });
                        __Common__.translate({ y: this.isShowPlayList ? '-100%' : '0%' });
                        globalThis.Context.animation(null);
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new PlayListComponent(this, {
                                    songList: this.songDataList,
                                    currentIndex: this.currentSongIndex,
                                    playMode: this.playerController.getPlayMode(),
                                    imageColor: this.imageColor,
                                    onSongSelect: (index: number) => {
                                        this.switchSong(index);
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 96, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        songList: this.songDataList,
                                        currentIndex: this.currentSongIndex,
                                        playMode: this.playerController.getPlayMode(),
                                        imageColor: this.imageColor,
                                        onSongSelect: (index: number) => {
                                            this.switchSong(index);
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    songList: this.songDataList,
                                    currentIndex: this.currentSongIndex,
                                    playMode: this.playerController.getPlayMode(),
                                    imageColor: this.imageColor
                                });
                            }
                        }, { name: "PlayListComponent" });
                    }
                    __Common__.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    CoverInfo(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.height(this.isWearable ? '30%' : '40%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.songDataList[this.currentSongIndex].label);
            Image.height('100%');
            Image.aspectRatio(1);
            Image.borderRadius(this.isWearable ? 4 : 8);
            Image.shadow(this.isWearable ? {
                radius: 6,
                color: '#66000000',
                offsetX: 0,
                offsetY: 4
            } : {
                radius: 12,
                color: '#66000000',
                offsetX: 0,
                offsetY: 8
            });
            Image.margin(3);
        }, Image);
        Row.pop();
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
            const newIndex = this.playerController.previousSong(this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(this.songDataList[currentIndex].src + AudioName.MP3), AudioType.MP3);
            this.switchSong(newIndex);
        }
        catch (error) {
            Logger.error(`playPrevious error: ${error}`);
        }
    }
    // 下一曲
    private playNext(): void {
        try {
            const currentIndex = this.playerController.getCurrentIndex();
            const newIndex = this.playerController.nextSong(this.getUIContext().getHostContext()!.resourceManager.getRawFdSync(this.songDataList[currentIndex].src + AudioName.MP3), AudioType.MP3);
            this.switchSong(newIndex);
        }
        catch (error) {
            Logger.error(`playNext error: ${error}`);
        }
    }
    MusicInfo(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ top: this.isWearable ? 8 : 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ justifyContent: FlexAlign.SpaceBetween, alignItems: ItemAlign.Center });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.songDataList[this.currentSongIndex].title);
            Text.fontSize(this.isWearable ? 14 : 20);
            Text.fontColor(Color.White);
            Text.opacity(0.86);
            Text.fontWeight(FontWeight.Bold);
            Text.fontFamily(this.isWearable ? '' : 'HarmonyHeiTi-Bold');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.songDataList[this.currentSongIndex].singer);
            Text.textAlign(TextAlign.Start);
            Text.fontSize(this.isWearable ? 11 : 14);
            Text.fontColor('#99FFFFFF');
            Text.fontFamily(this.isWearable ? '' : 'HarmonyHeiTi');
            Text.width('100%');
            Text.fontWeight(FontWeight.Regular);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Column.pop();
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
                        }
                        else {
                            currentPixelMap = pixelMap;
                            let color: effectKit.Color = colorPicker.getLargestProportionColor();
                            let colorArr: number[] = ColorTools.dealColor(color.red, color.green, color.blue);
                            this.imageColor = `rgba(${colorArr[0]}, ${colorArr[1]}, ${colorArr[2]}, 1)`;
                        }
                    });
                    let headFilter = effectKit.createEffect(pixelMap);
                    if (headFilter !== null) {
                        headFilter.blur(15);
                        headFilter.getEffectPixelMap().then((value) => {
                            this.imageLabel = value;
                        });
                    }
                })
                    .finally(() => {
                    imageSource?.release();
                    currentPixelMap?.release();
                })
                    .catch((error: BusinessError) => {
                    Logger.error(`createPixelMap error: ${error.code}, message: ${error.message}`);
                });
            })
                .catch((error: BusinessError) => {
                Logger.error(`getMediaContent error: ${error.code}, message: ${error.message}`);
            });
        }
        catch (error) {
            Logger.error(`getImageColor error: ${error}`);
        }
    }
    /**
     * 恢复流转状态
     */
    private async restoreContinuationState(): Promise<void> {
        try {
            const context = this.getUIContext().getHostContext();
            if (!context)
                return;
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
        }
        catch (error) {
            Logger.error(`恢复流转状态失败: ${error}`);
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.sample.AudioFormatSwitch", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
