import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const { user } = useSelector(({ auth }) => auth);
  return (
    <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
      {/* <a target="_blank" href={profileimg} rel="noreferrer">
        <Avatar
          src={profileimg}
          className="gx-size-40 gx-pointer gx-mr-3"
          alt=""
        />
      </a> */}
      <div>
        <div style={{ fontSize: 16, fontWeight: "bold" }}>{user.name}</div>
        <div>{`${user?.userType} ${user?.userType !== "admin" ? `(${user?.roleData?.name})` : ""}`}</div>
      </div>
      {/* <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
        <span className="gx-avatar-name">{profile.username}<i
          className="icon icon-chevron-down gx-fs-xxs gx-ml-2" /></span>
      </Popover> */}
    </div>
  );
};

export default UserProfile;
