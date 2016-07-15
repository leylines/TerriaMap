import React from 'react';

import DropdownPanel from 'terriajs/lib/ReactViews/Map/Panels/DropdownPanel.jsx';
import DropdownStyles from 'terriajs/lib/ReactViews/Map/Panels/panel.scss';
import Styles from './related-maps.scss';
import classNames from 'classnames';

function RelatedMaps(props) {
    const dropdownTheme = {
        inner: Styles.dropdownInner
    };

    return (
        <DropdownPanel theme={dropdownTheme}
                       btnText="Related Maps"
                       viewState={props.viewState}
                       btnTitle="See related maps">
            <div className={classNames(DropdownStyles.header)}>
                <label className={DropdownStyles.heading}>Related Maps</label>
            </div>

            <p>
                Clicking on a map below will open it in a separate window or tab.
            </p>

            <div className={classNames(DropdownStyles.section, Styles.section)}>
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
        </DropdownPanel>
    );
}

RelatedMaps.propTypes = {
    viewState: React.PropTypes.object.isRequired
};

export default RelatedMaps;
