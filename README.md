# pwa-locator
[![Netlify Status](https://api.netlify.com/api/v1/badges/65fb937c-ec2c-457c-8be4-1b49ba2aefdb/deploy-status)](https://app.netlify.com/sites/calm-monstera-189de3/deploys)

[Deployed Locator PWA](https://calm-monstera-189de3.netlify.app/)

## Expected features:

* startpage, showing a map and your current geo-coordinates;
* on the map: a circle, indicating your position (circle center) and the accuracy (radius of the circle)
* on the start page: a button to open a camera page;
* camera page: display the live video stream of the camera;
* on the camera page:
    * button pause/play
        * when in video mode: paues live video playback and takes a still picture
        * when in picture mode: returns to live video playback
    * button save (enabled when video is paused): save the picture and return to startpage
    * button cancel: get back to startpage without saving anything
* on the map: a marker for all taken pictures;
* when selecting a marker (click/tab): show the photo;
* Include the coordinates of the location as text on the taken picture.
    * position of the text: centered at the bottom of the picture
    * style: black text on 50% white transparent background
    * background: ~ 2px margin around the text
* Make locator a fully fledged PWA with service worker, manifest etc.
* Deploy locator on Netlify
* Give locator a typical smartphone app look: Map takes over the whole screen, ...

This web app is the starting point for the exercise "Locator" which is part of my course "Progressive WebApps" held at FH Vorarlberg. The finished app shall show a map of your environment with you current position marked. Locator will let you take pictures, which are also marked on the map.

Locator uses the following open source contributions:

* the [Leaflet library](https://leafletjs.com) to implement interactive maps;
* [OpenStreetMap](https://www.openstreetmap.org/about) to get map data;
* [Parcel](https://parceljs.org) as a build tool;
* [Bootstrap Icons](https://icons.getbootstrap.com) for beautiful, professional SVG icons.