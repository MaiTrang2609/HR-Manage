import React from "react";
import { Routes, Route } from "react-router-dom";
import TimeOffList from "./components/TimeOff/TimeOffList";
import {
  Login,
  DashBoard,
  User,
  UserInfo,
  Division,
  DivisionInfo,
  Room,
  RoomInfo,
  Job,
  JobInfo,
  CvManage,
  AnnualLeave,
  AnnualLeaveInfo,
  PayCheck,
  PayCheckInfo,
  PositionInfo,
  Position,
  Email,
  EmailInfo,
  Statistica,
  Profile,
} from "./page";
import JobCadidate from "./page/Candidate/JobCadidate";
import SignUp from "./page/Signup";
import AuthRoute from "./router/AuthRoute";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/sign-up" element={<SignUp />} />
      <Route exact path="/" element={<AuthRoute />}>
        <Route exact path="/" element={<DashBoard />} />
        <Route exact path="/Profile" element={<Profile />} />

        <Route element={<ProtectedRoute roles={["admin", "hr"]} />}>
          <Route exact path="/room" element={<Room />} />
          <Route exact path="/room/:action" element={<RoomInfo />} />
          <Route exact path="/room/:action/:id" element={<RoomInfo />} />
          <Route exact path="/division" element={<Division />} />
          <Route exact path="/division/:action" element={<DivisionInfo />} />
          <Route
            exact
            path="/division/:action/:id"
            element={<DivisionInfo />}
          />

          <Route exact path="/position" element={<Position />} />
          <Route exact path="/position/:action" element={<PositionInfo />} />
          <Route
            exact
            path="/position/:action/:id"
            element={<PositionInfo />}
          />

          <Route exact path="/job" element={<Job />} />
          <Route exact path="/job/:action" element={<JobInfo />} />
          <Route exact path="/job/:action/:id" element={<JobInfo />} />

          <Route exact path="/cv" element={<CvManage />} />

          <Route exact path="/pay-check" element={<PayCheck />} />
          <Route exact path="/pay-check/:action" element={<PayCheckInfo />} />
          <Route
            exact
            path="/pay-check/:action/:id"
            element={<PayCheckInfo />}
          />

          <Route exact path="/annual-leave" element={<AnnualLeave />} />
          <Route
            exact
            path="/annual-leave/:action"
            element={<AnnualLeaveInfo />}
          />
          <Route
            exact
            path="/annual-leave/:action/:id"
            element={<AnnualLeaveInfo />}
          />
        </Route>

        <Route element={<ProtectedRoute roles={["dm"]} />}>
          <Route exact path="/user" element={<User />} />
          <Route exact path="/user/:action" element={<UserInfo />} />
          <Route exact path="/user/:action/:id" element={<UserInfo />} />
        </Route>

        {/* /////////////////////////// */}

        <Route element={<ProtectedRoute roles={["hr"]} />}>
          <Route exact path="/job" element={<Job />} />
          <Route exact path="/job/:action" element={<JobInfo />} />
          <Route exact path="/job/:action/:id" element={<JobInfo />} />
          <Route exact path="/cv" element={<CvManage />} />
          <Route exact path="/email" element={<Email />} />
          <Route exact path="/email/:action" element={<EmailInfo />} />
          <Route exact path="/email/:action/:id" element={<EmailInfo />} />
        </Route>

        {/* /////////////////////////// */}
        <Route element={<ProtectedRoute roles={["dm"]} />}>
          <Route exact path="/my-request-leave/" element={<TimeOffList />} />
        </Route>

        {/* ///////////////////// */}

        <Route element={<ProtectedRoute roles={["candidate"]} />}>
          <Route exact path="/job-candidate" element={<JobCadidate />} />
          <Route exact path="/my-cv" element={<CvManage />} />
        </Route>

        {/* //////////////////////// */}

        <Route element={<ProtectedRoute roles={["employee", "dm", "hr"]} />}>
          <Route exact path="/my-annual-leave/" element={<AnnualLeaveInfo />} />
          <Route exact path="/my-pay-check" element={<PayCheck />} />
          <Route
            exact
            path="/my-pay-check/view/:id"
            element={<PayCheckInfo />}
          />

          <Route exact path="/statistica" element={<Statistica />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
