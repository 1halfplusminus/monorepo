import { render } from '@testing-library/react';
import { constVoid, constFalse } from 'fp-ts/function';

import SwapForm, { SwapFormProps } from './swap-form';
import { none, some } from 'fp-ts/Option';
import { ETH, DAI, USDC } from '../__mocks__/tokens';
import '@testing-library/jest-dom';

describe('SwapForm', () => {
  const commonBases = some([some(ETH), some(DAI)]);
  const tokens = some([some(ETH), some(DAI), some(USDC)]);
  const propsInputA: SwapFormProps['inputA'] = {
    isSelected: constFalse,
    onValueChange: constVoid,
    onSelected: constVoid,
    selected: none,
    sold: none,
    value: '',
  };
  const propsInputB: SwapFormProps['inputB'] = {
    isSelected: constFalse,
    onValueChange: constVoid,
    onSelected: constVoid,
    selected: none,
    sold: none,
    value: '',
  };
  const props: SwapFormProps = {
    inputA: propsInputA,
    inputB: propsInputB,
    commonBases: none,
    onInverse: constVoid,
    onSearch: constVoid,
    tokens: none,
  };
  it('should render successfully', () => {
    const { baseElement } = render(<SwapForm {...props} />);
    expect(baseElement).toBeTruthy();
  });
  /* describe('with state', () => {
    const fetchBalance = jest.fn(async () => '100');
    const props = {
      tokens: tokens,
      commonBases,
      selected: some([none, none]),
      account: some('x100000'),

      fetchBalance,
    };
    let resultProps: ReturnType<typeof useSwapForm>;
    const FormWithStat = () => {
      const form = useSwapForm({
        ...props,
      });
      resultProps = form;
      return <SwapForm {...form.bindSwapForm()} />;
    };
    it('it should fetch balance', async () => {
      const providers = render(<FormWithStat />);
      await waitFor(() =>
        pipe(
          resultProps.balances,
          options.map((b) => b.get(ETH) === 1000),
          options.fold(
            () => Promise.reject(),
            () => {
              console.log('here');
              return Promise.resolve();
            }
          )
        )
      );

      expect(fetchBalance).toHaveBeenCalled();
      expect(fetchBalance).toReturnWith(Promise.resolve('100'));

      expect(providers.baseElement).toMatchInlineSnapshot();
    });
  }); */

  it('should match snapshot', () => {
    const { baseElement } = render(
      <SwapForm
        {...props}
        inputA={{
          ...propsInputA,
          selected: some(DAI),
          value: '10',
          sold: some('10'),
        }}
        inputB={{
          ...propsInputB,
          selected: some(ETH),
          value: '50',
          sold: some('50'),
        }}
      />
    );
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="swap-form__StyledSwapSurface-a51klb-0 kzmnSs"
          >
            <h2
              class="swap-form__Title-a51klb-1 fvvpAB"
            >
              Permuter
            </h2>
            <div
              class="swap-form__FormInputWrapper-a51klb-3 jtZizk"
            >
              <div
                class="swap-input__StyledSwapInputWrapper-asgs3m-0 belrkj"
              >
                <div
                  class="swap-input__Row-asgs3m-2 fccPlj"
                >
                  <div
                    class="token-select__StyledTokenSelectWrapper-sc-1js3sej-0 kKZnze"
                  >
                    <div
                      class="token-select__TokenItem-sc-1js3sej-3 eZOfxI"
                    >
                      <img
                        class="token-symbol__StyledTokenSymbol-sc-1mobnls-0 lkvUzK"
                        src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                      />
                      <div
                        class="token-select__Text-sc-1js3sej-1 eHuqIZ"
                      >
                        DAI
                      </div>
                    </div>
                    <svg
                      class="token-select__CaretDown-sc-1js3sej-2 inVbOg"
                      height="1em"
                      viewBox="0 0 100 100"
                      width="1em"
                    >
                      <path
                        d="M21.364 42.218l24.329 24.329c.026.027.034.065.061.091a5.856 5.856 0 004.17 1.711 5.853 5.853 0 004.17-1.711c.027-.027.034-.064.061-.091l24.329-24.329c2.285-2.285 2.285-6.024 0-8.308s-6.024-2.285-8.308 0L49.923 54.161 29.672 33.91c-2.285-2.285-6.024-2.285-8.308 0s-2.285 6.024 0 8.308z"
                      />
                    </svg>
                  </div>
                  <input
                    inputmode="numeric"
                    type="text"
                    value="10"
                  />
                </div>
                <div
                  class="swap-input__Col-asgs3m-1 eA-dmCf"
                >
                  <div
                    class="swap-input__SoldDisplay-asgs3m-3 wGnKf"
                    title="sold-DAI"
                  >
                    Solde: 
                    10
                     
                    DAI
                     
                  </div>
                </div>
              </div>
              <div
                class="swap-form__SwapIconWrapper-a51klb-2 gyhTtt"
                height="50"
              >
                <svg
                  fill="none"
                  viewBox="0 0 96 95"
                >
                  <ellipse
                    cx="48"
                    cy="47.5"
                    fill="#111827"
                    rx="48"
                    ry="47.5"
                  />
                  <ellipse
                    cx="48"
                    cy="47.5"
                    fill="#374151"
                    rx="42"
                    ry="41.5"
                  />
                  <path
                    d="M48.5 36.125v22.75M59.875 47.5L48.5 58.875 37.125 47.5"
                    stroke="#fff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
              </div>
              <div
                class="swap-input__StyledSwapInputWrapper-asgs3m-0 belrkj"
              >
                <div
                  class="swap-input__Row-asgs3m-2 fccPlj"
                >
                  <div
                    class="token-select__StyledTokenSelectWrapper-sc-1js3sej-0 kKZnze"
                  >
                    <div
                      class="token-select__TokenItem-sc-1js3sej-3 eZOfxI"
                    >
                      <img
                        class="token-symbol__StyledTokenSymbol-sc-1mobnls-0 lkvUzK"
                        src="data:image/png;base64,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"
                      />
                      <div
                        class="token-select__Text-sc-1js3sej-1 eHuqIZ"
                      >
                        ETH
                      </div>
                    </div>
                    <svg
                      class="token-select__CaretDown-sc-1js3sej-2 inVbOg"
                      height="1em"
                      viewBox="0 0 100 100"
                      width="1em"
                    >
                      <path
                        d="M21.364 42.218l24.329 24.329c.026.027.034.065.061.091a5.856 5.856 0 004.17 1.711 5.853 5.853 0 004.17-1.711c.027-.027.034-.064.061-.091l24.329-24.329c2.285-2.285 2.285-6.024 0-8.308s-6.024-2.285-8.308 0L49.923 54.161 29.672 33.91c-2.285-2.285-6.024-2.285-8.308 0s-2.285 6.024 0 8.308z"
                      />
                    </svg>
                  </div>
                  <input
                    inputmode="numeric"
                    type="text"
                    value="50"
                  />
                </div>
                <div
                  class="swap-input__Col-asgs3m-1 eA-dmCf"
                >
                  <div
                    class="swap-input__SoldDisplay-asgs3m-3 wGnKf"
                    title="sold-ETH"
                  >
                    Solde: 
                    50
                     
                    ETH
                     
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    `);
  });
});
