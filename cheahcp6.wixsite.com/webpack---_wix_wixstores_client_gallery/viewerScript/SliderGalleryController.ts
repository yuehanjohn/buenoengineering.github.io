/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {BaseController} from '@wix/wixstores-client-storefront-sdk/dist/es/src/viewer-script/controller-factory/BaseController';
import {ControllerParams} from '@wix/yoshi-flow-editor';
import type {VeloInputs} from '../types/galleryTypes';
import {IGalleryControllerConfig} from '../types/galleryTypes';
import {appClient, Scope} from '@wix/app-settings-client';
import {APP_SETTINGS_CDN} from '@wix/wixstores-client-core/dist/es/src/constants';
import {createSlotVeloAPIFactory} from '@wix/widget-plugins-ooi/velo';
import {SliderGalleryStore} from './SliderGalleryStore';
import _ from 'lodash';
import {PubSubEvents} from '@wix/wixstores-client-core';
import {Experiments, GALLERY_TYPE} from '../constants';

export class SliderGalleryController extends BaseController {
  private readonly compId: string;
  private sliderGalleryStore: SliderGalleryStore;
  private veloInputs: VeloInputs;
  private readonly waitUntilReady: Promise<void>;
  private initializeCallback: Function;
  private onReadyResolver;
  private readonly slotAPIFactory: ReturnType<typeof createSlotVeloAPIFactory>;
  private config: IGalleryControllerConfig;

  private readonly type: string;

  private async initializeVeloDataAfterStoreCreated() {
    await this.waitUntilReady;
    this.sliderGalleryStore.setVeloInputs(this.veloInputs);
    return this.sliderGalleryStore.setInitialState();
  }

  public setVeloInputs = (veloInputs: VeloInputs) => {
    this.veloInputs = {
      ...this.veloInputs,
      ...veloInputs,
    };
  };

  public exports = () => {
    return {
      setCollection: async (collectionId: string): Promise<void> => {
        this.setVeloInputs({collectionId, productIds: undefined});
        if (this.sliderGalleryStore) {
          return this.initializeVeloDataAfterStoreCreated();
        }
      },
      setProducts: async (productIds: string[]) => {
        this.setVeloInputs({productIds, collectionId: undefined});
        if (this.sliderGalleryStore) {
          return this.initializeVeloDataAfterStoreCreated();
        }
      },
      onInitialize: (cb: Function) => {
        this.initializeCallback = cb;
      },
    };
  };

  public onConfigUpdate = (config: IGalleryControllerConfig) => {
    this.config = _.clone(config);
    return this.siteStore.experiments.enabled(Experiments.FixSliderGalleryTextSettingToChangeOnEditor)
      ? this.sliderGalleryStore.updateState(this.config)
      : this.sliderGalleryStore.updateState(this.config, {APP: {}, COMPONENT: {}});
  };

  /* istanbul ignore next: for PR only, will be tested before merge */
  public onAppSettingsUpdate = (updates: {[key: string]: any}) => {
    if (this.siteStore.experiments.enabled(Experiments.FixSliderGalleryTextSettingToChangeOnEditor)) {
      if (this.siteStore.experiments.enabled(Experiments.EditorGalleryOOI) && updates.type === 'free_text') {
        void this.sliderGalleryStore.updateState(this.config, {
          APP: undefined,
          COMPONENT: updates.details,
        });
      } else if (
        this.siteStore.experiments.enabled(Experiments.EditorGalleryOOI) &&
        updates.scope === Scope.COMPONENT &&
        updates.source === 'app-settings'
      ) {
        void this.sliderGalleryStore.updateState(this.config, {
          APP: undefined,
          COMPONENT: undefined,
          appSettings: updates.payload,
        });
      }
    } else if (
      this.siteStore.experiments.enabled(Experiments.EditorGalleryOOI) &&
      updates.scope === Scope.COMPONENT &&
      updates.source === 'app-settings'
    ) {
      void this.sliderGalleryStore.updateState(this.config, {
        APP: undefined,
        COMPONENT: {},
        appSettings: updates.payload,
      });
    }
  };

  public getFreeTexts = (): string[] => {
    return [];
  };

  constructor(controllerParams: ControllerParams) {
    super(controllerParams);
    this.type = controllerParams.controllerConfig.type;
    this.config = _.clone(controllerParams.controllerConfig.config);
    this.compId = controllerParams.controllerConfig.compId;

    const isEditor = typeof window !== 'undefined' && window.Wix;
    this.slotAPIFactory = createSlotVeloAPIFactory(controllerParams.controllerConfig);

    /* istanbul ignore else: todo(flow-editor): test */
    if (isEditor) {
      this.listenToAppSettingsUpdate();
    }

    this.waitUntilReady = new Promise((resolve) => {
      this.onReadyResolver = resolve;
    });
  }

  private listenToAppSettingsUpdate() {
    const appSettingsClient = appClient({scope: Scope.COMPONENT, cdnUrl: APP_SETTINGS_CDN});
    appSettingsClient.onChange((pb) => {
      this.sliderGalleryStore.updateState(this.config, {APP: undefined, COMPONENT: {}, appSettings: pb});
    });
  }

  public readonly load = async () => {
    if (this.initializeCallback) {
      await Promise.resolve(this.initializeCallback()).catch(this.flowAPI.reportError);
    }
    this.sliderGalleryStore = new SliderGalleryStore(
      this.config,
      this.setProps.bind(this),
      this.siteStore,
      this.compId,
      this.flowAPI.reportError,
      this.slotAPIFactory,
      this.type,
      this.flowAPI.panoramaClient,
      this.veloInputs
    );

    return this.sliderGalleryStore
      .setInitialState()
      .then(() => this.onReadyResolver())
      .catch(this.flowAPI.reportError);
  };

  public readonly init = async () => {
    await this.load();
    this.subscribeToEvents();
  };

  private subscribeToEvents() {
    if (
      this.sliderGalleryStore.galleryType === GALLERY_TYPE.RELATED_PRODUCTS ||
      this.sliderGalleryStore.galleryType === GALLERY_TYPE.ALGORITHMS
    ) {
      this.siteStore.pubSub.subscribe(
        PubSubEvents.RELATED_PRODUCTS,
        (response) => {
          this.sliderGalleryStore.renderRelatedProducts(response.data);
        },
        true
      );
    }
  }
}
