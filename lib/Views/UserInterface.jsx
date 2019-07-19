import {
  Menu,
  Nav,
  ExperimentalMenu
} from "leylinesjs/lib/ReactViews/StandardUserInterface/customizable/Groups";
import MeasureTool from "leylinesjs/lib/ReactViews/Map/Navigation/MeasureTool";
import MenuItem from "leylinesjs/lib/ReactViews/StandardUserInterface/customizable/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import RelatedMaps from "./RelatedMaps";
import SplitPoint from "leylinesjs/lib/ReactViews/SplitPoint";
import Donate from './Donate';
import StandardUserInterface from "leylinesjs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx";
import version from "../../version";

import "./global.scss";

function loadAugmentedVirtuality(callback) {
  require.ensure(
    "leylinesjs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool",
    () => {
      const AugmentedVirtualityTool = require("leylinesjs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool");
      callback(AugmentedVirtualityTool);
    },
    "AugmentedVirtuality"
  );
}

function isBrowserSupportedAV() {
  return /Android|iPhone|iPad/i.test(navigator.userAgent);
}

export default function UserInterface(props) {
  return (
    <StandardUserInterface {...props} version={version}>
      <Menu>
        <RelatedMaps viewState={props.viewState} />
        <MenuItem caption="About" href="http://www.leylines.ch/index.html#about" key="about-link" />
      </Menu>
      <Nav>
        <MeasureTool terria={props.viewState.terria} key="measure-tool" />
      </Nav>
      <ExperimentalMenu>
        <If condition={isBrowserSupportedAV()}>
          <SplitPoint
            loadComponent={loadAugmentedVirtuality}
            viewState={props.viewState}
            terria={props.viewState.terria}
            experimentalWarning={true}
          />
        </If>
      </ExperimentalMenu>
    </StandardUserInterface>
  );
}

UserInterface.propTypes = {
  terria: PropTypes.object,
  viewState: PropTypes.object
};
