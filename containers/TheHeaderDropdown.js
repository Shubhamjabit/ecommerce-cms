import React from 'react';
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from '@coreui/react';
import {CIcon} from '@coreui/icons-react';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
const TheHeaderDropdown = () => {
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          {/* <CImg
            // src={"avatars/6.jpg"}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          /> */}
          <UserOutlined />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Account</strong>
        </CDropdownItem>

        <CDropdownItem>
          {/* <CIcon name="cil-list" size="2xl"/> */}
          {/* <CIcon name="cil-account-logout" className="mfe-2" /> */}
          <LogoutOutlined className="logout-outlined-icon" />
          Logout Account
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};
export default TheHeaderDropdown;
