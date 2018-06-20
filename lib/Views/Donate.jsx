import React from 'react';
import PropTypes from 'prop-types';

import MenuPanel from 'leylinesjs/lib/ReactViews/StandardUserInterface/customizable/MenuPanel.jsx';
import PanelStyles from 'leylinesjs/lib/ReactViews/Map/Panels/panel.scss';
import Styles from './donate.scss';
import classNames from 'classnames';

function Donate(props) {
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
                    <img className={Styles.image} src={require('../../wwwroot/images/related/btn_donate_92x26.png')}
                         alt="Paypal donation"/>
                </a>
                <p>
                    www.leylines.ch is a non commercial site. The purpose of this site is the preservation, enhancement and research of old and new knowledge about global and local leylines. Please consider supporting me with a donation.
                </p>
            </div>
        </MenuPanel>
    );
}

Donate.propTypes = {
    viewState: PropTypes.object.isRequired,
    smallScreen: PropTypes.bool
};

export default Donate;
