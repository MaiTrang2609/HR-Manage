import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { handleMenu } from "../utils/menu";
import MenuItem from "antd/es/menu/MenuItem";
import { clearUser, getUser } from "../utils/auth";
import Header from "../components/Header";
// import avatar from "../assets/image/gem.png";
import avatar from "../assets/image/avatar.jpg";
import Breadcrumb from "../components/Breadcrumb";

const { Content, Sider } = Layout;

const AuthRoute = () => {
  const [activeKey, setActiveKey] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const [collapsed, setCollapsed] = useState(false);
  const auth = getUser();

  const handeActiveMenu = () => {
    const breadcrumb = pathName.slice(1).split("/")[0];
    const activeMenu = handleMenu(auth?.role).find(
      (item) => item.path === "/" + breadcrumb
    );
    setActiveKey(activeMenu?.key || 1);
  };

  useEffect(() => {
    handeActiveMenu();
  }, [pathName]);

  useEffect(() => {
    if (!auth) {
      clearUser();
      navigate("/login");
      return;
    }
  }, [navigate, auth]);

  return (
    <Layout>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="d-flex-center">
          <img src={avatar} alt="" className="logo-menu" />
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeKey + ""]}
          mode="inline"
          onClick={(item) => {
            navigate(handleMenu(auth?.role)[item.key - 1].path);
          }}
          className="menu"
        >
          {handleMenu(auth?.role).map((item) => {
            return (
              <MenuItem key={item.key} icon={item.icon}>
                {item.label}
              </MenuItem>
            );
          })}
        </Menu>
      </Sider>
      <Layout
        className={
          collapsed ? "ml-80 transition-menu" : "ml-200 transition-menu"
        }
      >
        <Header />
        <Content>
          {pathName !== "/" && <Breadcrumb />}
          <div style={{ padding: "16px" }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default AuthRoute;
