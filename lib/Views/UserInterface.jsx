import React from 'react';

import version from '../../version';

import StandardUserInterface from 'terriajs/lib/ReactViews/StandardUserInterface/StandardUserInterface.jsx';
import MenuItem from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuItem';
import RelatedMaps from './RelatedMaps';
import About from './AboutButton';
import MenuPanel from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel';
import { Menu } from 'terriajs/lib/ReactViews/StandardUserInterface/customizable/Groups';

import './global.scss';

export default function UserInterface(props) {
    return (
        <StandardUserInterface {... props} version={version}>
            <Menu>
                <RelatedMaps viewState={props.viewState} />
                <About viewState={props.viewState} />
            </Menu>
        </StandardUserInterface>
    );
}
