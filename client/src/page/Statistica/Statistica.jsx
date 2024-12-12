import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getMyListPayCheck } from "../../api/payCheck";
import BarChart from "./BarChart";

function Statistica() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLitPayCheck = async () => {
    setLoading(true);
    const payload = {
      page: 1,
      limit: 5,
      search: "",
    };
    try {
      const result = await getMyListPayCheck(payload);
      setData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLitPayCheck();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <BarChart payCheck={data} />;
}

export default Statistica;
