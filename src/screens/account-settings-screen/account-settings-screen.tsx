import React from 'react';
// import ErrorIcon from '@mui/icons-material/Error'
import LockIcon from '@mui/icons-material/Lock';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import MenuItem from 'components/menu-item';
import { PageWrapper } from 'components/page-wrapper';
import { DrawerContext } from 'context/providers/drawer-provider';
import { useNavigate } from 'react-router-dom';
import { ApplicationLocations } from 'types/common/applications-locations.dto';
import DeleteAccountDrawerContent from './components/delete-account-drawer-content';
import { AccountSettingsScreenTypeEnum } from './utils/account-settings-screen-type-enum.dto';

const AccountSettingsScreen = () => {
  const navigate = useNavigate();

  const { toggleDrawer } = React.useContext(DrawerContext);

  const handleDeleteAccountClick = React.useCallback(() => {
    toggleDrawer({
      open: true,
      content: <DeleteAccountDrawerContent />
    });
  }, []);

  return (
    <PageWrapper sxOverrides={{ alignItems: 'flex-start', px: 1, boxSizing: 'border-box' }}>
      <MenuItem
        label="Change password"
        type={AccountSettingsScreenTypeEnum.CHANGE_PASSWORD}
        icon={<LockIcon color="primary" />}
        headerRight={<></>}
        onMenuItemClick={() => navigate(ApplicationLocations.CHANGE_PASSWORD)}
      />
      <MenuItem
        label="Remove account"
        type={AccountSettingsScreenTypeEnum.DELETE_ACCOUNT}
        icon={<RemoveCircleIcon color="primary" />}
        headerRight={<></>}
        onMenuItemClick={handleDeleteAccountClick}
      />
    </PageWrapper>
  );
};

export default AccountSettingsScreen;
