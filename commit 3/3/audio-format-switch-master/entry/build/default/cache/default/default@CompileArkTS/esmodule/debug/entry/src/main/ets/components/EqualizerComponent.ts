if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EqualizerComponent_Params {
    imageColor?: string;
    eqBands?: EqBand[];
    isEnabled?: boolean;
    currentPreset?: EqPresetName;
    showPanel?: boolean;
    eqController?: EqualizerController;
    onEqChange?: (enabled: boolean, preset: EqPresetName, bands: EqBand[]) => void;
}
import { EqualizerController } from "@normalized:N&&&entry/src/main/ets/utils/EqualizerController&";
import type { EqBand, EqPresetName } from "@normalized:N&&&entry/src/main/ets/utils/EqualizerController&";
export class EqualizerComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__imageColor = new SynchedPropertySimpleOneWayPU(params.imageColor, this, "imageColor");
        this.__eqBands = new ObservedPropertyObjectPU([], this, "eqBands");
        this.__isEnabled = new ObservedPropertySimplePU(false, this, "isEnabled");
        this.__currentPreset = new ObservedPropertySimplePU('FLAT', this, "currentPreset");
        this.__showPanel = new ObservedPropertySimplePU(false, this, "showPanel");
        this.eqController = new EqualizerController();
        this.onEqChange = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EqualizerComponent_Params) {
        if (params.imageColor === undefined) {
            this.__imageColor.set('rgba(0, 0, 2, 1.00)');
        }
        if (params.eqBands !== undefined) {
            this.eqBands = params.eqBands;
        }
        if (params.isEnabled !== undefined) {
            this.isEnabled = params.isEnabled;
        }
        if (params.currentPreset !== undefined) {
            this.currentPreset = params.currentPreset;
        }
        if (params.showPanel !== undefined) {
            this.showPanel = params.showPanel;
        }
        if (params.eqController !== undefined) {
            this.eqController = params.eqController;
        }
        if (params.onEqChange !== undefined) {
            this.onEqChange = params.onEqChange;
        }
    }
    updateStateVars(params: EqualizerComponent_Params) {
        this.__imageColor.reset(params.imageColor);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__imageColor.purgeDependencyOnElmtId(rmElmtId);
        this.__eqBands.purgeDependencyOnElmtId(rmElmtId);
        this.__isEnabled.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPreset.purgeDependencyOnElmtId(rmElmtId);
        this.__showPanel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__imageColor.aboutToBeDeleted();
        this.__eqBands.aboutToBeDeleted();
        this.__isEnabled.aboutToBeDeleted();
        this.__currentPreset.aboutToBeDeleted();
        this.__showPanel.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __imageColor: SynchedPropertySimpleOneWayPU<string>;
    get imageColor() {
        return this.__imageColor.get();
    }
    set imageColor(newValue: string) {
        this.__imageColor.set(newValue);
    }
    private __eqBands: ObservedPropertyObjectPU<EqBand[]>;
    get eqBands() {
        return this.__eqBands.get();
    }
    set eqBands(newValue: EqBand[]) {
        this.__eqBands.set(newValue);
    }
    private __isEnabled: ObservedPropertySimplePU<boolean>;
    get isEnabled() {
        return this.__isEnabled.get();
    }
    set isEnabled(newValue: boolean) {
        this.__isEnabled.set(newValue);
    }
    private __currentPreset: ObservedPropertySimplePU<EqPresetName>;
    get currentPreset() {
        return this.__currentPreset.get();
    }
    set currentPreset(newValue: EqPresetName) {
        this.__currentPreset.set(newValue);
    }
    private __showPanel: ObservedPropertySimplePU<boolean>;
    get showPanel() {
        return this.__showPanel.get();
    }
    set showPanel(newValue: boolean) {
        this.__showPanel.set(newValue);
    }
    private eqController: EqualizerController;
    private onEqChange?: (enabled: boolean, preset: EqPresetName, bands: EqBand[]) => void;
    aboutToAppear(): void {
        this.eqBands = this.eqController.getBands();
        this.isEnabled = this.eqController.getEnabled();
        this.currentPreset = this.eqController.getPreset();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.borderRadius(16);
            Column.margin({ top: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题行：均衡器 + 开关
            Row.create();
            // 标题行：均衡器 + 开关
            Row.width('100%');
            // 标题行：均衡器 + 开关
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777238, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.fillColor(this.isEnabled ? '#00FFFF' : '#99FFFFFF');
            Image.margin({ right: 6 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('均衡器');
            Text.fontSize(14);
            Text.fontColor(this.isEnabled ? '#00FFFF' : '#99FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 开关
            Toggle.create({ type: ToggleType.Switch, isOn: this.isEnabled });
            // 开关
            Toggle.selectedColor('#00FFFF');
            // 开关
            Toggle.switchPointColor(Color.White);
            // 开关
            Toggle.width(40);
            // 开关
            Toggle.height(20);
            // 开关
            Toggle.onChange((isOn: boolean) => {
                this.isEnabled = isOn;
                this.eqController.setEnabled(isOn);
                this.notifyChange();
            });
        }, Toggle);
        // 开关
        Toggle.pop();
        // 标题行：均衡器 + 开关
        Row.pop();
        // 预设按钮网格 (2行 x 4列) - 始终可见
        this.PresetGrid.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 展开/收起滑块区域
            Row.create();
            // 展开/收起滑块区域
            Row.width('100%');
            // 展开/收起滑块区域
            Row.padding({ top: 8, bottom: 4 });
            // 展开/收起滑块区域
            Row.onClick(() => {
                this.showPanel = !this.showPanel;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showPanel ? '收起调节器' : '频段精细调节');
            Text.fontSize(12);
            Text.fontColor('#99FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.sample.AudioFormatSwitch", "moduleName": "entry" });
            Image.width(12);
            Image.height(12);
            Image.fillColor('#99FFFFFF');
            Image.rotate({ angle: this.showPanel ? 180 : 90 });
            Image.margin({ left: 4 });
        }, Image);
        // 展开/收起滑块区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 10段滑块（可展开）
            if (this.showPanel) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.BandSliders.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 预设按钮网格 - 2行4列布局
     */
    PresetGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween });
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('23%');
                    Column.height(56);
                    Column.justifyContent(FlexAlign.Center);
                    Column.alignItems(HorizontalAlign.Center);
                    Column.backgroundColor(this.currentPreset === this.getPresetName(item) ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)');
                    Column.borderRadius(10);
                    Column.border({
                        width: this.currentPreset === this.getPresetName(item) ? 1 : 0,
                        color: '#00FFFF'
                    });
                    Column.margin({ bottom: 6 });
                    Column.onClick(() => {
                        const preset = this.getPresetName(item);
                        this.currentPreset = preset;
                        this.eqController.applyPreset(preset);
                        this.isEnabled = this.eqController.getEnabled();
                        this.eqBands = this.eqController.getBands();
                        this.notifyChange();
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getPresetIcon(item));
                    Text.fontSize(18);
                    Text.margin({ bottom: 2 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getPresetLabel(item));
                    Text.fontSize(10);
                    Text.fontColor(this.currentPreset === this.getPresetName(item) ? '#00FFFF' : '#CCFFFFFF');
                    Text.fontWeight(this.currentPreset === this.getPresetName(item) ? FontWeight.Bold : FontWeight.Normal);
                    Text.maxLines(1);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getPresetList(), forEachItemGenFunction, (item: number) => `${item}`, false, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
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
    BandSliders(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 8, right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const band = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.layoutWeight(1);
                    Column.alignItems(HorizontalAlign.Center);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 增益值显示
                    Text.create(`${band.gain > 0 ? '+' : ''}${band.gain.toFixed(0)}`);
                    // 增益值显示
                    Text.fontSize(9);
                    // 增益值显示
                    Text.fontColor(band.gain > 0 ? '#00FF00' : band.gain < 0 ? '#FF4444' : '#99FFFFFF');
                    // 增益值显示
                    Text.margin({ bottom: 4 });
                }, Text);
                // 增益值显示
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 竖向滑块（通过旋转实现）
                    Slider.create({
                        min: -12,
                        max: 12,
                        step: 1,
                        value: band.gain,
                        style: SliderStyle.OutSet
                    });
                    // 竖向滑块（通过旋转实现）
                    Slider.selectedColor('#00FFFF');
                    // 竖向滑块（通过旋转实现）
                    Slider.trackColor('#33FFFFFF');
                    // 竖向滑块（通过旋转实现）
                    Slider.blockColor(Color.White);
                    // 竖向滑块（通过旋转实现）
                    Slider.width(120);
                    // 竖向滑块（通过旋转实现）
                    Slider.height(40);
                    // 竖向滑块（通过旋转实现）
                    Slider.rotate({ angle: -90 });
                    // 竖向滑块（通过旋转实现）
                    Slider.onChange((value: number) => {
                        this.eqController.setBandGain(index, value);
                        this.eqBands = this.eqController.getBands();
                        this.currentPreset = this.eqController.getPreset();
                        this.notifyChange();
                    });
                }, Slider);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // 频率标签
                    Text.create(band.label);
                    // 频率标签
                    Text.fontSize(9);
                    // 频率标签
                    Text.fontColor('#99FFFFFF');
                    // 频率标签
                    Text.margin({ top: 4 });
                }, Text);
                // 频率标签
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    // Hz单位
                    Text.create(index === 0 || index === 5 || index === 9 ? 'Hz' : '');
                    // Hz单位
                    Text.fontSize(7);
                    // Hz单位
                    Text.fontColor('#66FFFFFF');
                }, Text);
                // Hz单位
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.eqBands, forEachItemGenFunction, (band: EqBand, index: number) => `${index}-${band.gain}`, true, true);
        }, ForEach);
        ForEach.pop();
        Row.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
