import assert from 'assert';
import Lester from '../src/lester';
import sinon from 'sinon';

let lester;

describe('Constants', () => {
  it('TRACKJS exported', () => {
    assert.ok(Lester.TRACKJS);
  });

  it('SENTRY exported', () => {
    assert.ok(Lester.SENTRY);
  });
});

describe('Backend override', () => {
  after(() => {
    delete global.trackJs;
  });

  it('takes precedence over autodetection', () => {
    global.trackJs = {};
    lester = new Lester({backend: Lester.SENTRY});
    assert.equal(lester.backend, Lester.SENTRY);
  });
});

describe('Missing backend', () => {
  it('fails to initialize using autodetection', () => {
    assert.throws(
      () => {
        lester = new Lester();
      }, Error
    );
  });

  it('fails to initialize using unknown backend override', () => {
    assert.throws(
      () => {
        lester = new Lester({backend: 'bad-data'});
      }, Error
    );
  });
});

describe('Modified backend', () => {
  it('logs errors', () => {
    sinon.stub(console, 'log');
    lester = new Lester({backend: Lester.TRACKJS});
    lester.backend = 'new-backend';
    lester.log('foo');
    assert.ok(console.log.calledOnce);
    console.log.restore();
  });
});

describe('TrackJS support', () => {
  before(() => {
    global.trackJs = {
      track: sinon.mock(),
      attempt: sinon.mock(),
      watch: sinon.mock(),
      watchAll: sinon.mock(),
      console: {
        log: sinon.mock(),
      },
      addMetadata: sinon.mock(),
    };

    lester = new Lester();
  });

  after(() => {
    delete global.trackJs;
  });

  it('autodetects TrackJS', () => {
    assert.equal(lester.backend, 'trackjs');
  });

  it('captures error', () => {
    const err = new Error();
    lester.capture(err);
    assert.ok(global.trackJs.track.calledWith(err));
  });

  it('runs function while capturing errors', () => {
    const func = function temp() {};
    lester.attempt(func);
    assert.ok(global.trackJs.attempt.calledWith(func));
  });

  it('wraps function', () => {
    const func = function temp() {};
    lester.wrap(func);
    assert.ok(global.trackJs.watch.calledWith(func));
  });

  it('wraps object', () => {
    const obj = {};
    lester.wrapAll(obj);
    assert.ok(global.trackJs.watchAll.calledWith(obj));
  });

  it('captures message', () => {
    const message = 'Test';
    lester.log(message);
    assert.ok(global.trackJs.console.log.calledWith(message));
  });

  it('sets metadata', () => {
    const meta = {
      item1: 1,
      item2: 'two',
    };
    global.trackJs.addMetadata.twice();
    lester.set(meta);
    assert.ok(global.trackJs.addMetadata.calledWith('item1', 1));
    assert.ok(global.trackJs.addMetadata.calledWith('item2', 'two'));
  });
});

describe('Sentry support', () => {
  before(() => {
    global.Raven = {
      captureException: sinon.mock(),
      context: sinon.mock(),
      wrap: sinon.mock(),
      captureMessage: sinon.mock(),
      setExtraContext: sinon.mock(),
    };

    lester = new Lester();
  });

  after(() => {
    delete global.Raven;
  });

  it('captures error', () => {
    const err = new Error();
    lester.capture(err);
    assert.ok(global.Raven.captureException.calledWith(err));
  });

  it('runs function while capturing errors', () => {
    const func = function temp() {};
    lester.attempt(func);
    assert.ok(global.Raven.context.calledWith(func));
  });

  it('wraps function', () => {
    const func = function temp() {};
    lester.wrap(func);
    assert.ok(global.Raven.wrap.calledWith(func));
  });

  it('wraps object', () => {
    const func1 = () => {};
    const func2 = () => {};
    const obj = {
      test1: func1,
      test2: func2,
    };
    global.Raven.wrap.reset();
    global.Raven.wrap.twice();
    lester.wrapAll(obj);
    assert.ok(global.Raven.wrap.calledWith(func1));
    assert.ok(global.Raven.wrap.calledWith(func2));
  });

  it('captures message', () => {
    const message = 'Test';
    lester.log(message);
    assert.ok(global.Raven.captureMessage.calledWith(message));
  });

  it('sets metadata', () => {
    const meta = {
      item1: 1,
      item2: 'two',
    };
    lester.set(meta);
    assert.ok(global.Raven.setExtraContext.calledWith(meta));
  });
});
