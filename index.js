'use strict';

/*global require*/
var version = require('./version');

var terriaOptions = {
    baseUrl: 'build/TerriaJS'
};
var configuration = {
    bingMapsKey: undefined, // use Cesium key
};

require('./TerriaMap.scss');

// Check browser compatibility early on.
// A very old browser (e.g. Internet Explorer 8) will fail on requiring-in many of the modules below.
// 'ui' is the name of the DOM element that should contain the error popup if the browser is not compatible
//var checkBrowserCompatibility = require('terriajs/lib/ViewModels/checkBrowserCompatibility');

// checkBrowserCompatibility('ui');

import GoogleAnalytics from 'terriajs/lib/Core/GoogleAnalytics';
import GoogleUrlShortener from 'terriajs/lib/Models/GoogleUrlShortener';
import isCommonMobilePlatform from 'terriajs/lib/Core/isCommonMobilePlatform';
import OgrCatalogItem from 'terriajs/lib/Models/OgrCatalogItem';
import raiseErrorToUser from 'terriajs/lib/Models/raiseErrorToUser';
import React from 'react';
import ReactDOM from 'react-dom';
import registerAnalytics from 'terriajs/lib/Models/registerAnalytics';
import registerCatalogMembers from 'terriajs/lib/Models/registerCatalogMembers';
import registerCustomComponentTypes from 'terriajs/lib/Models/registerCustomComponentTypes';
import registerKnockoutBindings from 'terriajs/lib/Core/registerKnockoutBindings';
import Terria from 'terriajs/lib/Models/Terria';
import updateApplicationOnHashChange from 'terriajs/lib/ViewModels/updateApplicationOnHashChange';
import updateApplicationOnMessageFromParentWindow from 'terriajs/lib/ViewModels/updateApplicationOnMessageFromParentWindow';
import ViewState from 'terriajs/lib/ReactViewModels/ViewState';
import BingMapsSearchProviderViewModel from 'terriajs/lib/ViewModels/BingMapsSearchProviderViewModel.js';
import GazetteerSearchProviderViewModel from 'terriajs/lib/ViewModels/GazetteerSearchProviderViewModel.js';
import GNAFSearchProviderViewModel from 'terriajs/lib/ViewModels/GNAFSearchProviderViewModel.js';

import AboutButton from './lib/Views/AboutButton';
import RelatedMaps from './lib/Views/RelatedMaps';

// Tell the OGR catalog item where to find its conversion service.  If you're not using OgrCatalogItem you can remove this.
OgrCatalogItem.conversionServiceBaseUrl = configuration.conversionServiceBaseUrl;

// Register custom Knockout.js bindings.  If you're not using the TerriaJS user interface, you can remove this.
registerKnockoutBindings();


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

terria.welcome = '<h3>Terria<sup>TM</sup> is a spatial data platform that provides spatial predictive analytics</h3><div class="body-copy"><p>This interactive map uses TerriaJS<sup>TM</sup>, an open source software library developed by Data61 for building rich, web-based geospatial data explorers.  It uses Cesium<sup>TM</sup> open source 3D globe viewing software.  TerriaJS<sup>TM</sup> is used for the official Australian Government NationalMap and many other sites rich in the use of spatial data.</p><p>This map also uses Terria<sup>TM</sup> Inference Engine, a cloud-based platform for making probabilistic predictions using data in a web-based mapping environment. Terria<sup>TM</sup> Inference Engine uses state of the art machine learning algorithms developed by Data61 and designed specifically for large-scale spatial inference.</p></div>';

