'use strict';

import { describe, it } from 'mocha';
import chai from 'chai';
import { assert } from 'chai';
import chaiHttp from 'chai-http';

import addB, { addA } from '../src/helpers/check-test';
import app from '../src/app';

chai.use(chaiHttp);

describe('\n[APP]: GET /', () => {
  it('1. should return 200 status code', done => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        chai.assert.equal(res.status, 200);
        done();
      });
  });
});

describe('Suite de prueba', () => {
  it('1. should returns 2', () => {
    const va = addA(1, 1);
    assert.equal(va, 2);
  });

  it('2. should returns 2', () => {
    const va = addB(1, 2);
    assert.equal(va, 3);
  });
});
