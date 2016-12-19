import React from 'react';

import MenuPanel from 'leylinesjs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx';
import PanelStyles from 'leylinesjs/lib/ReactViews/Map/Panels/panel.scss';
import Styles from './related-maps.scss';
import classNames from 'classnames';

function RelatedMaps(props) {
    const dropdownTheme = {
        inner: Styles.dropdownInner
    };

    return (
        <MenuPanel theme={dropdownTheme}
                   btnText="Related Maps"
                   smallScreen={props.smallScreen}
                   viewState={props.viewState}
                   btnTitle="See related maps">
            <div className={classNames(PanelStyles.header)}>
                <label className={PanelStyles.heading}>Related Maps</label>
            </div>

            <p>
                Clicking on a map below will open it in a separate window or tab.
            </p>

            <div className={classNames(PanelStyles.section, Styles.section)}>
                <a target="_blank" href="http://megalithic.co.uk/">
                    <img className={Styles.image} src={require('../../wwwroot/images/megalithic/megalithic_logo_150.gif')}
                         alt="megalithic.co.uk"/>
                </a>

                <a target="_blank" className={Styles.link} href="http://megalithic.co.uk/">megalithic.co.uk</a>

                <p>
                    The top destination for Megaliths and Prehistory worldwide. World-wide Ancient Site Database,
                    Photos and Prehistoric Archaeology News with geolocation.
                </p>
            </div>
        </MenuPanel>
    );
}

RelatedMaps.propTypes = {
    viewState: React.PropTypes.object.isRequired,
    smallScreen: React.PropTypes.bool
};

export default RelatedMaps;
