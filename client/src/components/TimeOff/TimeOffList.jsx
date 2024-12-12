import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TableTimeOff from "./TableTimeOff";
import ModalTimeOff from "./ModalTimeOff";
import Loading from "../Loading";
import { getListTimeOffRequest, getListTimeOffUser } from "../../api/timeOff";
import { getUser } from "../../utils/auth";

function TimeOffList() {
  const auth = getUser();
  const { id } = useParams();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [action, setAction] = useState("add");
  const [idEdit, setIdEdit] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModal = (type = "add", id = null) => {
    setIsModalOpen(!isModalOpen);
    setAction(type);
    setIdEdit(id);
  };

  const getListTimeOff = async (_page, _limit) => {
    try {
      setLoading(true);
      const result =
        location?.pathname === "/my-request-leave"
          ? await getListTimeOffRequest()
          : await getListTimeOffUser(id ? id : auth?._id);
      setData(result?.data?.data);
      setTotal(result?.data?.total);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePagination = (pagination) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
    getListTimeOff(current, pageSize);
  };

  useEffect(() => {
    getListTimeOff(page, limit);
  }, []);

  return (
    <div className="page-list">
      <div className="flex  justify-between">
        <div className="list_header">
          TimeOffs (<span>{total}</span>)
        </div>

        <Button type="primary" onClick={() => handleModal()}>
          Add Timeoff
          <PlusOutlined />
        </Button>
      </div>

      {isModalOpen && (
        <ModalTimeOff
          handleModal={handleModal}
          isModalOpen={isModalOpen}
          action={action}
          id={idEdit}
          getListTimeOff={() => getListTimeOff(page, limit)}
        />
      )}

      {loading ? (
        <Loading />
      ) : (
        <TableTimeOff
          data={data}
          page={page}
          limit={limit}
          total={total}
          loading={loading}
          handlePagination={handlePagination}
          getListTimeOff={() => getListTimeOff(page, limit)}
          handleModal={handleModal}
        />
      )}
    </div>
  );
}

export default TimeOffList;
