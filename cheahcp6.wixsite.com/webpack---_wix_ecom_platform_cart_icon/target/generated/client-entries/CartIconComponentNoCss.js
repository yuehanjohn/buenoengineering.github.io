import React from 'react';
import {
    getWidgetWrapper
} from '@wix/yoshi-flow-editor/runtime/esm/WidgetWrapper.js';
import Widget from '/home/builduser/work/8d7c71a662c95c87/packages/ecom-platform-cart-icon/src/components/CartIcon/Widget/index.tsx';

import {
    withLeanStyles
} from '@wix/native-components-infra';



import {
    initI18nWithoutICU as initI18n
} from '@wix/yoshi-flow-editor/runtime/esm/i18next/init';



const multilingualDisabled = false;


import {
    createExperiments,
    createWidgetExperiments
} from '@wix/yoshi-flow-editor/runtime/esm/experiments';



import {
    I18nextProvider
} from '@wix/yoshi-flow-editor/i18n';


import {
    PureExperimentsProvider
} from '@wix/yoshi-flow-editor';
var ExperimentsProvider = React.Fragment;


import {
    BILoggerProvider
} from '@wix/yoshi-flow-editor/runtime/esm/react/BILogger/BILoggerProvider';

import {
    PanoramaProvider
} from '@wix/yoshi-flow-editor/runtime/esm/react/PanoramaProvider';

import {
    FedopsLoggerProvider
} from '@wix/yoshi-flow-editor/runtime/esm/react/FedopsLoggerProvider';

import {
    HttpProvider
} from '@wix/yoshi-flow-editor';

import {
    TPAComponentsProvider
} from 'wix-ui-tpa';

import {
    BaseUiEnvironmentProviderWrapper
} from '@wix/yoshi-flow-editor/runtime/esm/react/BaseUiEnvironmentProviderWrapper';

var providers = {
    I18nextProvider,
    ExperimentsProvider,
    PureExperimentsProvider,
    BILoggerProvider,
    FedopsLoggerProvider,
    PanoramaProvider,
    HttpProvider,
    TPAComponentsProvider,
    BaseUiEnvironmentProviderWrapper,
}




import * as usersStyleParamsEntry from '/home/builduser/work/8d7c71a662c95c87/packages/ecom-platform-cart-icon/src/components/CartIcon/stylesParams.ts';
var stylesParamsEntry = usersStyleParamsEntry;
var stylesParams = stylesParamsEntry.default;
var customCssVars = stylesParamsEntry.customCssVars || function() {
    return {}
};



var styleHocConfig = {
    "enabled": true
};

var sentryConfig = {
    DSN: 'https://e27a8d4ddc0b4cddbb88c8eafad23b21@sentry.wixpress.com/4950',
    id: 'e27a8d4ddc0b4cddbb88c8eafad23b21',
    projectName: 'ecom-platform-cart-icon',
    teamName: 'wixstores',
    errorMonitor: true,
};

var translationsConfig = {
    "icuEnabled": false,
    "defaultTranslationsPath": "/home/builduser/work/8d7c71a662c95c87/packages/ecom-platform-cart-icon/src/assets/locales/messages_en.json",
    "availableLanguages": ["ar", "bg", "ca", "cs", "da", "de", "el", "en", "es", "fi", "fr", "he", "hi", "hr", "hu", "id", "it", "ja", "ko", "lt", "lv", "ms", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "th", "tl", "tr", "uk", "vi", "zh"]
};

var UserComponent = getWidgetWrapper({
    initI18n,
    withStylesHoc: withLeanStyles,
    createExperiments,
    createWidgetExperiments,
    providers,
}, Widget, {
    multilingualDisabled,
    sentryConfig,
    styleHocConfig,
    translationsConfig,
    stylesParams,
    customCssVars,
    componentId: '1380bbc4-1485-9d44-4616-92e36b1ead6b',
    name: 'CartIcon',
    withErrorBoundary: false,
    localeDistPath: 'assets/locales',
});


import {
    hot
} from '@wix/component-hot-loader';
UserComponent = hot(module, UserComponent);


const loadChunks = Widget.loadChunks;

export default {

    component: UserComponent,
    loadChunks
};