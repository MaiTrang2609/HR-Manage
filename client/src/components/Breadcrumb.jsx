import React, { useEffect, useState } from "react";
import { Breadcrumb as BreadcrumbWrapper } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const pathName = location.pathname;

  const [items, setItems] = useState([]);

  const [listPath, setListPath] = useState([]);

  const navigate = useNavigate();

  const handeSetBreadcrumbs = () => {
    const breadcrumbs = pathName.slice(1).split("/");
    setListPath(breadcrumbs);
    let items = [
      {
        title: "Home",
      },
    ];

    if (breadcrumbs.length === 1 && breadcrumbs[0] === "") {
      setItems(items);
      return;
    }

    breadcrumbs.map((item, index) => {
      if (index == 2) return;
      const breadcrumb = {
        title: item.replace(/-/g, " "),
      };

      items.push(breadcrumb);
    });
    setItems(items);
  };

  const handeNavigate = (item) => {
    if (listPath[0] === "" || item === "Home") {
      navigate("/");
      return;
    }
    if (listPath[0] === item.replace(/\s+/g, "-")) {
      navigate(`/${listPath[0]}`);
    }
  };

  useEffect(() => {
    handeSetBreadcrumbs();
  }, [pathName, location]);

  return (
    <BreadcrumbWrapper
      style={{
        padding: "1rem",
        margin: "7rem 16px 0px 16px",
        background: "white",
        fontSize: "16px",
        fontWeight: "500",
        borderRadius: "5px",
      }}
      items={items}
      onClick={(item) => handeNavigate(item.target.innerHTML)}
    />
  );
}

export default Breadcrumb;
