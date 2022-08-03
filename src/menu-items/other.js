// assets
import { IconSitemap, IconSettings, IconChecklist } from '@tabler/icons';

// constant
const icons = {IconSitemap, IconSettings, IconChecklist };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
    id: 'admin',
    type: 'group',
    children: [
        {
            id: 'set_role',
            title: 'Chỉnh sửa quyền',
            type: 'item',
            url: '/admin/role',
            icon: icons.IconSitemap,
            breadcrumbs: false
        },
        {
            id: 'change-role',
            title: 'Thay đổi phân quyền',
            type: 'item',
            url: '/admin/change-role',
            icon: icons.IconSitemap,
            breadcrumbs: false
        },
        {
            id: 'add_role',
            title: 'Thêm quyền',
            type: 'item',
            url: '/admin/add-role',
            icon: icons.IconSitemap,
            breadcrumbs: false
        },
        {
            id: 'confirm_change',
            title: 'Xác nhận thông tin khai báo',
            type: 'item',
            url: '/admin/confirm-change',
            icon: icons.IconChecklist,
            breadcrumbs: false
        },
        {
            id: 'edit',
            title: 'Chỉnh sửa',
            type: 'collapse',
            icon: icons.IconSettings,
            children: [
                {
                    id: 'add-injection-info',
                    title: 'Thông tin lây nhiễm',
                    type: 'item',
                    url: '/admin/add-injection-info',
                    breadcrumbs: false
                },
                {
                    id: 'material-icons',
                    title: 'Thông tin tiêm chủng',
                    type: 'item',
                    url: '/admin/add-info',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default other;
