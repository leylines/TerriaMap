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
                   btnText="Donate"
                   smallScreen={props.smallScreen}
                   viewState={props.viewState}
                   btnTitle="Support Leylines">
            <div className={classNames(PanelStyles.header)}>
                <label className={PanelStyles.heading}>Make donation</label>
            </div>

            <p>
                Clicking on the image will open it in a separate window or tab.
            </p>

            <div className={classNames(PanelStyles.section, Styles.section)}>
                <a target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=joerg%40roth-doggwiler.ch&lc=US&item_name=Leylines&item_number=maps&currency_code=USD&bn=PP-DonationsBF%3Abtn_donateCC_LG.gif%3ANonHosted">
                    <img className={Styles.image} src={require('https://www.paypalobjects.com/webstatic/en_US/i/btn/png/btn_donate_92x26.png')}
                         alt="Paypal donation"/>
                </a>

                <a target="_blank" className={Styles.link} href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=joerg%40roth-doggwiler.ch&lc=US&item_name=Leylines&item_number=maps&currency_code=USD&bn=PP-DonationsBF%3Abtn_donateCC_LG.gif%3ANonHosted">Donate!</a>

                <p>
                    Please support me with a donation,
                    Support me.
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
