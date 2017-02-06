# MapLesotho - Area of Interest OSM stats

This is the front end of a tool for #MapLesotho (OSM) users to quick gain an understanding of what OSM features are present in an area of interest. For now this is a simple polygon drawn on a map.

## Related repos

- [ml-api](https://github.com/rustyb/ml-api) - hapi powered API for querying a postgres+postgis database of Lesotho or other osm export.

## Getting started - developing locally

This project uses the [MapLesotho-api](https://github.com/rustyb/ml-api) (couldn't come up with a more original name). To get started you should clone that repo as well as this one.

I recommend installing NVM to sandbox your node versions. This was developed with node 6.9.1. Would recommend this, but other node versions may work.

```
git clone git@github.com:rustyb/ml-analysis.git

cd ml-analysis

npm install
```

You will need a [mapboxAPI token](https://www.mapbox.com/help/create-api-access-token/) in order to view the map tiles. 

You can feed this as a environment variable `MAPBOX_TOKEN` or add it to the production.js config file. If you wish to develop locally with different config variables you can create a `app/config/local.js`. This will supersede the production variables and is ignored by version control.

### Config

- `MAPBOX_TOKEN` - get a token from mapbox.
- `API_URL` - this defaults to localhost:4000 unless specified. Should point to running instance of ml-api.


**Start the app and browsersync to listen for changes**

```
MAPBOX_TOKEN='' npm run serve
```

### Build for production

```
npm run build
```

Then you can copy the files from `dist` to a webserver where the API_URL is accessible from too.