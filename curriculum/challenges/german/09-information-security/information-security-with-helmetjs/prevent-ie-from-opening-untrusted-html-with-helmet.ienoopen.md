---
id: 587d8248367417b2b2512c3b
title: Verhindern, dass IE nicht vertrauenswürdigen HTML-Code mit helmet.ieNoOpen() öffnet
challengeType: 2
forumTopicId: 301584
dashedName: prevent-ie-from-opening-untrusted-html-with-helmet-ienoopen
---

# --description--

As a reminder, this project is being built upon the following starter project on <a href="https://gitpod.io/?autostart=true#https://github.com/freeCodeCamp/boilerplate-infosec/" target="_blank" rel="noopener noreferrer nofollow">Gitpod</a>, or cloned from <a href="https://github.com/freeCodeCamp/boilerplate-infosec/" target="_blank" rel="noopener noreferrer nofollow">GitHub</a>.

Some web applications will serve untrusted HTML for download. Einige Versionen des Internet Explorer öffnen diese HTML-Dateien standardmäßig im Kontext Ihrer Website. Das bedeutet, dass eine nicht vertrauenswürdige HTML-Seite im Zusammenhang mit deinen Seiten unerwünschte Dinge tun könnte. This middleware sets the X-Download-Options header to noopen. This will prevent IE users from executing downloads in the trusted site's context.

# --instructions--

Verwende die `helmet.ieNoOpen()`-Methode auf deinem Server.

# --hints--

helmet.ieNoOpen() middleware should be mounted correctly

```js
(getUserInput) =>
  $.get(getUserInput('url') + '/_api/app-info').then(
    (data) => {
      assert.include(data.appStack, 'ienoopen');
      assert.equal(data.headers['x-download-options'], 'noopen');
    },
    (xhr) => {
      throw new Error(xhr.responseText);
    }
  );
```

