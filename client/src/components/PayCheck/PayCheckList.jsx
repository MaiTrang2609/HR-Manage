import React, { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { debounce } from "lodash";
import TablePayCheck from "./TablePayCheck";
import Loading from "../Loading";
import { getListDoc } from "../../api/commonApi";
import { getMyListPayCheck } from "../../api/payCheck";
function PayCheckList({ auth }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyWord, setKeyWord] = useState("");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getListPayCheck = async (_page, _limit, _keyWord) => {
    setLoading(true);
    const payload = {
      page: _page,
      limit: _limit,
      search: _keyWord,
    };
    try {
      const result = ["admin"]?.includes(auth?.role)
        ? await getListDoc("pay-check", payload)
        : await getMyListPayCheck(payload);
      setTotal(result?.data?.total);
      setData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setKeyWord(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((value) => {
    getListPayCheck(page, limit, value);
  }, 1000);

  const handlePagination = (pagination) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
    getListPayCheck(current, pageSize, keyWord);
  };

  useEffect(() => {
    getListPayCheck(page, limit, keyWord);
  }, []);

  return (
    <div className="page-list">
      <div className="list_header">
        PayChecks (<span>{total}</span>)
      </div>
      <Search
        placeholder="Input search text"
        allowClear
        enterButton="Search"
        size="large"
        // onSearch={handeSearch}
        maxLength={200}
        className="input-search"
        onChange={handleSearch}
      />
      {loading ? (
        <Loading />
      ) : (
        <TablePayCheck
          data={data}
          page={page}
          limit={limit}
          total={total}
          handlePagination={handlePagination}
          loading={loading}
          getListPayCheck={() => getListPayCheck(page, limit, keyWord)}
        />
      )}
    </div>
  );
}

export default PayCheckList;
