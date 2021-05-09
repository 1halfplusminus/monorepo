import { render } from '@testing-library/react';
import { Marker } from 'react-leaflet';
import userEvent from '@testing-library/user-event';
import CovidMarkerPopup from './covid-marker-popup';
import CovidMap from './map';

describe('CovidMarketPopup', () => {
  it('should render successfully', () => {
    const { baseElement, rerender, getAllByText, container } = render(
      <CovidMap>
        <Marker data-testid="marker" position={[0, 0]}>
          <CovidMarkerPopup name="Test Country" deaths={999} />
        </Marker>
      </CovidMap>
    );

    expect(baseElement).toBeTruthy();
    userEvent.click(container.querySelector('.leaflet-marker-icon'));
    expect(
      getAllByText('death: 999', { exact: false, trim: true })
    ).toBeTruthy();
    expect(
      getAllByText('name: Test Country', { exact: false, trim: true })
    ).toBeTruthy();
    expect(container.querySelector('.leaflet-popup-pane'))
      .toMatchInlineSnapshot(`
      <div
        class="leaflet-pane leaflet-popup-pane"
      >
        <div
          class="leaflet-popup  leaflet-zoom-animated"
          style="bottom: -5px; left: 5px;"
        >
          <div
            class="leaflet-popup-content-wrapper"
          >
            <div
              class="leaflet-popup-content"
              style="width: 51px;"
            >
              name: 
              Test Country
              : 
              <br />
              death: 
              999
            </div>
          </div>
          <div
            class="leaflet-popup-tip-container"
          >
            <div
              class="leaflet-popup-tip"
            />
          </div>
          <a
            class="leaflet-popup-close-button"
            href="#close"
          >
            ×
          </a>
        </div>
      </div>
    `);
  });
});
