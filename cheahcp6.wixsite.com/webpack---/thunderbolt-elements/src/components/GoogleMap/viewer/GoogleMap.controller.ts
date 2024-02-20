import { withCompController } from '@wix/editor-elements-integrations';
import {
  GoogleMapMapperProps,
  GoogleMapProps,
  GoogleMapStateRefs,
  GoogleMapControllerProps,
} from '../GoogleMap.types';
import { mapConsentPolicyStateRefValues } from '../../ConsentPolicyWrapper/viewer/utils';

export default withCompController<
  GoogleMapMapperProps,
  GoogleMapControllerProps,
  GoogleMapProps,
  GoogleMapStateRefs
>(({ stateValues, mapperProps }) => {
  return {
    ...mapperProps,
    ...mapConsentPolicyStateRefValues(stateValues),
  };
});
