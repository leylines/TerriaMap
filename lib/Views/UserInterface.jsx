import React from 'react';

import version from '../../version';

import StandardUserInterface from 'leylinesjs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'leylinesjs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import RelatedMaps from './RelatedMaps';
import { Menu } from 'leylinesjs/lib/ReactViews/StandardUserInterface/customizable/Groups';
import { Nav } from 'leylinesjs/lib/ReactViews/StandardUserInterface/customizable/Groups';
import MeasureTool from 'leylinesjs/lib/ReactViews/Map/Navigation/MeasureTool';
import AugmentedVirtualityTool from 'leylinesjs/lib/ReactViews/Map/Navigation/AugmentedVirtualityTool';

import './global.scss';

export default function UserInterface(props) {
    return (
        <StandardUserInterface {... props} version={version}>
            <Menu>
                <RelatedMaps viewState={props.viewState} />
                <MenuItem caption="About" href="http://www.leylines.ch/index.html#about" key="about-link"/>
            </Menu>
            <Nav>
                <MeasureTool terria={props.viewState.terria} key="measure-tool"/>
            </Nav>
        </StandardUserInterface>
    );
}
