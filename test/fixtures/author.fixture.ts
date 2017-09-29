import {getSampleBook} from './book.fixture';
export const AUTHOR_ID = '1';
export const AUTHOR_NAME = 'J. R. R. Tolkien';
export const AUTHOR_BIRTH = '1892-01-03';
export const AUTHOR_DEATH = '1973-09-02';
export const AUTHOR_CREATED = '2016-09-26T21:12:40Z';
export const AUTHOR_UPDATED = '2016-09-26T21:12:45Z';

export const BOOK_TITLE = 'The Fellowship of the Ring';
export const BOOK_PUBLISHED = '1954-07-29';

export const CHAPTER_TITLE = 'The Return Journey';

export function getAuthorsForEditorial(editorialId?: number) {
  return [
      {
        'id': '119',
        'type': 'authors',
        'links': {
          'self': '/authors/119'
        },
        'attributes': {
          'name': 'Rashad Herzog Sr.',
          'date-of-birth': '1954-06-19',
          'date-of-death': '1977-06-19',
          'updated-at': '2017-09-29T19:38:25.654Z',
          'created-at': '2017-09-29T19:38:25.654Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/119/relationships/editorial',
              'related': '/authors/119/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/119/relationships/books',
              'related': '/authors/119/books'
            }
          }
        }
      },
      {
        'id': '120',
        'type': 'authors',
        'links': {
          'self': '/authors/120'
        },
        'attributes': {
          'name': 'Alanis Runolfsdottir',
          'date-of-birth': '1983-08-25',
          'date-of-death': '1986-08-25',
          'updated-at': '2017-09-29T19:38:25.753Z',
          'created-at': '2017-09-29T19:38:25.753Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/120/relationships/editorial',
              'related': '/authors/120/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/120/relationships/books',
              'related': '/authors/120/books'
            }
          }
        }
      },
      {
        'id': '121',
        'type': 'authors',
        'links': {
          'self': '/authors/121'
        },
        'attributes': {
          'name': 'Wanda Gutkowski',
          'date-of-birth': '1993-09-02',
          'date-of-death': '1998-09-02',
          'updated-at': '2017-09-29T19:38:25.777Z',
          'created-at': '2017-09-29T19:38:25.777Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/121/relationships/editorial',
              'related': '/authors/121/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/121/relationships/books',
              'related': '/authors/121/books'
            }
          }
        }
      },
      {
        'id': '122',
        'type': 'authors',
        'links': {
          'self': '/authors/122'
        },
        'attributes': {
          'name': 'Alberto Swaniawski',
          'date-of-birth': '1952-11-12',
          'date-of-death': '1966-11-12',
          'updated-at': '2017-09-29T19:38:25.874Z',
          'created-at': '2017-09-29T19:38:25.874Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/122/relationships/editorial',
              'related': '/authors/122/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/122/relationships/books',
              'related': '/authors/122/books'
            }
          }
        }
      },
      {
        'id': '123',
        'type': 'authors',
        'links': {
          'self': '/authors/123'
        },
        'attributes': {
          'name': 'Filiberto Tremblay DVM',
          'date-of-birth': '1958-09-10',
          'date-of-death': '1963-09-10',
          'updated-at': '2017-09-29T19:38:25.957Z',
          'created-at': '2017-09-29T19:38:25.957Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/123/relationships/editorial',
              'related': '/authors/123/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/123/relationships/books',
              'related': '/authors/123/books'
            }
          }
        }
      },
      {
        'id': '124',
        'type': 'authors',
        'links': {
          'self': '/authors/124'
        },
        'attributes': {
          'name': 'Bernard Beer',
          'date-of-birth': '1965-03-31',
          'date-of-death': '1975-03-31',
          'updated-at': '2017-09-29T19:38:26.073Z',
          'created-at': '2017-09-29T19:38:26.073Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/124/relationships/editorial',
              'related': '/authors/124/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/124/relationships/books',
              'related': '/authors/124/books'
            }
          }
        }
      },
      {
        'id': '125',
        'type': 'authors',
        'links': {
          'self': '/authors/125'
        },
        'attributes': {
          'name': 'Ms. Hope Little',
          'date-of-birth': '1991-01-21',
          'date-of-death': '2009-01-21',
          'updated-at': '2017-09-29T19:38:26.140Z',
          'created-at': '2017-09-29T19:38:26.140Z'
        },
        'relationships': {
          'editorial': {
            'links': {
              'self': '/authors/125/relationships/editorial',
              'related': '/authors/125/editorial'
            }
          },
          'books': {
            'links': {
              'self': '/authors/125/relationships/books',
              'related': '/authors/125/books'
            }
          }
        }
      }
    ]
  }
}

