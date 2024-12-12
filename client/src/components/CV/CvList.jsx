import React, { useEffect, useState } from "react";
import TableCv from "./TableCv";
import Loading from "../Loading";
import { getListDoc } from "../../api/commonApi";
import { Button, Select } from "antd";
import { useParams } from "react-router-dom";
import { getMyCv } from "../../api/cv";
import { getUser } from "../../utils/auth";
import { sendEmail } from "../../api/email";

function CvList() {
  const { id } = useParams();

  const listType = [
    {
      id: 1,
      value: "pending",
      label: "Pending",
    },
    {
      id: 2,
      value: "viewed",
      label: "Viewed",
    },
    {
      id: 3,
      value: "failed",
      label: "Failed",
    },
    {
      id: 4,
      value: "passed",
      label: "Passed",
    },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [job, setJob] = useState(null);
  const [type, setType] = useState(null);

  const [email, setEmail] = useState([]);
  const [listEmail, setListEmail] = useState([]);

  const [listJob, setListJob] = useState([]);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const auth = getUser();

  const getListCv = async (_page, _limit, _job, _type) => {
    setLoading(true);
    const payload = {
      page: _page,
      limit: _limit,
      job: _job,
      status: _type,
    };
    try {
      const result =
        auth?.type === "outsite"
          ? await getMyCv(payload)
          : await getListDoc("cv", payload);
      setTotal(result?.data?.total);
      setData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePagination = (pagination) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
    getListCv(current, pageSize, job, type);
  };

  useEffect(() => {
    getListCv(page, limit, job, type);
  }, [job, type]);

  useEffect(() => {
    id && setJob(id);
    !id && getListJob();
  }, [id]);

  useEffect(() => {
    auth?.type === "staff" && getListEmail();
  }, []);

  const getListEmail = async () => {
    const result = await getListDoc("email");
    setListEmail(result?.data?.data);
  };
  const getListJob = async () => {
    const result = await getListDoc("job");
    setListJob(result?.data?.data);
  };

  const handleSendMail = async () => {
    const toEmail = data?.map((item) => item.user.email);
    const form = {
      to: toEmail,
      email,
    };
    await sendEmail(form);
  };

  return (
    <div className="page-list">
      <div className="list_header">
        CVs (<span>{total}</span>)
      </div>

      {!id && (
        <div className="flex justify-between">
          <div className="flex gap-1">
            <Select
              onChange={(data) => {
                setJob(data);
              }}
              style={{ width: "16rem", marginBottom: "1rem" }}
              placeholder="Choose job"
              allowClear
            >
              {listJob?.map((item) => {
                return (
                  <Select.Option key={item._id} value={item._id}>
                    {item.title}
                  </Select.Option>
                );
              })}
            </Select>
            <Select
              onChange={(data) => {
                setType(data);
              }}
              style={{ width: "16rem", marginBottom: "1rem" }}
              placeholder="Choose type"
              allowClear
            >
              {listType?.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </div>

          <div className="flex gap-1">
            {auth.type === "staff" && (
              <>
                <Select
                  onChange={(data) => {
                    setEmail(data);
                  }}
                  style={{ width: "16rem", marginBottom: "1rem" }}
                  placeholder="Choose Email"
                  allowClear
                >
                  {listEmail?.map((item) => {
                    return (
                      <Select.Option key={item._id} value={item._id}>
                        {item.title}
                      </Select.Option>
                    );
                  })}
                </Select>
                <Button
                  type="primary"
                  onClick={() => handleSendMail()}
                  disabled={!type || !job || !email || total == 0}
                >
                  Send email
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : (
        <TableCv
          data={data}
          page={page}
          limit={limit}
          total={total}
          handlePagination={handlePagination}
          loading={loading}
          getLitCv={() => getListCv(page, limit, job, type)}
        />
      )}
    </div>
  );
}

export default CvList;
