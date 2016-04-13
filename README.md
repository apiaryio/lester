# Lester

> “I keep asking myself... Who could have done a thing like this?”

> *— Lester Nygaard, Fargo S01*

---

## Usage

You **must** initialize either TrackJS or Sentry on the page before calling any of the capture/logging functions, e.g:

```html
<script>
  window._trackJs = {
    token: "YOUR_TOKEN_HERE"
  }
</script>
<script type="text/javascript" src="https://.../tracker.js"></script>
<script type="text/javascript" src="./lester.js"></script>
<script>
  var lester = new Lester();
  lester.log('Now this will work!');
</script>
```

### Multiple Instances

It is possible to use multiple instances within a single web page, each using whichever backend you prefer. For example:

```js
const lester1 = new Lester({backend: Lester.TRACKJS});
const lester2 = new Lester({backend: Lester.SENTRY});
```

This way you can incrementally update code to use Lester and whichever backend you prefer.

## API Reference

### `Lester`

Creates a new Lester instance, allowing you to pass in options.

```js
const lester = new Lester({
  backend: 'auto'
});
```

##### Options

Name | Description | Default
---- | ----------- | -------
`backend` | Backend to use. Set to `'sentry'` or `'trackjs'` to disable autodetection. | `'auto'`

### `capture`

```js
lester.capture(new Error('An error occurred.'));
```

##### Mapping

| TrackJS         | Sentry                   |
|-----------------|--------------------------|
| `trackJs.track` | `raven.captureException` |

### `attempt`

`lester.attempt` allows you to wrap any function to be _immediately_ executed. Behind the scenes, Lester is just wrapping your code in a `try...catch` block to record the exception before re-throwing it.

```js
lester.attempt(function() {
  foo(bar.baz);
});
```

##### Mapping

| TrackJS           | Sentry          |
|-------------------|-----------------|
| `trackJs.attempt` | `raven.context` |

### `wrap`

`lester.wrap` wraps a function in a similar way to `lester.context`, but instead of executing the function, it returns a new function.

```js
var myFunction = lester.wrap(function() {
  foo(bar.baz);
});

myFunction()
```

##### Mapping

| TrackJS         | Sentry          |
|-----------------|-----------------|
| `trackJs.watch` | `raven.wrap`    |

### `wrapAll`

`lester.wrapAll` wraps all functions within a given object.

```JavaScript
lester.wrapAll(myModel);
lester.wrapAll(new Model());
```

##### Mapping

| TrackJS            | Sentry                     |
|--------------------|----------------------------|
| `trackJs.watchAll` | `raven.wrap` for each item |

### `log`

Log data to the console.

```js
lester.log('Some data');
```

##### Mapping

| TrackJS               | Sentry                 |
|-----------------------|------------------------|
| `trackJs.console.log` | `raven.captureMessage` |

### `set`

Set additional metadata to be logged with errors.

```js
lester.set('role', 'editor');
lester.set({ role: 'editor' });
```

##### Mapping

| TrackJS               | Sentry                   |
|-----------------------|--------------------------|
| `trackJs.addMetadata` | `raven.setExtraContext`  |
