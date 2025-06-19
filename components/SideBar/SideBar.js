import React, {useState, useEffect} from 'react';
import {
  LineChartOutlined,
  ShoppingOutlined,
  HeartOutlined,
  PictureOutlined,
  TagOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  ContainerOutlined,
  DashboardOutlined,
  FormOutlined,
  StockOutlined,
  FilterOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {Route, Link, Switch, HashRouter} from 'react-router-dom';
import {Tabs, Menu, Button} from 'antd';
import styles from './SideBar.module.scss';
import {useSelector, useDispatch} from 'react-redux';
import {
  setLocation,
  setLocationLink,
} from '../../store/actions/locationUpdateAction';
const {SubMenu} = Menu;
const {TabPane} = Tabs;

const SideBar = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const callback = (key) => {
    console.log(key);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email == 'admin@mail.com') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <div className={styles.Menu}>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        className={styles.Menu}
      >
        <Menu.Item
          key="1"
          icon={<DashboardOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Dashboard'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/dashboard">Dashboard</Link>
        </Menu.Item>

        <SubMenu
          key="sub2"
          className={styles.MenuItem}
          icon={<UnorderedListOutlined />}
          title="Manage Category"
        >
          <Menu.Item
            key="2"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Category'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-category">Category</Link>
          </Menu.Item>
          <Menu.Item
            key="14"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Sub Category Title'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-subcategorytitle">Sub Category Title</Link>
          </Menu.Item>
          <Menu.Item
            key="9"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Filter'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/filters">Filters</Link>
          </Menu.Item>
          {/* <Menu.Item
            key="23"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Product Filters'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/product-filters">Product Filters</Link>
          </Menu.Item> */}

          {/* <Menu.Item
            key="3"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Sub Category'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-subcategory">Sub Category</Link>
          </Menu.Item> */}
          {/* <Menu.Item
            key="10"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Sub Category Title'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-subcategorytitle">Sub Category Title</Link>
          </Menu.Item> */}
          <Menu.Item
            key="4"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Sub Category'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-subcategory">Sub Category</Link>
          </Menu.Item>
        </SubMenu>
        <Menu.Item
          key="15"
          icon={<UnorderedListOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Industries'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/industries">Manage Industries</Link>
        </Menu.Item>
        <Menu.Item
          key="22"
          icon={<UnorderedListOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Assembly Solutions'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/manage-assembly-solutions">
            Manage Assembly Solutions
          </Link>
        </Menu.Item>
        <Menu.Item
          key="16"
          icon={<UnorderedListOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Brands'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/brands">Manage Brands</Link>
        </Menu.Item>

        <Menu.Item
          key="23"
          icon={<ShoppingOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Product Filters'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/product-filters">Manage Product Filters</Link>
        </Menu.Item>

        <Menu.Item
          key="5"
          icon={<ShoppingOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Product'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/products">Manage Product</Link>
        </Menu.Item>
        {/* <SubMenu
          key="sub5"
          className={styles.MenuItem}
          icon={<UnorderedListOutlined />}
          title="Manage Stock Pre-Assembles"
        >
          <Menu.Item
            key="20"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Stock Pre-Assembles Category'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/stock-pre-assembles-category">Category</Link>
          </Menu.Item>
          <Menu.Item
            key="21"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Stock Pre-Assembles Product'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/stock-pre-assembles-product">Product</Link>
          </Menu.Item>
        </SubMenu> */}
        <SubMenu
          key="sub5"
          className={styles.MenuItem}
          icon={<UnorderedListOutlined />}
          title="Customizable Pre-Assembles"
        >
          <Menu.Item
            key="18"
            icon={<ShoppingOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Customizable Terminals'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/cust-terminals/">Customizable Terminals</Link>
          </Menu.Item>
          <Menu.Item
            key="20"
            icon={<ShoppingOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Customizable Cables'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/cust-cables/">Customizable Cables</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub3"
          className={styles.MenuItem}
          icon={<FormOutlined />}
          title="Manage Content"
        >
          <Menu.Item
            key="6"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Home Banner'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-mainbanner">Home Banner</Link>
          </Menu.Item>
          <Menu.Item
            key="8"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Content Page'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-content-page">Manage Content</Link>
          </Menu.Item>
          <Menu.Item
            key="17"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Catalogues'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/catalogues">Manage Catalogues</Link>
          </Menu.Item>
          {/* <Menu.Item
            key="7"
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Banner'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-banner">Banner</Link>
          </Menu.Item> */}
        </SubMenu>

        <Menu.Item
          key="10"
          icon={<StockOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Stock'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/manage-stock">Manage Stock</Link>
        </Menu.Item>
        <Menu.Item
          key="11"
          icon={<ShoppingCartOutlined />}
          className={styles.MenuItem}
          onClick={() => {
            dispatch(setLocation('Manage Orders'));
            dispatch(setLocationLink('/manage/'));
          }}
        >
          <Link to="/manage/orders">Manage Orders</Link>
        </Menu.Item>

        <SubMenu
          key="sub4"
          className={styles.MenuItem}
          icon={<FormOutlined />}
          title="Customers"
        >
          <Menu.Item
            key="12"
            icon={<UserOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Customers'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-users">Manage Customers</Link>
          </Menu.Item>
          <Menu.Item
            key="13"
            icon={<UserOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Credit Members'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/manage-credit-members">
              Manage Credit Members
            </Link>
          </Menu.Item>
          <Menu.Item
            key="21"
            icon={<UserOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Manage Quotations'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/quotations">Manage Quotations</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub6"
          className={styles.MenuItem}
          icon={<UnorderedListOutlined />}
          title="Settings"
        >
          {isAdmin && (
            <Menu.Item
              key="19"
              icon={<UserOutlined />}
              className={styles.MenuItem}
              onClick={() => {
                dispatch(setLocation('Manage CMS Users'));
                dispatch(setLocationLink('/manage/'));
              }}
            >
              <Link to="/manage/manage-cms-users">Manage CMS Users</Link>
            </Menu.Item>
          )}
          {/* <Menu.Item
            key="21"
            icon={<UserOutlined />}
            className={styles.MenuItem}
            onClick={() => {
              dispatch(setLocation('Change Password'));
              dispatch(setLocationLink('/manage/'));
            }}
          >
            <Link to="/manage/change-password">Change Password</Link>
          </Menu.Item> */}
        </SubMenu>
      </Menu>
    </div>
  );
};

export default SideBar;