export function getAuthorData(relationship?: string, total?: number): any {
  let response: any = {
    'id': AUTHOR_ID,
    'type': 'authors',
    'attributes': {
      'name': AUTHOR_NAME,
      'date_of_birth': AUTHOR_BIRTH,
      'date_of_death': AUTHOR_DEATH,
      'created_at': AUTHOR_CREATED,
      'updated_at': AUTHOR_UPDATED
    },
    'relationships': {
      'books': {'links': {'self': '/v1/authors/1/relationships/books', 'related': '/v1/authors/1/books'}},
      'author': {'links': {'self': '/v1/authors/1/relationships/editorial', 'related': '/v1/authors/1/editorial'}},
    },
    'links': {'self': '/v1/authors/1'}
  };
  if (relationship && relationship.indexOf('books') !== -1) {
    response.relationships.books.data = [];
    for (let i = 1; i <= total; i++) {
      response.relationships.books.data.push({
        'id': '' + i,
        'type': 'books'
      });
    }
  }
  return response;
};

export function getAuthorIncluded() {
  return {
    'id': AUTHOR_ID,
    'type': 'authors',
    'links': { 'self': '/v1/authors/1' },
    'attributes': {
      'name': AUTHOR_NAME,
      'date_of_birth': AUTHOR_BIRTH,
      'date_of_death': AUTHOR_DEATH,
      'created_at': AUTHOR_CREATED,
      'updated_at': AUTHOR_UPDATED
    },
    'relationships': {
      'books': {
        'links': {
          'self': '/v1/authors/1/relationships/books',
          'related': '/v1/authors/1/books'
        }
      },
      'editorial': {
        'links': {
          'self': '/v1/authors/relationships/editorial',
          'related': '/v1/authors/1/editorial'
        }
      }
    }
  }
}

export function getIncludedBooks(totalBooks: number, relationship?: string, totalChapters?: number): any[] {
  let responseArray: any[] = [];
  let chapterId = 0;
  for (let i = 1; i <= totalBooks; i++) {
    let book: any = getSampleBook(i, AUTHOR_ID, '1');
    if (relationship && relationship.indexOf('books.chapters') !== -1) {
      book.relationships.chapters.data = [];
      for (let ic = 1; ic <= totalChapters; ic++) {
        chapterId++;
        book.relationships.chapters.data.push({
          'id': '' + chapterId,
          'type': 'chapters'
        });
        responseArray.push({
          'id': '' + chapterId,
          'type': 'chapters',
          'attributes': {
            'title': CHAPTER_TITLE,
            'ordering': chapterId,
            'created_at': '2016-10-01T12:54:32Z',
            'updated_at': '2016-10-01T12:54:32Z'
          },
          'relationships': {
            'book': {
              'links': {
                'self': '/v1/authors/288/relationships/book',
                'related': '/v1/authors/288/book'
              },
              'data': {
                'id': '' + i,
                'type': 'books'
              }
            }
          },
          'links': {'self': '/v1/authors/288'}
        });
      }
    }
    responseArray.push(book);
  }
  return responseArray;
}
