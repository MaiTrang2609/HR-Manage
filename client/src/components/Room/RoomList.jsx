import React, { useEffect, useState } from "react";
import Search from "antd/es/input/Search";
import { debounce } from "lodash";
import TableRoom from "./TableRoom";
import Loading from "../Loading";
import { getListDoc } from "../../api/commonApi";

function RoomList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [keyWord, setKeyWord] = useState("");

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getListRoom = async (_page, _limit, _keyWord) => {
    setLoading(true);
    const payload = {
      page: _page,
      limit: _limit,
      search: _keyWord,
    };
    try {
      const result = await getListDoc("room", payload);
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
    getListRoom(page, limit, value);
  }, 1000);

  const handlePagination = (pagination) => {
    const { current, pageSize } = pagination;
    setPage(current);
    setLimit(pageSize);
    getListRoom(current, pageSize, keyWord);
  };

  useEffect(() => {
    getListRoom(page, limit, keyWord);
  }, []);

  return (
    <div className="page-list">
      <div className="list_header">
        Rooms (<span>{total}</span>)
      </div>
      <Search
        placeholder="Input search text"
        allowClear
        enterButton="Search"
        size="large"
        maxLength={200}
        className="input-search"
        onChange={handleSearch}
      />
      {loading ? (
        <Loading />
      ) : (
        <TableRoom
          data={data}
          page={page}
          limit={limit}
          total={total}
          handlePagination={handlePagination}
          loading={loading}
          getListRoom={() => getListRoom(page, limit, keyWord)}
        />
      )}
    </div>
  );
}

export default RoomList;
