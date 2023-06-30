import React from 'react';

import Page from '../common/Page';
import Background from '../components/Background';
import ChristCentered from '../components/ChristCentered';
import MenuWrapper from '../components/MenuWrapper';
import Now from '../components/Now';
import Verse from '../components/Verse';
import Weather from '../components/Weather';
import GeolocationProvider from '../context/Geolocation';
import WeatherProvider from '../context/Weather';
import WindowSizeProvider from '../context/Window';
import './App.scss';

function App() {
  return (
    <Page className="christ-centered">
      <ChristCentered>
        <Background>
          <GeolocationProvider>
            <WeatherProvider>
              <MenuWrapper>
                <div className="main-content-container">
                  <Weather />
                  <Now />
                  <WindowSizeProvider>
                    <Verse />
                  </WindowSizeProvider>
                </div>
              </MenuWrapper>
            </WeatherProvider>
          </GeolocationProvider>
        </Background>
      </ChristCentered>
    </Page>
  );
}

export default App;
