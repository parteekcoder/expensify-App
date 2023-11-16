import lodashGet from 'lodash/get';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import CategoryPicker from '@components/CategoryPicker';
import transactionPropTypes from '@components/transactionPropTypes';
import useLocalize from '@hooks/useLocalize';
import compose from '@libs/compose';
import Navigation from '@libs/Navigation/Navigation';
import reportPropTypes from '@pages/reportPropTypes';
import useThemeStyles from '@styles/useThemeStyles';
import * as IOU from '@userActions/IOU';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import IOURequestStepRoutePropTypes from './IOURequestStepRoutePropTypes';
import StepScreenWrapper from './StepScreenWrapper';
import withWritableReportOrNotFound from './withWritableReportOrNotFound';

const propTypes = {
    /** Navigation route context info provided by react navigation */
    route: IOURequestStepRoutePropTypes.isRequired,

    /* Onyx Props */
    /** Holds data related to Money Request view state, rather than the underlying Money Request data. */
    transaction: transactionPropTypes,

    /** The report attached to the transaction */
    report: reportPropTypes,
};

const defaultProps = {
    report: {},
    transaction: {},
};

function IOURequestStepCategory({
    report,
    route: {
        params: {transactionID, backTo},
    },
    transaction,
}) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const navigateBack = () => {
        Navigation.goBack(backTo || ROUTES.HOME);
    };

    /**
     * @param {Object} category
     * @param {String} category.searchText
     */
    const updateCategory = (category) => {
        IOU.setMoneyRequestCategory_temporaryForRefactor(transactionID, category.searchText);
        navigateBack();
    };

    return (
        <StepScreenWrapper
            headerTitle={translate('common.category')}
            onBackButtonPress={navigateBack}
            shouldShowWrapper
            testID={IOURequestStepCategory.displayName}
        >
            <Text style={[styles.ph5, styles.pv3]}>{translate('iou.categorySelection')}</Text>
            <CategoryPicker
                selectedCategory={transaction.category}
                policyID={report.policyID}
                onSubmit={updateCategory}
            />
        </StepScreenWrapper>
    );
}

IOURequestStepCategory.displayName = 'IOURequestStepCategory';
IOURequestStepCategory.propTypes = propTypes;
IOURequestStepCategory.defaultProps = defaultProps;

export default compose(
    withWritableReportOrNotFound,
    withOnyx({
        transaction: {
            key: ({route}) => `${ONYXKEYS.COLLECTION.TRANSACTION_DRAFT}${lodashGet(route, 'params.transactionID')}`,
        },
    }),
)(IOURequestStepCategory);
