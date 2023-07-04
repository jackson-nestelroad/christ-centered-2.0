import React from 'react';

import Page from '../common/Page';
import Background from '../components/Background';
import ChristCentered from '../components/ChristCentered';
import MenuWrapper from '../components/MenuWrapper';
import Now from '../components/Now';
import OriginsPermissions from '../components/OriginsPermissions';
import Verse from '../components/Verse';
import Weather from '../components/Weather';
import './App.scss';

function App() {
  return (
    <Page className="christ-centered">
      <ChristCentered>
        <Background>
          <MenuWrapper>
            <div className="main-content-container">
              <Weather />
              <Now />
              <OriginsPermissions origins={['https://*.biblegateway.com/*']} message="Give Access to BibleGateway">
                <Verse />
              </OriginsPermissions>
            </div>
          </MenuWrapper>
        </Background>
      </ChristCentered>
    </Page>
  );
}

export default App;
