import { Button, Image, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const NoFoundPage = () => {
  const history = useHistory();
  const { user } = useSelector(({ auth }) => auth);
  const [firstPage, setFirstPage] = useState({
    tabName: "Dashboard",
    tabUrl: "dashboard"
  });

  const redeirectToFirstPage = () => {
    const firstPage = user?.tabPermission?.filter(item => item.view && item.isActive);
    if(firstPage?.length > 0) {
      setFirstPage({
        tabName: firstPage[0].tabId.displayName,
        tabUrl: firstPage[0].tabId.tabUrl
      })
    } else {
      setFirstPage({
        tabName: "Error Page",
        tabUrl: "erropage"
      })
    }
  }

  useEffect(() => {
    redeirectToFirstPage();
  }, [user]);

  return (
    <>
      <div className="gx-mt-5 gx-text-center">
        <div className="gx-mb-30">
          <Image
            preview={false}
            src="/assets/images/401.png"
            alt="loader"
            width={"250px"}
          />
        </div>
        <>
          <Typography.Title level={3}>Whoops! Unauthorized</Typography.Title>
          <Typography.Text>
            {
              "it's looking like you may have taken a wrong turn. Don't worry... it happens to the best of us. you might not have permission to access this page or page not found and click on Back to "+firstPage?.tabName+". Here's a little tip that might help you get back on track."
            }
          </Typography.Text>
        </>

        <div className="gx-mt-3">
          <Button
            onClick={() => {
              history.push("/"+firstPage?.tabUrl);
            }}
            type="primary"
          >
            Back to {firstPage?.tabName}
          </Button>
        </div>
      </div>
    </>
  );
};

export default NoFoundPage;
