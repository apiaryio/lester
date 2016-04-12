/*
 * In-page tracking Façade around tools like TrackJS and Sentry.
 */
const TRACKJS = 'trackjs';
const SENTRY = 'sentry';

function error(message) {
  if (console && console.log) {
    console.log(message + ' No suitable backend found!');
  }
}

export default class Lester {
  constructor(options) {
    this.backend = null;

    if (options && options.backend) {
      switch (options.backend) {
      case TRACKJS: case SENTRY:
        this.backend = options.backend;
        break;
      default:
        throw new Error(`Unknown backend ${options.backend}`);
      }
    } else {
      // Autodetection mode...
      if (typeof trackJs !== 'undefined') {
        this.backend = TRACKJS;
      } else if (typeof Raven !== 'undefined') {
        this.backend = SENTRY;
      } else {
        throw new Error('Could not autodetect backend');
      }
    }
  }

  capture(err) {
    let ret;
    if (this.backend === TRACKJS) {
      ret = trackJs.track(err);
    } else if (this.backend === SENTRY) {
      ret = Raven.captureException(err);
    } else {
      error('Unable to capture error!');
    }
    return ret;
  }

  attempt(func) {
    let ret;
    if (this.backend === TRACKJS) {
      ret = trackJs.attempt(func);
    } else if (this.backend === SENTRY) {
      ret = Raven.context(func);
    } else {
      error('Unable to run function!');
    }
    return ret;
  }

  wrap(func) {
    let ret;
    if (this.backend === TRACKJS) {
      ret = trackJs.watch(func);
    } else if (this.backend === SENTRY) {
      ret = Raven.wrap(func);
    } else {
      error('Unable to wrap function!');
    }
    return ret;
  }

  wrapAll(obj) {
    let ret;
    if (this.backend === TRACKJS) {
      ret = trackJs.watchAll(obj);
    } else if (this.backend === SENTRY) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'function') {
          obj[key] = Raven.wrap(obj[key]);
        }
      });
      ret = obj;
    } else {
      error('Unable to wrap object!');
    }
    return ret;
  }

  log(message) {
    let ret;
    if (this.backend === TRACKJS) {
      ret = trackJs.console.log(message);
    } else if (this.backend === SENTRY) {
      ret = Raven.captureMessage(message);
    } else {
      error(`Unable to log message: "${message}".`);
    }
    return ret;
  }

  set(name, value) {
    let properties;
    let ret;

    if (value === undefined) {
      // Passed in an object of key: value pairs
      properties = name;
    } else {
      // Passed in a single key: value pair
      properties = {name: value};
    }

    if (this.backend === TRACKJS) {
      Object.keys(properties).forEach((key) => {
        ret = trackJs.addMetadata(key, properties[key]);
      });
    } else if (this.backend === SENTRY) {
      ret = Raven.setExtraContext(properties);
    } else {
      error('Unable to set data!');
    }
    return ret;
  }
}

Lester.TRACKJS = TRACKJS;
Lester.SENTRY = SENTRY;
