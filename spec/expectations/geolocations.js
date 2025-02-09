const { compactObject } = require('../utils/fixtures');

/**
 * Returns the expected geolocation JSON from the API for a given database row.
 *
 * @param {Object} geolocation - The geolocation database row.
 * @param {Object} [options] - Additional options. Any undocumented option is
 * considered an additional property to be added to the expected object.
 * @returns {Object} The expected API geolocation.
 */
exports.getExpectedGeolocation = (
  { id, state, date_georef, remark, errors_list, image },
  options = {}
) => {
  const {
    locale: locale,
    ...extraProperties
  } = options;

  const expectedLocale = locale || 'en';

  const expected = {
    ...extraProperties,
    id,
    state,
    remark,
    errors_list,
    date_georef: date_georef.toISOString(),
    image: {
      id: image.id,
      name: image.name,
      title: image.title,
      owner: {
        id: image.owner.id,
        name: image.owner.name[expectedLocale]
      },
      collection: {
        id: image.collection.id,
        name: image.collection.name[expectedLocale]
      }
    }
  };

  return compactObject(expected);
};
