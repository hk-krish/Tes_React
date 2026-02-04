import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input, message, Select, Spin, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { useHistory, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import Auxiliary from "util/Auxiliary";
import TabMasterService from "../../../../service/TabMasterService";
import { useSelector } from "react-redux";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";

const AddTabmaster = (props) => {
    const title =
        props?.location?.pathname === "/tabmaster/edittabmaster"
            ? "Edit Tabmaster"
            : "Add Tabmaster";
    const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [dataLoad, setDataLoad] = useState(false);
    const formRef = useRef();
    const [data, setData] = useState({
        tabName: "",
        displayName: "",
        tabUrl: "",
        number: "",
        parentId: null,
        hasView: false,
        hasAdd: false,
        hasEdit: false,
        hasDelete: false,
        isActive: true
    });
    const [allTabData, setAllTabData] = useState(null);

    const fetchAllTabmasterData = async () => {
        setLoading(true);
        await TabMasterService.getAllTabmaster({
            page: 1,
            limit: Number.MAX_SAFE_INTEGER,
            search: null,
            activeFilter: true,
        }).then(response => {
            console.log("response===> ", response);
            setLoading(false);
            setAllTabData(response?.data?.tabmaster_data?.filter(item => item.tabUrl === ""));
        })
    }

    const fetchTabmasterData = async () => {
        setLoading(true);
        if (props?.location?.pathname === "/tabmaster/edittabmaster") {
            await TabMasterService.getTabmasterById(props.location.state.id[0])
                .then(response => {
                    console.log("response ===> ", response)
                    setDataLoad(true);
                    formRef.current.setFieldsValue({
                        tabName: response?.data?.tabName,
                        displayName: response?.data?.displayName,
                        tabUrl: response?.data?.tabUrl,
                        number: response?.data?.number,
                        parentId: response?.data?.parentId,
                        hasView: response?.data?.hasView || false,
                        hasAdd: response?.data?.hasAdd || false,
                        hasEdit: response?.data?.hasEdit || false,
                        hasDelete: response?.data?.hasDelete || false,
                        isActive: response?.data?.isActive
                    });
                    setData(response?.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                    message.error(err.message);
                })
        }
        setLoading(false);
        setDataLoad(true);
    }

    const handleInputChange = (e) => {
        let { name, value, type, checked } = e.target;

        setData(prev => {
            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }
        })
    };

    const handleChange = (e) => {
        setData({ ...data, parentId: e === -1 ? null : e });
    };

    const onFinish = async () => {
        setLoading(true);
        let updateData = {
            _id: data?._id,
            tabName: data?.tabName,
            displayName: data?.displayName,
            tabUrl: data?.tabUrl,
            number: data?.number,
            parentId: data?.parentId,
            hasView: data?.hasView || false,
            hasAdd: data?.hasAdd || false,
            hasEdit: data?.hasEdit || false,
            hasDelete: data?.hasDelete || false,
            isActive: data?.isActive
        };
        if (props.location.state?.id[0]) {
            await TabMasterService.editTabmaster(updateData)
                .then((response) => {
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "YourData has been successfully Updated",
                        );
                        setLoading(false);
                        history.push("/tabmaster");
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        setLoading(false);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    notify.openNotificationWithIcon("error", "Error", err.message);
                    setLoading(false);
                    console.log(err);
                });
        } else {
            delete updateData?._id;
            await TabMasterService.addTabmaster(updateData)
                .then((response) => {
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "YourData has been successfully Add",
                        );
                        setLoading(false);
                        history.push("/tabmaster");
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        setLoading(false);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    useEffect(() => {
        fetchTabmasterData();
    }, [props?.location?.state?.editData]);

    useEffect(() => {
        fetchAllTabmasterData();
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
                                onClick={() => props.history.goBack()}
                                style={{ marginBottom: 0, marginRight: "15px" }}
                            />
                            {title}
                        </div>
                    }
                >
                    {loading && (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.7)", // Adjust background color and opacity as needed
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1000, // Ensure the loading overlay is above the form
                            }}
                        >
                            <Spin size="small" />
                        </div>
                    )}
                    {dataLoad &&
                        <>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 900, position: "relative" }}
                                initialValues={{ remember: true }}
                                ref={formRef}
                                onFinish={onFinish}
                                autoComplete="off"
                            >

                                <Form.Item
                                    label="Select Parent Tab"
                                    name="parentId"
                                >
                                    <Select
                                        placeholder="Select Parent Tab"
                                        onSelect={(e) => handleChange(e)}
                                        onDeselect={(e) => handleChange(e)}
                                        defaultValue={{
                                            label: data?.parentId,
                                            value: data?.parentId,
                                        }}
                                    >
                                        <Select.Option value={-1} key={-1}>
                                            {"Select None"}
                                        </Select.Option>
                                        {allTabData?.length > 0 && allTabData?.map(item =>
                                            <Select.Option value={item._id} key={item._id}>
                                                {item.displayName}
                                            </Select.Option>
                                        )}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="Tab Name"
                                    name="tabName"
                                    rules={[
                                        {
                                            required: data?.tabName === "",
                                            message: "Please enter tab name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Enter Tab Name"
                                        name="tabName"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Tab Display Name"
                                    name="displayName"
                                    rules={[
                                        {
                                            required: data?.displayName === "",
                                            message: "Please enter tab name!",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Enter Tab Display Name"
                                        name="displayName"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Tab URL"
                                    name="tabUrl"
                                    required={data?.parentId != null}
                                    rules={[
                                        {
                                            required: data?.parentId != null,
                                            message: "Please enter taburl!",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Enter Tab Url"
                                        name="tabUrl"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Tab Number"
                                    name="number"
                                    rules={[
                                        {
                                            required: data?.number === "",
                                            message: "Please enter tab number!",
                                        },
                                        {
                                          required: data?.number !== "",
                                          pattern: new RegExp(/^0*[1-9]\d*$/),
                                          message: "Please enter only numerical characters!",
                                        },
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Enter Tab Number"
                                        name="number"
                                        onChange={handleInputChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Select Tab Permission"
                                    style={{ marginTop: "10px" }}
                                >
                                    <Checkbox
                                        name="hasView"
                                        checked={data?.hasView || false}
                                        onChange={handleInputChange}
                                    >
                                        View
                                    </Checkbox>
                                    <Checkbox
                                        name="hasAdd"
                                        checked={data?.hasAdd || false}
                                        onChange={handleInputChange}
                                    >
                                        Add
                                    </Checkbox>
                                    <Checkbox
                                        name="hasEdit"
                                        checked={data?.hasEdit || false}
                                        onChange={handleInputChange}
                                    >
                                        Edit
                                    </Checkbox>
                                    <Checkbox
                                        name="hasDelete"
                                        checked={data?.hasDelete || false}
                                        onChange={handleInputChange}
                                    >
                                        Delete
                                    </Checkbox>
                                </Form.Item>

                                <Form.Item
                                    label="Is Active"
                                    name="isActive"
                                    style={{ marginTop: "10px" }}
                                >
                                    <Switch
                                        name="isActive"
                                        checked={data?.isActive}
                                        onChange={(e) => setData({ ...data, isActive: e })}
                                    />
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{ offset: 8, span: 16 }}
                                    style={{ marginLeft: "33%" }}
                                >
                                    <Button loading={loading} type="primary" htmlType="submit">
                                        {props.location.state?.id[0] ? "Update" : "ADD"}
                                    </Button>
                                    <Button
                                        style={{ padding: "0 25px" }}
                                        type="primary"
                                        onClick={() => {
                                            props.history.goBack();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Form.Item>
                                {loader ? (
                                    <div className="gx-loader-view">
                                        <CircularProgress />
                                    </div>
                                ) : null}
                                {showMessage ? message.error(alertMessage.toString()) : null}
                            </Form>
                        </>}
                </Card>
            </Auxiliary>
        </>
    );
}

export default withRouter(AddTabmaster);