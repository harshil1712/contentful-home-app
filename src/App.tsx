import React, { useMemo } from 'react';
import { locations } from '@contentful/app-sdk';
import Home from './locations/Home';
import ConfigScreen from './locations/ConfigScreen';
import { useSDK } from '@contentful/react-apps-toolkit';

const ComponentLocationSettings = {
  [locations.LOCATION_HOME]: Home,
  [locations.LOCATION_APP_CONFIG]: ConfigScreen,
};

const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    for (const [location, component] of Object.entries(ComponentLocationSettings)) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;
