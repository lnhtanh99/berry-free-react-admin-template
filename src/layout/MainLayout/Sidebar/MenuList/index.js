// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import adminItem from '../../../../menu-items/admin-items'
import userItem from '../../../../menu-items/user-items'
// ==============================|| SIDEBAR MENU LIST ||============================== //
import { AdminContext } from '../../../../context/adminContext';
import { useContext } from 'react';

const MenuList = () => {
    const { isAdmin, isUser, isMod } = useContext(AdminContext);

    const navItems = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const adminItems = adminItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const userItems = userItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{isAdmin || isMod ? adminItems : (isUser ? userItems : navItems)}</>;
};

export default MenuList;
