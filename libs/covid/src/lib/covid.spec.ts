import { filterOceaniaCountries, getStatsByCountries } from './covid';

// TODO: TEST
describe('covid', () => {
  it('should filter oceania country correctly', async () => {
    const filter = await filterOceaniaCountries();
    const countries = await getStatsByCountries();
    expect(countries.filter(filter)).toMatchInlineSnapshot(`
      Array [
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "AU",
          "name": "Australia",
          "position": Array [
            -27,
            133,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "FJ",
          "name": "Fiji",
          "position": Array [
            -18,
            175,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "NC",
          "name": "New Caledonia",
          "position": Array [
            -21.5,
            165.5,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "NZ",
          "name": "New Zealand",
          "position": Array [
            -41,
            174,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "PG",
          "name": "Papua New Guinea",
          "position": Array [
            -6,
            147,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "SB",
          "name": "Solomon Islands",
          "position": Array [
            -8,
            159,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
        Object {
          "active": 100,
          "cases": 0,
          "deaths": 100,
          "iso": "VU",
          "name": "Vanuatu",
          "position": Array [
            -16,
            167,
          ],
          "recovered": 0,
          "today": Object {
            "cases": 0,
            "deaths": 0,
            "recovered": 0,
          },
        },
      ]
    `);
  });
});
