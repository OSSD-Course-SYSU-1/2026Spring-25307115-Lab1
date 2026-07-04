if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PlayListComponent_Params {
    songList?: SongData[];
    currentIndex?: number;
    playMode?: PlayMode;
    imageColor?: string;
    isShowPlayList?: boolean;
    isWearable?: boolean;
    // 回调函数
    onSongSelect?: (index: number) => void;
    onClose?: () => void;
}
import type { SongData } from '../model/SongData';
import { PlayMode, DeviceUtil } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class PlayListComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__songList = new SynchedPropertyObjectOneWayPU(params.songList, this, "songList");
        this.__currentIndex = new SynchedPropertySimpleOneWayPU(params.currentIndex, this, "currentIndex");
        this.__playMode = new SynchedPropertySimpleOneWayPU(params.playMode, this, "playMode");
        this.__imageColor = new SynchedPropertySimpleOneWayPU(params.imageColor, this, "imageColor");
        this.__isShowPlayList = this.initializeConsume("isShowPlayList", "isShowPlayList");
        this.__isWearable = new ObservedPropertySimplePU(false, this, "isWearable");
        this.onSongSelect = undefined;
        this.onClose = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PlayListComponent_Params) {
        if (params.songList === undefined) {
            this.__songList.set([]);
        }
        if (params.currentIndex === undefined) {
            this.__currentIndex.set(0);
        }
        if (params.playMode === undefined) {
            this.__playMode.set(PlayMode.SINGLE_LOOP);
        }
        if (params.imageColor === undefined) {
            this.__imageColor.set('rgba(0, 0, 2, 1.00)');
        }
        if (params.isWearable !== undefined) {
            this.isWearable = params.isWearable;
        }
        if (params.onSongSelect !== undefined) {
            this.onSongSelect = params.onSongSelect;
        }
        if (params.onClose !== undefined) {
            this.onClose = params.onClose;
        }
    }
    updateStateVars(params: PlayListComponent_Params) {
        this.__songList.reset(params.songList);
        this.__currentIndex.reset(params.currentIndex);
        this.__playMode.reset(params.playMode);
        this.__imageColor.reset(params.imageColor);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__songList.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__playMode.purgeDependencyOnElmtId(rmElmtId);
        this.__imageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__isShowPlayList.purgeDependencyOnElmtId(rmElmtId);
        this.__isWearable.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__songList.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__playMode.aboutToBeDeleted();
        this.__imageColor.aboutToBeDeleted();
        this.__isShowPlayList.aboutToBeDeleted();
        this.__isWearable.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __songList: SynchedPropertySimpleOneWayPU<SongData[]>;
    get songList() {
        return this.__songList.get();
    }
    set songList(newValue: SongData[]) {
        this.__songList.set(newValue);
    }
    private __currentIndex: SynchedPropertySimpleOneWayPU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __playMode: SynchedPropertySimpleOneWayPU<PlayMode>;
    get playMode() {
        return this.__playMode.get();
    }
    set playMode(newValue: PlayMode) {
        this.__playMode.set(newValue);
    }
    private __imageColor: SynchedPropertySimpleOneWayPU<string>;
    get imageColor() {
        return this.__imageColor.get();
    }
    set imageColor(newValue: string) {
        this.__imageColor.set(newValue);
    }
    private __isShowPlayList: ObservedPropertyAbstractPU<boolean>;
    get isShowPlayList() {
        return this.__isShowPlayList.get();
    }
    set isShowPlayList(newValue: boolean) {
        this.__isShowPlayList.set(newValue);
    }
    private __isWearable: ObservedPropertySimplePU<boolean>;
    get isWearable() {
        return this.__isWearable.get();
    }
    set isWearable(newValue: boolean) {
        this.__isWearable.set(newValue);
    }
    // 回调函数
    private onSongSelect?: (index: number) => void;
    private onClose?: () => void;
    aboutToAppear(): void {
        this.isWearable = DeviceUtil.isWearable();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.imageColor);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.padding(this.isWearable ?
                { left: 16, right: 16, top: 12, bottom: 12 } :
                { left: 24, right: 24, top: 16, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('播放列表');
            Text.fontSize(this.isWearable ? 16 : 20);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 播放模式切换按钮
            Image.create(this.getPlayModeIcon());
            // 播放模式切换按钮
            Image.width(this.isWearable ? 20 : 24);
            // 播放模式切换按钮
            Image.height(this.isWearable ? 20 : 24);
            // 播放模式切换按钮
            Image.fillColor(Color.White);
            // 播放模式切换按钮
            Image.onClick(() => {
                this.togglePlayMode();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            Image.width(this.isWearable ? 20 : 24);
            Image.height(this.isWearable ? 20 : 24);
            Image.fillColor(Color.White);
            Image.rotate({ angle: 180 });
            Image.margin({ left: 16 });
            Image.onClick(() => {
                this.isShowPlayList = false;
            });
        }, Image);
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#33FFFFFF');
            Divider.strokeWidth(1);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 歌曲列表
            List.create({ space: 8 });
            // 歌曲列表
            List.width('100%');
            // 歌曲列表
            List.layoutWeight(1);
            // 歌曲列表
            List.scrollBar(BarState.Off);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const song = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.width('100%');
                            Row.padding(this.isWearable ?
                                { left: 16, right: 16, top: 8, bottom: 8 } :
                                { left: 24, right: 24, top: 12, bottom: 12 });
                            Row.backgroundColor(this.currentIndex === index ? 'rgba(0, 255, 255, 0.1)' : 'transparent');
                            Row.borderRadius(8);
                            Row.onClick(() => {
                                if (this.onSongSelect) {
                                    this.onSongSelect(index);
                                }
                                this.isShowPlayList = false;
                            });
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // 序号或播放图标
                            if (this.currentIndex === index) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create({ "id": 16777240, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
                                        Image.width(20);
                                        Image.height(20);
                                        Image.fillColor('#00FFFF');
                                    }, Image);
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${index + 1}`);
                                        Text.fontSize(14);
                                        Text.fontColor('#99FFFFFF');
                                        Text.width(20);
                                        Text.textAlign(TextAlign.Center);
                                    }, Text);
                                    Text.pop();
                                });
                            }
                        }, If);
                        If.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 歌曲信息
                            Column.create();
                            // 歌曲信息
                            Column.alignItems(HorizontalAlign.Start);
                            // 歌曲信息
                            Column.margin({ left: this.isWearable ? 8 : 12 });
                            // 歌曲信息
                            Column.layoutWeight(1);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(song.title);
                            Text.fontSize(this.isWearable ? 13 : 16);
                            Text.fontColor(this.currentIndex === index ? '#00FFFF' : Color.White);
                            Text.fontWeight(this.currentIndex === index ? FontWeight.Bold : FontWeight.Regular);
                            Text.maxLines(1);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(song.singer);
                            Text.fontSize(this.isWearable ? 10 : 12);
                            Text.fontColor('#66FFFFFF');
                            Text.margin({ top: this.isWearable ? 2 : 4 });
                            Text.maxLines(1);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        Text.pop();
                        // 歌曲信息
                        Column.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // VIP标识
                            if (song.mark && !this.isWearable) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Image.create(song.mark);
                                        Image.width(32);
                                        Image.height(16);
                                        Image.objectFit(ImageFit.Contain);
                                    }, Image);
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                });
                            }
                        }, If);
                        If.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.songList, forEachItemGenFunction, (song: SongData) => song.id.toString(), true, false);
        }, ForEach);
        ForEach.pop();
        // 歌曲列表
        List.pop();
        Column.pop();
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
        // 播放模式切换逻辑由父组件处理
    }
    rerender() {
        this.updateDirtyElements();
    }
}
