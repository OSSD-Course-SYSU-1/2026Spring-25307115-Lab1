import AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import { Logger } from "@normalized:N&&&entry/src/main/ets/utils/Logger&";
import dataPreferences from "@ohos:data.preferences";
const DOMAIN = 0x0000;
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
        }
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
    }
    onDestroy(): void {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/Index', (err) => {
            if (err.code) {
                hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            windowStage.getMainWindow().then((window: window.Window) => {
                window.setWindowLayoutFullScreen(true).catch(() => {
                    Logger.error('setWindowLayoutFullScreen error!');
                });
                let systemBarProperties: window.SystemBarProperties = {
                    statusBarContentColor: '#ffffff',
                };
                window.setWindowSystemBarProperties(systemBarProperties).catch(() => {
                    Logger.error('setWindowSystemBarProperties fail ');
                }).then(() => {
                    Logger.info('setWindowSystemBarProperties success ');
                });
            }).catch(() => {
                Logger.error('getMainWindow error!');
            });
            hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    }
    /**
     * 流转发起回调 - 保存播放状态
     */
    async onContinue(want: Want): Promise<AbilityConstant.OnContinueResult> {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onContinue - 开始流转');
        try {
            // 获取全局播放器状态
            const context = this.context;
            const preferences = await dataPreferences.getPreferences(context, 'player_state');
            // 定义状态接口
            interface PlayerState {
                isPlaying: boolean;
                currentTime: number;
                currentSongIndex: number;
                audioType: number;
                playMode: number;
                playbackSpeed: number;
            }
            // 保存当前播放状态到 Want 参数中
            const currentState: PlayerState = {
                isPlaying: await preferences.get('isPlaying', false) as boolean,
                currentTime: await preferences.get('currentTime', 0) as number,
                currentSongIndex: await preferences.get('currentSongIndex', 0) as number,
                audioType: await preferences.get('audioType', 1) as number,
                playMode: await preferences.get('playMode', 0) as number,
                playbackSpeed: await preferences.get('playbackSpeed', 1.0) as number
            };
            // 将状态信息附加到 want 中
            want.parameters = {
                'continuationData': JSON.stringify(currentState)
            };
            hilog.info(DOMAIN, 'testTag', '流转状态已保存: %{public}s', JSON.stringify(currentState));
            return AbilityConstant.OnContinueResult.AGREE;
        }
        catch (error) {
            hilog.error(DOMAIN, 'testTag', '流转失败: %{public}s', JSON.stringify(error));
            return AbilityConstant.OnContinueResult.REJECT;
        }
    }
    /**
     * 接收流转后的回调 - 恢复播放状态
     */
    async onNewWant(want: Want): Promise<void> {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onNewWant - 接收流转');
        try {
            const continuationData = want.parameters?.['continuationData'] as string | undefined;
            if (continuationData) {
                interface PlayerState {
                    isPlaying: boolean;
                    currentTime: number;
                    currentSongIndex: number;
                    audioType: number;
                    playMode: number;
                    playbackSpeed: number;
                }
                const state = JSON.parse(continuationData) as PlayerState;
                hilog.info(DOMAIN, 'testTag', '接收到流转状态: %{public}s', continuationData);
                // 保存状态到 preferences，供页面读取
                const context = this.context;
                const preferences = await dataPreferences.getPreferences(context, 'player_state');
                await preferences.put('isPlaying', state.isPlaying);
                await preferences.put('currentTime', state.currentTime);
                await preferences.put('currentSongIndex', state.currentSongIndex);
                await preferences.put('audioType', state.audioType);
                await preferences.put('playMode', state.playMode);
                await preferences.put('playbackSpeed', state.playbackSpeed);
                await preferences.flush();
                hilog.info(DOMAIN, 'testTag', '播放状态已恢复');
            }
        }
        catch (error) {
            hilog.error(DOMAIN, 'testTag', '恢复流转状态失败: %{public}s', JSON.stringify(error));
        }
    }
}
