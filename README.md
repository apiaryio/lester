# Lester

> “I keep asking myself... Who could have done a thing like this?”

> *— Lester Nygaard, Fargo S01*

---

## API Reference

### `init`

```JavaScript
lester.init({
  token: 'foo'
});
```

#### Arguments

* `token` *(required)*
* `userId` *(optional)* Identifiable string that represents a user
* `sessionId` *(optional)* Similar to `userId`
* `version` *(optional)* Which version of your application caused the error

##### Mapping

| TrackJS                            | Sentry                                      |
|------------------------------------|---------------------------------------------|
| `Rz8idkdZqz4foyMuc6u9uQ6oi58G7l46` | `https://<key>@app.getsentry.com/<project>` |

* `application` *(optional, TrackJS only)*

### `capture`

_**Alias:**_ `track`

```JavaScript
lester.capture(new Error('An error occurred.'));
```

##### Mapping

| TrackJS         | Sentry                   |
|-----------------|--------------------------|
| `trackJs.track` | `raven.captureException` |

### `context`

_**Alias:**_ `track`, `attempt`, `sandbox`

`lester.context` allows you to wrap any function to be _immediately_ executed. Behind the scenes, Lester is just wrapping your code in a `try...catch` block to record the exception before re-throwing it.

```JavaScript
lester.context(function() {
  foo(bar.baz);
});
```

##### Mapping

| TrackJS           | Sentry          |
|-------------------|-----------------|
| `trackJs.attempt` | `raven.context` |

### `wrap`

_**Alias:**_ `watch`

`lester.wrap` wraps a function in a similar way to `lester.context`, but instead of executing the function, it returns a new function.

```JavaScript
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

_**Alias:**_ `watchAll`

`lester.wrapAll` wraps all functions within a given object.

```JavaScript
lester.wrapAll(myModel);
lester.wrapAll(new Model());
```

##### Mapping

| TrackJS            | Sentry |
|--------------------|--------|
| `trackJs.watchAll` | `N/A`  |

### `console`

#### Aliases

* `lester.log`
* `lester.debug`
* `lester.error`

### `set`

Set additinal metadata.
