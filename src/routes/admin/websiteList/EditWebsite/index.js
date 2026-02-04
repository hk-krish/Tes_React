import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../../Notification";
import {
  fetchPaymentGateway,
  fetchTransactionType,
} from "../../../../appRedux/actions";
import {
  fetchActiveTab,
  fetthAllWebsiteList,
} from "../../../../appRedux/actions/EntityPayment";
import { fetchVendorData } from "../../../../appRedux/actions/Website";
import EntityGetwayForm from "../../../../components/EntityGetwayForm";
import WebsiteAssignVendor from "../../../../components/WebsiteAssignVendor";
import WebsiteForm from "../../../../components/WebsiteForm";
import AgentService from "../../../../service/AgentService";
import PaymentGetway from "../../../../service/PaymentService";
import VendorService from "../../../../service/VendorService";
import WebsiteService from "../../../../service/WebsiteService";
import CryptoFundWallet from "../../../../components/WebsiteForm/CryptoFundWallet";
import VideoURL from "../../../../components/WebsiteForm/VideoURL";

const { TabPane } = Tabs;

const AddWebsite = (props) => {
  const title =
    props.location.pathname === "/websites/editwebsite"
      ? "Edit Website"
      : "Add Website";
  const dispatch = useDispatch();
  const { activeTab } = useSelector(({ entityPayment }) => entityPayment);
  const [dataLoad, setDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState();
  const [agentData, setAgentData] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [defaultActiveTab, setDefaultActiveTab] = useState("1");
  const [actionType, setActionType] = useState(true);

  const fetchData = async () => {
    setDataLoad(true);
    await AgentService.getAllAgent({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, //10
    })
      .then((response) => {
        setDataLoad(false);
        setAgentData(response.data?.agent_data);
      })
      .catch((err) => {
        setDataLoad(false);
        console.log(err);
        message.error(err.message);
      });
    if (props?.location?.pathname === "/websites/editwebsite") {
      if (activeTab === "1") {
        setDataLoad(true);
        await WebsiteService.getWebsiteById(props?.location?.state?.id[0])
          .then((response) => {
            setResponseData(response?.data);
            setDataLoad(false);
          })
          .catch((err) => {
            setDataLoad(false);
            console.log(err);
          });
      }
    }
  };

  const fetchVenderList = async () => {
    await VendorService.getAllVendor({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
        console.log(response, "response>>>>>>");
        const filteredOptions = response.data.vendor_data.filter(
          (option) => option.isBlock === false,
        );
        setVendorData(filteredOptions);
        dispatch(fetchVendorData(filteredOptions));
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const onFinish = async (updateData, type) => {
    setIsLoading(true);
    if (updateData?.url === responseData?.url) {
      delete updateData?.url;
    }
    if (props.location.state?.id[0]) {
      await WebsiteService.editWebsite(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            props.history.goBack();
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      delete updateData?._id;
      await WebsiteService.addWebsite(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            props.history.goBack();
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const fetchWebsiteList = async () => {
    await WebsiteService.getAllWebsite({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, //100
    })
      .then((response) => {
        dispatch(fetthAllWebsiteList(response?.data?.website_data));
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const fetchPaymentGetWayList = async () => {
    await PaymentGetway.getAllPaymentGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
        dispatch(fetchPaymentGateway(response?.data?.paymentPartner_data));
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  useEffect(() => {
    fetchData();
    fetchVenderList();
    fetchPaymentGetWayList();
    fetchWebsiteList();
    setActionType(localStorage.getItem("addAction"));
  }, []);

  return (
    <>
      <Auxiliary>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                title={"Back"}
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  props.history.goBack();
                  localStorage.setItem("addAction", "true");
                }}
                style={{ marginBottom: 0, marginRight: "15px" }}
              />
              {title}
            </div>
          }
        >
          {actionType === "true" ? (
            <>
              <WebsiteForm
                onFinish={(data, type) => onFinish(data, type)}
                agentData={agentData}
                vendorData={vendorData}
                dataLoad={dataLoad}
                responseData={responseData}
                isLoading={isLoading}
                props={props}
              />
            </>
          ) : (
            <Tabs
              defaultActiveKey="1"
              activeKey={activeTab ? activeTab : defaultActiveTab}
              onChange={(key) => {
                setDefaultActiveTab(key);
                dispatch(fetchActiveTab(key));
                if (key == 2 || key == 4) {
                  dispatch(fetchTransactionType("deposit"));
                } else {
                  dispatch(fetchTransactionType("withdraw"));
                }
              }}
            >
              <TabPane tab="Website Info" key="1">
                {!dataLoad && (
                  <WebsiteForm
                    onFinish={(data, type) => onFinish(data, type)}
                    agentData={agentData}
                    vendorData={vendorData}
                    dataLoad={dataLoad}
                    responseData={responseData}
                    isLoading={isLoading}
                    props={props}
                  />
                )}
              </TabPane>

              <TabPane tab="PG for Deposit" key="2">
                {!isLoading && (
                  <EntityGetwayForm
                    id={props.location.state?.id[0]}
                    transactionType="deposit"
                  />
                )}
              </TabPane>
              <TabPane tab="PG for Withdraw" key="3">
                {!isLoading && (
                  <EntityGetwayForm
                    id={props.location.state?.id[0]}
                    transactionType="withdraw"
                  />
                )}
              </TabPane>
              <TabPane tab="Vendor Deposit" key="4">
                {!isLoading && (
                  <WebsiteAssignVendor
                    id={props.location.state?.id[0]}
                    VendorType="deposit"
                    vendorData={vendorData}
                  />
                )}
              </TabPane>
              <TabPane tab="Vendor Withdraw" key="5">
                {!isLoading && (
                  <WebsiteAssignVendor
                    id={props.location.state?.id[0]}
                    VendorType="withdraw"
                    vendorData={vendorData}
                  />
                )}
              </TabPane>
              <TabPane tab="Crypto Fund Wallet" key="6">
                {!isLoading && (
                  <CryptoFundWallet id={props.location.state?.id[0]} />
                )}
              </TabPane>
              <TabPane tab="Video Link" key="7">
                {!isLoading && (
                  <VideoURL
                    onFinish={(data, type) => onFinish(data, type)}
                    responseData={responseData}
                  />
                )}
              </TabPane>
            </Tabs>
          )}
        </Card>
      </Auxiliary>
    </>
  );
};

export default withRouter(AddWebsite);
