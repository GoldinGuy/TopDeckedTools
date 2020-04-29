import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ConfigData } from 'src/app/services/config';

function enablePushNotification(oneSignal: OneSignal) {
    localStorage.setItem('isPushNotificationEnabled', "true")
    if (oneSignal && ConfigData.oneSignal && ConfigData.oneSignal.appID && ConfigData.oneSignal.googleProjectId) {
        oneSignal.startInit(ConfigData.oneSignal.appID, ConfigData.oneSignal.googleProjectId);
        oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
        oneSignal.endInit()
    }
}

function disablePushNotification(oneSignal: OneSignal) {
    localStorage.setItem('isPushNotificationEnabled', "false")
    if (oneSignal) {
        oneSignal.startInit('', '');
        oneSignal.inFocusDisplaying(oneSignal.OSInFocusDisplayOption.InAppAlert);
        oneSignal.endInit()
    }
}

function initOneSignal(oneSignal: OneSignal) {
    let pushNotificationEnabledStorageValue = localStorage.getItem('isPushNotificationEnabled');
    if (!pushNotificationEnabledStorageValue) {
        localStorage.setItem('isPushNotificationEnabled', "true");
        pushNotificationEnabledStorageValue = "true";
    }
    
    if (pushNotificationEnabledStorageValue == "true") {
        enablePushNotification(oneSignal);
    } else {
        disablePushNotification(oneSignal);
    }
}

export const OneSignalConfig = {
    'enablePushNotification' : enablePushNotification,
    'disablePushNotification' : disablePushNotification,
    'initOneSignal': initOneSignal
}
  