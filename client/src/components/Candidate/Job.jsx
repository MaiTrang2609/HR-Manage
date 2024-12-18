import React from "react";
import styled from "styled-components";
import JobDetail from "./JobDetail";
import UploadCv from "./UploadCv";

function Job({ data }) {
  const today = new Date(); // Ngày hiện tại

  return (
    <Wrapper>
      {data?.map((item) => {
        const isExpired = new Date(item?.deadline) < today; // Check quá hạn

        return (
          <div className={`job ${isExpired ? "job-disable" : ""}`} key={item?._id}>
            <div className="title">{item?.title}</div>

            <div className="desc mt-auto">Số lượng tuyển: {item?.quantity}</div>

            <div className="desc">
              Hình thức: <span>{item?.type}</span>
            </div>

            <div className="desc">Kinh nghiệm: {item?.experience}</div>

            <div className="desc">Deadline: {item?.deadline}</div>

            <div className="button">
              {!isExpired && <JobDetail id={item?._id} />}
              {!isExpired && <UploadCv job={item} />}
            </div>
          </div>
        );
      })}
    </Wrapper>
  );
}

export default Job;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -2.5rem;
  .job-disable {
  background-color: #eeeeee !important;
  }
  .job {
    padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: calc(100% / 4 - 2.5rem);
    margin-left: 2.5rem;
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    line-height: 1.25;
    text-align: center;
    font-weight: 600;
  }

  .mt-auto {
    margin-top: auto;
  }

  .mt-1 {
    margin-top: 1rem;
  }

  .desc {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    span {
      text-transform: capitalize;
      margin-left: 0.25rem;
    }
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 0.75rem;
  }
`;
