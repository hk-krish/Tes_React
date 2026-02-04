import React, { useEffect, useRef, useState } from "react";
import { Modal, Menu, Input, Form, Card, message, Button, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import CircularProgress from "../CircularProgress";
import VendorService from "../../service/VendorService";

const FilterModal = (props) => {
  const formRef = useRef();
  const selectRef = useRef();
  const buttonRef = useRef();
  const searchRef = useRef();
  const title = "";
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [vendorData, setVendorData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState(
    props.data || {
      vendorName: null,
      selectedItem: { name: "No Select", _id: "123" },
    },
  );

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "maxWithdrawTime" || name === "maxDepositTime") {
      setData({
        ...data,
        settings: { ...data.settings, [name]: parseInt(value) },
      });
    } else {
      setData({
        ...data,
        [name]:
          !isNaN(parseFloat(value)) && isFinite(value)
            ? parseInt(value)
            : value,
      });
    }
    fetchData(value);
  };

  const fetchData = async (search) => {
    setLoadingData(true);
    await VendorService.getAllVendor({
      page: 1,
      limit: 5000, //100,
      search: search,
    })
      .then((response) => {
        console.log("response ======>>>>>>", response.data);
        setVendorData(response.data.vendor_data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  useEffect(() => {
    formRef.current?.setFieldsValue({
      vendorName: "No Select",
      selectedItem: { name: "No Select", _id: "123" },
    });
  }, []);
  return (
    <Modal
      title={"Apply Filter"}
      closable={false}
      visible={props.visibleModel}
      footer={<></>}
    >
      <Card title={title}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          initialValues={data}
          ref={formRef}
          //   onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Vendor Name" name="vendorName" rules={[{}]}>
            <Select
              name={"vendorName"}
              ref={selectRef}
              optionLabelProp="label"
              bordered={true}
              value={data?.selectedItem?.name}
              onDropdownVisibleChange={() => {
                fetchData();
              }}
              dropdownRender={() => {
                return (
                  <>
                    <Menu
                      className="ant-dropdown-menu"
                      style={{
                        alignContent: "center",
                        maxHeight: "500px",
                        overflow: "scroll",
                      }}
                    >
                      <Menu.Item>
                        <Input
                          ref={searchRef}
                          placeholder="Search Vendor"
                          prefix={<SearchOutlined />}
                          autoFocus
                          onChange={handleInputChange}
                        />
                      </Menu.Item>
                      {[
                        { name: "No Select", _id: "serachid" },
                        ...vendorData,
                      ].map((item, index) => {
                        return (
                          <Menu.Item
                            onClick={() => {
                              formRef.current.setFieldsValue({
                                vendorName: item?.name,
                              });
                              buttonRef.current.focus();
                              setData({ ...data, selectedItem: item });
                            }}
                            key={item._id}
                            className="ant-dropdown-menu-item"
                          >
                            {item.name}
                          </Menu.Item>
                        );
                      })}
                    </Menu>
                  </>
                );
              }}
              maxLength={1}
              showArrow
              showSearch={false}
              // name="vendorName"
              id="vendorName"
              className="filtertered-dropdown-select"
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ marginLeft: "33%" }}
          >
            <Button
              ref={buttonRef}
              onClick={() => {
                props.setData([...[]]);
                props.onFilterClick(
                  data.selectedItem?.name !== "No Select"
                    ? { vendorFilter: data.selectedItem?._id }
                    : {},
                );
                props.onCancel();
              }}
              loading={false}
              type="primary"
              name="apply"
              htmlType="button"
            >
              {"Filter"}
            </Button>
            <Button
              onClick={() => {
                props.onCancel();
                formRef.current?.setFieldsValue({
                  vendorName: "No Select",
                  selectedItem: { name: "No Select", _id: "123" },
                });
                props.setData([...[]]);
                props.onFilterClick({});
              }}
              type="default"
              name="cancel"
              htmlType="cancel"
            >
              {"Clear"}
            </Button>
          </Form.Item>

          {loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessage ? message.error(alertMessage.toString()) : null}
        </Form>
      </Card>
    </Modal>
  );
};

export default FilterModal;
