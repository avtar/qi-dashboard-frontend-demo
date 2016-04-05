# Quality Infrastructure - Frontend Demo Code

## Embedding QI Metrics on Your Site

A site can display metrics information (charts and summaries) from the Quality Infrastructure by including Javascript from the QI site and calling various functions to create the desired panels.

Various single-file versions of the Javascript necessary to embed metrics information from the QI are available:

- `http://qi.gpii.net/qi-frontend-full.js` - all depedencies
- `http://qi.gpii.net/qi-frontend-full.min.js` - the above, minified
- `http://qi.gpii.net/qi-frontend-noJquery.js` - all dependencies except jQuery
- `http://qi.gpii.net/qi-frontend-noJquery.min.js` - the above, minified

A basic stylesheet can also optionally be included or studied to apply your own styles:

- `https://qi.gpii.net/qi-frontend.css`

---

## Developing

- `npm install`
- `npm install -g grunt-cli`
- `grunt copy:frontEndDependencies`

This copies necessary front-end dependencies from `node_modules` to `src/lib`

## Building a Redistributable Single File Version

- `npm install`
- `npm install -g grunt-cli`
- `grunt copy:frontEndDependencies`
- `grunt dist`

This produces four single-file versions of the dependencies in the `/dist` directory:
- non-minified with all dependencies
- minified with all dependencies
- non-minified without jQuery
- minified with jQuery

## Libraries Used
- jQuery and jQuery UI
- Infusion
- D3
- Floe Chart Authoring Tool

## The Demos

The demos `index-singleFile.html` and `index-noJquery.html` in `/demos` assumes a single-file distribution has been built and use it in their markup; these demos are intended to guide those implementing the QI panels into their own site.

## Using a Container

A container running a web server can be used to host the redistributable source code mentioned above.

To build a container the following command should be used:

```
sudo docker build \
--no-cache \
-t gpii/qi-dashboard-frontend-demo .
```

Then to start a container this command can be used:

```
sudo docker run \
--name qi-dashboard-frontend-demo \
-d \
-p 80:80 \
gpii/qi-dashboard-frontend-demo
```

The server will be reachable at ``http://<your container's IP address>:8888/`` and will serve the contents of the generated ``dist`` directory.
