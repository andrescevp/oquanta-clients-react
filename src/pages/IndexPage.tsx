import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrivateDashboard } from '../components/UI/templates/PrivateDashboard';

export const IndexPage: React.FC = () => {
    const { t } = useTranslation();

    return <PrivateDashboard>{t('DROP HERE THE STUFF')}</PrivateDashboard>;
};