// Create the ViewState before terria.start so that errors have somewhere to go.
const viewState = new ViewState({
    terria: terria
});

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
    defaultTo2D: isCommonMobilePlatform(),
    urlShortener: new GoogleUrlShortener({
        terria: terria
    })
}).otherwise(function(e) {
    raiseErrorToUser(terria, e);
}).always(function() {
<<<<<<< HEAD
    configuration.bingMapsKey = terria.configParameters.bingMapsKey ? terria.configParameters.bingMapsKey : configuration.bingMapsKey;
    configuration.digitalGlobeApiKey = terria.configParameters.digitalGlobeApiKey;

    // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
    updateApplicationOnHashChange(terria, window);
    updateApplicationOnMessageFromParentWindow(terria, window);

    // Create the map/globe.
    TerriaViewer.create(terria, { developerAttribution: terria.configParameters.developerAttribution });

    // We'll put the entire user interface into a DOM element called 'ui'.
    var ui = document.getElementById('ui');

    // Create the various base map options.
    var allBaseMaps = createGlobalBaseMapOptions(terria, configuration.bingMapsKey, configuration.digitalGlobeApiKey);
    var initialBaseMap = terria.configParameters.initialBaseMap || 'EOX Terrain';
    selectBaseMap(terria, allBaseMaps, initialBaseMap, true);

    // Create the Settings / Map panel.
    var settingsPanel = SettingsPanelViewModel.create({
        container: ui,
        terria: terria,
        isVisible: false,
        baseMaps: allBaseMaps
    });

    var brandBarElements = defaultValue(terria.configParameters.brandBarElements, [
            '',
            '<a target="_blank" href="http://www.leylines.ch/"><img src="images/leylines-logo.svg" height="68" alt="maps.leylines.ch" title="Version: ' + version + '"/></a>',
            ''
        ]);
    brandBarElements = brandBarElements.map(function(s) { return s.replace(/\{\{\s*version\s*\}\}/, version);});

    // Create the brand bar.
    BrandBarViewModel.create({
        container: ui,
        elements: brandBarElements
    });

    // Create the menu bar.
    MenuBarViewModel.create({
        container: ui,
        terria: terria,
        items: [
            // Add a Tools menu that only appears when "tools=1" is present in the URL.
            createToolsMenuItem(terria, ui),
            new MenuBarItemViewModel({
                label: 'Add data',
                tooltip: 'Add your own data to the map.',
                svgPath: svgPlus,
                svgPathWidth: 11,
                svgPathHeight: 12,
                callback: function() {
                    AddDataPanelViewModel.open({
                        container: ui,
                        terria: terria
                    });
                }
            }),
            new MenuBarItemViewModel({
                label: 'Base Maps',
                tooltip: 'Change the map mode (2D/3D) and base map.',
                svgPath: svgWorld,
                svgPathWidth: 17,
                svgPathHeight: 17,
                observableToToggle: knockout.getObservable(settingsPanel, 'isVisible')
            }),
            new MenuBarItemViewModel({
                label: 'Share',
                tooltip: 'Share your map with others.',
                svgPath: svgShare,
                svgPathWidth: 11,
                svgPathHeight: 13,
                callback: function() {
                    SharePopupViewModel.open({
                        container: ui,
                        terria: terria
                    });
                }
            }),
            new MenuBarItemViewModel({
                label: 'Related Maps',
                tooltip: 'View other maps in the leylines.ch family.',
                svgPath: svgRelated,
                svgPathWidth: 14,
                svgPathHeight: 13,
                callback: function() {
                    PopupMessageViewModel.open(ui, {
                        title: 'Related Maps',
                        message: require('./lib/Views/RelatedMaps.html'),
                        width: 600,
                        height: 430
                    });
                }
            }),
            new MenuBarItemViewModel({
                label: 'About',
                tooltip: 'About www.leylines.ch.',
                svgPath: svgInfo,
                svgPathWidth: 18,
                svgPathHeight: 18,
                svgFillRule: 'evenodd',
                href: 'http://www.leylines.ch/#about'
            })
        ]
    });

    // Create the lat/lon/elev and distance widgets.
    LocationBarViewModel.create({
        container: ui,
        terria: terria,
        mapElement: document.getElementById('cesiumContainer')
    });

    DistanceLegendViewModel.create({
        container: ui,
        terria: terria,
        mapElement: document.getElementById('cesiumContainer')
    });

    // Create the navigation controls.
    NavigationViewModel.create({
        container: ui,
        terria: terria
    });

    // Create the animation controls.
    AnimationViewModel.create({
        container: document.getElementById('cesiumContainer'),
        terria: terria,
        mapElementsToDisplace: [
            'cesium-widget-credits',
            'leaflet-control-attribution',
            'distance-legend',
            'location-bar'
        ]
    });

    var nowViewingTab = new NowViewingTabViewModel({
        nowViewing: terria.nowViewing
    });

    var isSmallScreen = document.body.clientWidth <= 700 || document.body.clientHeight <= 420;

    // Create the explorer panel.
    ExplorerPanelViewModel.create({
        container: ui,
        terria: terria,
        mapElementToDisplace: 'cesiumContainer',
        isOpen: !isSmallScreen && !terria.userProperties.hideExplorerPanel,
        tabs: [
            new DataCatalogTabViewModel({
                catalog: terria.catalog
            }),
            nowViewingTab,
            new SearchTabViewModel({
                searchProviders: [
                    new CatalogItemNameSearchProviderViewModel({
                        terria: terria
                    }),
                    new BingMapsSearchProviderViewModel({
                        terria: terria,
                        key: configuration.bingMapsKey
                    }),
                    new GazetteerSearchProviderViewModel({
                        terria: terria
                    }),
                    new GNAFSearchProviderViewModel({
                        terria: terria
                    })
                ]
            })
        ]
    });

    // Create the feature information popup.
    var featureInfoPanel = FeatureInfoPanelViewModel.create({
        container: ui,
        terria: terria
    });

    // Handle the user dragging/dropping files onto the application.
    DragDropViewModel.create({
        container: ui,
        terria: terria,
        dropTarget: document,
        allowDropInitFiles: true,
        allowDropDataFiles: true,
        validDropElements: ['ui', 'cesiumContainer'],
        invalidDropClasses: ['modal-background']
    });

    // Add a popup that appears the first time a catalog item is enabled,
    // calling the user's attention to the Now Viewing tab.
    NowViewingAttentionGrabberViewModel.create({
        container: ui,
        terria: terria,
        nowViewingTabViewModel: nowViewingTab
    });

    // Make sure only one panel is open in the top right at any time.
    MutuallyExclusivePanels.create({
        panels: [
            settingsPanel,
            featureInfoPanel
        ]
    });

    MapProgressBarViewModel.create({
        container: document.getElementById('cesiumContainer'),
        terria: terria
    });

    document.getElementById('loadingIndicator').style.display = 'none';

    // Show a modal disclaimer before user can do anything else.
    if (defined(terria.configParameters.globalDisclaimer)) {
        var globalDisclaimer = terria.configParameters.globalDisclaimer;
        var hostname = location.hostname;
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

            if(globalDisclaimer.confirmationRequired) {
                // To account for confirmation buttons
                options.height += 30;
                PopupMessageConfirmationViewModel.open(ui, options);
            } else {
                PopupMessageViewModel.open(ui, options);
            }
        }

    try {
        configuration.bingMapsKey = terria.configParameters.bingMapsKey ? terria.configParameters.bingMapsKey : configuration.bingMapsKey;

        viewState.searchState.locationSearchProviders = [
            new BingMapsSearchProviderViewModel({
                terria: terria,
                key: configuration.bingMapsKey
            }),
            new GazetteerSearchProviderViewModel({terria}),
            new GNAFSearchProviderViewModel({terria})
        ];

        // Automatically update Terria (load new catalogs, etc.) when the hash part of the URL changes.
        updateApplicationOnHashChange(terria, window);
        updateApplicationOnMessageFromParentWindow(terria, window);

        //temp
        var createAustraliaBaseMapOptions = require('terriajs/lib/ViewModels/createAustraliaBaseMapOptions');
        var createGlobalBaseMapOptions = require('terriajs/lib/ViewModels/createGlobalBaseMapOptions');
        var selectBaseMap = require('terriajs/lib/ViewModels/selectBaseMap');
        // Create the various base map options.
        var australiaBaseMaps = createAustraliaBaseMapOptions(terria);
        var globalBaseMaps = createGlobalBaseMapOptions(terria, configuration.bingMapsKey);

        var allBaseMaps = australiaBaseMaps.concat(globalBaseMaps);
        selectBaseMap(terria, allBaseMaps, 'Bing Maps Aerial with Labels', true);

        const customElements = {
            mapTop: [<RelatedMaps viewState={viewState}/>, <AboutButton />]
        };

        let render = () => {
            const StandardUserInterface = require('terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx');
            ReactDOM.render((
                <StandardUserInterface
                    terria={terria}
                    allBaseMaps={allBaseMaps}
                    viewState={viewState}
                    version={version}
                    customElements={customElements}
                />
            ), document.getElementById('ui'));
        };


        if (process.env.NODE_ENV === "development") {
            window.viewState = viewState;
        }

        if (module.hot && process.env.NODE_ENV !== "production") {
            // Support hot reloading of components
            // and display an overlay for runtime errors
            const renderApp = render;
            const renderError = (error) => {
                const RedBox = require('redbox-react');
                console.error(error);
                console.error(error.stack);
                ReactDOM.render(
                    <RedBox error={error} />,
                    document.getElementById('ui')
                );
            };
            render = () => {
                try {
                    renderApp();
                } catch (error) {
                    renderError(error);
                }
            };
            module.hot.accept('terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx', () => {
                setTimeout(render);
            });
        }

        render();
    } catch (e) {
        console.error(e);
        console.error(e.stack);
    }
});
