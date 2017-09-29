export const EDITORIAL_ID = '29';
export const EDITORIAL_NAME = 'Ziemann and Sons';
export const EDITORIAL_CREATED = '2016-09-26T21:12:40Z';
export const EDITORIAL_UPDATED = '2016-09-26T21:12:45Z';

import { AUTHOR_ID, AUTHOR_NAME } from './author.fixture';

export function getEditorialData(relationship?: string, total?: number): any {
  let response: any = {
    'id': EDITORIAL_ID,
    'type': 'editorials',
    'links': {
      'self': '/editorials/' + EDITORIAL_ID
    },
    'attributes': {
      'name': EDITORIAL_NAME,
      'updated_at': '2017-09-29T19:38:25.616Z',
      'created_at': '2017-09-29T19:38:25.616Z'
    },
    'relationships': {
      'authors': {
        'links': {
          'self': '/editorials/' + EDITORIAL_ID + '/relationships/authors',
          'related': '/editorials/' + EDITORIAL_ID + '/authors'
        },
        'data': {
          'id': AUTHOR_ID,
          'type': 'authors'
        }
      }
    }
  };
  if (relationship && relationship.indexOf('author') !== -1) {
    response.relationships.author.data = {
      'id': '1',
      'type': 'books'
    };
  }
  return response;
};

export function getEditorialIncluded() {
  return {
    'id': EDITORIAL_ID,
    'type': 'editorials',
    'links': { 'self': '/v1/editorials/' + EDITORIAL_ID },
    'attributes': {
      'name': EDITORIAL_NAME,
      'created_at': EDITORIAL_CREATED,
      'updated_at': EDITORIAL_UPDATED
    },
    'relationships': {
      'author': {
        'links': {
          'self': '/v1/editorials/' + EDITORIAL_ID + '/relationships/authors',
          'related': '/v1/editorials/' + EDITORIAL_ID + '/authors'
        }
      }
    }
  }
}

export function getSampleEditorial(i: number, authorId: string) {
  return {
      'id': '' + i,
      'type': 'editorials',
      'attributes': {
        'name': EDITORIAL_NAME,
        'created_at': EDITORIAL_CREATED,
        'updated_at': EDITORIAL_UPDATED
      },
      'relationships': {
          'author': {
              'links': {
                  'self': '/v1/editorials/1/relationships/author',
                  'related': '/v1/editorials/1/author'
              },
              'data': {
                  'id': authorId,
                  'type': 'authors'
              }
          }
      },
      'links': {
          'self': '/v1/editorials/1'
      }
  }
}