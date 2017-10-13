import {getSampleBook} from './book.fixture';
export const DIRECTOR_ID = '1';
export const DIRECTOR_NAME = 'John Doe';
export const DIRECTOR_CREATED = '2016-09-26T21:12:40Z';
export const DIRECTOR_UPDATED = '2016-09-26T21:12:45Z';

export function getDirectorForEditorial(editorialId?: number) {
  return [
      {
        'id': DIRECTOR_ID,
        'type': 'directors',
        'links': {
          'self': '/directors/' + DIRECTOR_ID
        },
        'attributes': {
          'name': DIRECTOR_NAME,
          'updated-at': DIRECTOR_CREATED,
          'created-at': DIRECTOR_UPDATED
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/directors/119/relationships/editorial',
              'related': '/directors/119/editorial'
            }
          }
        }
      }
    ]
  };
