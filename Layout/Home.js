import {Route, Link, Switch, HashRouter} from 'react-router-dom';
import React, {useState, useEffect, useRef, useMemo} from 'react';
import Head from 'next/head';
// import 'antd/dist/antd.css';
import SideBar from '../components/SideBar/SideBar';
import {Layout, Button} from 'antd';
import Products from '../components/Products/products';
import CategoryPage from '../components/CategoryPage/index';
import SubCategoryPage from '../components/SubSubCategoryPage/index';
import ManageFiltersPage from '../components/ManageFiltersPage/index';
//import SubSubCategoryPage from '../components/SubSubCategoryPage/index';
import TopNaviBar from '../components/TopNaviBar/TopNaviBar';
import PrivateRoute from '../util/PrivateRoute';
import AddProduct from '../components/Products/AddProductModal/AddProductModal';
import EditProduct from '../components/Products/EditProductModal/EditProductModal';
import Dashboard from '../components/Dashboard/index';
import MainBanner from '../components/MainBanner/index';
import OtherBanner from '../components/OtherBanner/index';
import ContentPage from '../components/ContentPage/contentpage';
import AddContentPage from '../components/ContentPage/AddContentPage/AddContentPage';
import EditContentPage from '../components/ContentPage/ContentTable/EditContentModal/EditContentModal';
import ManageCatalogues from '../components/ManageCatalogues';
// import SubCategoryTitle from '../components/ManageSubcategoryTitle/index';
import SubCategoryTitle from '../components/NewManageSubcategoryTitle/index';
import ManageStock from '../components/ManageStock/index';
import ManageOrders from '../components/ManageOrders/index';
import ManageUser from '../components/ManageUser/index';
import ManageCreditUser from '../components/ManageCreditUser/index';
import CustomizablePreassembles from '../components/CustomizablePreassembles';
import ManageQuotations from '../components/ManageQuotations';
import dynamic from 'next/dynamic';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
const Test = dynamic(() => import('../components/Test'), {
  ssr: false,
});
import ManageIndustries from '../components/ManageIndustries';
import ManageAssemblySolutions from '../components/ManageAssemblySolutions';
import ManageBrands from '../components/ManageBrands';
import ManageCmsUser from '../components/ManageCMSUser';
import ManageStockPreassemblesCategory from '../components/ManageStockPreassemblesCategory';
import ManageStockPreassemblesProduct from '../components/ManageStockPreassemblesProduct/products';
import CustomizableCables from '../components/CustomizableCables';
import ProductFilters from '../components/ProductFilters/productFilters';
// import ManageSections from '../components/ManageSections/index';
// import TestTags from '../components/ManageSections/testtags';
const Test3 = dynamic(() => import('../components/Test3'), {
  ssr: false,
});

const {Header, Footer, Sider, Content} = Layout;

function NotFound() {
  return <h2>Not found</h2>;
}
function NotAuthorized() {
  return <h2>Not Authorized</h2>;
}

function App_() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState('');
  const TriggerSider = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email == 'admin@mail.com') {
      setIsAdmin(true);
    }
    if (user) {
      setUser(user.email);
    }
  }, []);
  return (
    <>
      <Head>
        <title>Sparky Admin</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Layout hasSider>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className={collapsed ? '' : 'sider'}
        >
          <div className="logo">
            {/* <img
              src={'https://tst-ui-web.koalacyrus.com/koala-logo.png'}
              width={105}
            ></img> */}
          </div>
          <SideBar />
        </Sider>

        <Layout>
          <TopNaviBar TriggerSider={TriggerSider} user={user} />
          <Content>
            <Switch>
              <PrivateRoute path="/manage/dashboard/" component={Dashboard} />
              <PrivateRoute path="/manage/products/" component={Products} />
              <PrivateRoute
                path="/manage/cust-terminals/"
                component={CustomizablePreassembles}
              />
              <PrivateRoute
                path="/manage/cust-cables/"
                component={CustomizableCables}
              />
              <PrivateRoute
                path="/manage/stock-pre-assembles-category/"
                component={ManageStockPreassemblesCategory}
              />
              <PrivateRoute
                path="/manage/stock-pre-assembles-product"
                component={ManageStockPreassemblesProduct}
              />
              <PrivateRoute
                path="/manage/manage-category/"
                component={CategoryPage}
              />
              <PrivateRoute
                path="/manage/manage-subcategorytitle"
                component={SubCategoryTitle}
              />
              <PrivateRoute
                path="/manage/manage-subcategory/"
                component={SubCategoryPage}
              />
              {/* <PrivateRoute
                path="/manage/manage-subsubcategory/"
                component={SubSubCategoryPage}
              /> */}
              {/* <PrivateRoute
                path="/manage/manage-subsubcategory/"
                component={SubSubCategoryPage}
              /> */}
              <PrivateRoute
                path="/manage/filters/"
                component={ManageFiltersPage}
              />
              <PrivateRoute
                path="/manage/product-filters/"
                component={ProductFilters}
              />
              <PrivateRoute
                path="/manage/industries/"
                component={ManageIndustries}
              />
              <PrivateRoute
                path="/manage/manage-assembly-solutions/"
                component={ManageAssemblySolutions}
              />

              <PrivateRoute path="/manage/brands/" component={ManageBrands} />
              <PrivateRoute
                path="/manage/add-product/"
                component={AddProduct}
              />
              <PrivateRoute
                path="/manage/edit-product/"
                component={EditProduct}
              />
              <PrivateRoute
                path="/manage/manage-mainbanner/"
                component={MainBanner}
              />
              <PrivateRoute
                path="/manage/manage-banner/"
                component={OtherBanner}
              />
              <PrivateRoute
                path="/manage/manage-content-page/"
                component={ContentPage}
              />
              <PrivateRoute
                path="/manage/add-content-page/"
                component={AddContentPage}
              />
              <PrivateRoute
                path="/manage/edit-content-page/"
                component={EditContentPage}
              />
              <PrivateRoute
                path="/manage/catalogues/"
                component={ManageCatalogues}
              />
              <PrivateRoute
                path="/manage/manage-subcategorytitle/"
                component={SubCategoryTitle}
              />
              <PrivateRoute
                path="/manage/manage-stock/"
                component={ManageStock}
              />
              <PrivateRoute path="/manage/orders/" component={ManageOrders} />
              <PrivateRoute
                path="/manage/manage-users/"
                component={ManageUser}
              />
              <PrivateRoute
                path="/manage/manage-credit-members/"
                component={ManageCreditUser}
              />
              {isAdmin ? (
                <PrivateRoute
                  path="/manage/manage-cms-users/"
                  component={ManageCmsUser}
                />
              ) : (
                <PrivateRoute
                  path="/manage/manage-cms-users/"
                  component={NotAuthorized}
                />
              )}
              <PrivateRoute
                path="/manage/change-password/"
                component={ManageCreditUser}
              />
              <PrivateRoute
                path="/manage/quotations/"
                component={ManageQuotations}
              />
              <PrivateRoute path="/manage/test" component={Test} />
              {/* <PrivateRoute path="/manage/sections" component={TestTags} /> */}
              {/* <PrivateRoute
                path="/manage/sections"
                component={ManageSections}
              /> */}
              {/* <PrivateRoute path="/manage/test2" component={TestTags} /> */}
              <PrivateRoute path="/manage/test3" component={Test3} />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App_;
