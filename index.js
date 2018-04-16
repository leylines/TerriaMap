'use strict';

/*global require,window */

var terriaOptions = {
    baseUrl: 'build/TerriaJS'
};

// Check browser compatibility early on.
// A very old browser (e.g. Internet Explorer 8) will fail on requiring-in many of the modules below.
// 'ui' is the name of the DOM element that should contain the error popup if the browser is not compatible
//var checkBrowserCompatibility = require('leylinesjs/lib/ViewModels/checkBrowserCompatibility');

// checkBrowserCompatibility('ui');
import GoogleAnalytics from 'leylinesjs/lib/Core/GoogleAnalytics';
import ShareDataService from 'leylinesjs/lib/Models/ShareDataService';
import OgrCatalogItem from 'leylinesjs/lib/Models/OgrCatalogItem';
import raiseErrorToUser from 'leylinesjs/lib/Models/raiseErrorToUser';
import registerAnalytics from 'leylinesjs/lib/Models/registerAnalytics';
import registerCatalogMembers from 'leylinesjs/lib/Models/registerCatalogMembers';
import registerCustomComponentTypes from 'leylinesjs/lib/ReactViews/Custom/registerCustomComponentTypes';
import Terria from 'leylinesjs/lib/Models/Terria';
import updateApplicationOnHashChange from 'leylinesjs/lib/ViewModels/updateApplicationOnHashChange';
import updateApplicationOnMessageFromParentWindow from 'leylinesjs/lib/ViewModels/updateApplicationOnMessageFromParentWindow';
import ViewState from 'leylinesjs/lib/ReactViewModels/ViewState';
import BingMapsSearchProviderViewModel from 'leylinesjs/lib/ViewModels/BingMapsSearchProviderViewModel.js';
import NominatimSearchProviderViewModel from 'leylinesjs/lib/ViewModels/NominatimSearchProviderViewModel.js';
import defined from 'terriajs-cesium/Source/Core/defined';
import render from './lib/Views/render';

// Register all types of catalog members in the core TerriaJS.  If you only want to register a subset of them
// (i.e. to reduce the size of your application if you don't actually use them all), feel free to copy a subset of
// the code in the registerCatalogMembers function here instead.
registerCatalogMembers();
registerAnalytics();

terriaOptions.analytics = new GoogleAnalytics();

// Construct the TerriaJS application, arrange to show errors to the user, and start it up.
var terria = new Terria(terriaOptions);

// Register custom components in the core TerriaJS.  If you only want to register a subset of them, or to add your own,
// insert your custom version of the code in the registerCustomComponentTypes function here instead.
registerCustomComponentTypes(terria);

// Create the ViewState before terria.start so that errors have somewhere to go.
const viewState = new ViewState({
    terria: terria
});

if (process.env.NODE_ENV === "development") {
    window.viewState = viewState;
}

// If we're running in dev mode, disable the built style sheet as we'll be using the webpack style loader.
// Note that if the first stylesheet stops being nationalmap.css then this will have to change.
if (process.env.NODE_ENV !== "production" && module.hot) {
    document.styleSheets[0].disabled = true;
}

terria.start({
    // If you don't want the user to be able to control catalog loading via the URL, remove the applicationUrl property below
    // as well as the call to "updateApplicationOnHashChange" further down.
    applicationUrl: window.location,
    configUrl: 'config.json',
    shareDataService: new ShareDataService({
        terria: terria
    })
}).otherwise(function(e) {
    raiseErrorToUser(terria, e);
}).always(function() {
    try {
        configuration.bingMapsKey = terria.configParameters.bingMapsKey ? terria.configParameters.bingMapsKey : configuration.bingMapsKey;
        configuration.mapboxApiKey = terria.configParameters.mapboxApiKey ? terria.configParameters.mapboxApiKey : configuration.mapboxApiKey;

        viewState.searchState.locationSearchProviders = [
            new BingMapsSearchProviderViewModel({
                terria: terria,
                key: terria.configParameters.bingMapsKey
            }),
            new NominatimSearchProviderViewModel({terria})
        ];

        // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
        updateApplicationOnHashChange(terria, window);
        updateApplicationOnMessageFromParentWindow(terria, window);

        // Create the various base map options.
        var createGlobalBaseMapOptions = require('leylinesjs/lib/ViewModels/createGlobalBaseMapOptions');
        var selectBaseMap = require('leylinesjs/lib/ViewModels/selectBaseMap');

        var allBaseMaps = createGlobalBaseMapOptions(terria, configuration.bingMapsKey, configuration.mapboxApiKey);
        selectBaseMap(terria, allBaseMaps, 'Bing Maps Aerial with Labels', true);

        // Show a modal disclaimer before user can do anything else.
        if (defined(terria.configParameters.globalDisclaimer)) {
            var globalDisclaimer = terria.configParameters.globalDisclaimer;
            var hostname = window.location.hostname;
            if (globalDisclaimer.enableOnLocalhost || hostname.indexOf('localhost') === -1) {
                var message = '';
                // Sometimes we want to show a preamble if the user is viewing a site other than the official production instance.
                // This can be expressed as a devHostRegex ("any site starting with staging.") or a negative prodHostRegex ("any site not ending in .gov.au")
                if (defined(globalDisclaimer.devHostRegex) && hostname.match(globalDisclaimer.devHostRegex) ||
                    defined(globalDisclaimer.prodHostRegex) && !hostname.match(globalDisclaimer.prodHostRegex)) {
                        message += require('./lib/Views/DevelopmentDisclaimerPreamble.html');
                }
                message += require('./lib/Views/GlobalDisclaimer.html');

                var options = {
                    title: (globalDisclaimer.title !== undefined) ? globalDisclaimer.title : 'Warning',
                    confirmText: (globalDisclaimer.buttonTitle || "Ok"),
                    width: 600,
                    height: 550,
                    message: message,
                    horizontalPadding : 100
                };
                viewState.notifications.push(options);
            }
        }

        render(terria, allBaseMaps, viewState);
    } catch (e) {
        console.error(e);
        console.error(e.stack);
    }
});
