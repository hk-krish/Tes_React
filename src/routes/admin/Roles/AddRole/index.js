import Auxiliary from "util/Auxiliary";
import {
    Button,
    Form,
    Input,
    Card,
    message,
    Switch,
    Tabs,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import RoleService from "../../../../service/RoleService";
import notify from "../../../../Notification";
import { useHistory, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "../../../../components/CircularProgress";
import TabPane from "antd/lib/tabs/TabPane";
import RoleDetail from "../../RoleDetail";

const AddRole = (props) => {
    const title =
        props.location.pathname === "/role/addrole"
            ? "Add Roles"
            : "Edit Roles "+"(Role Name: "+props?.location?.state?.editData?.name+")";
    const [dataLoad, setDataLoad] = useState(false);
    const formRef = useRef();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        isActive: true
    });
    const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
    const [isActive, setActive] = useState(true);
    const [defaultActiveTabKey, setDefaultActiveTabKey] = useState("2");
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "name") {
            setData({
                ...data,
                [name]: value,
            });
        }
    };

    const handleStatusChange = (e) => {
        console.log(e, "e-->>>");
        setActive(e);
        setData({ ...data, isActive: e });
    };

    const onFinish = async () => {
        setIsLoading(true);
        let updateData = {
            _id: props?.location?.state?.id[0],
            name: data?.name,
            isActive: data?.isActive,
        };

        if (props?.location?.pathname === "/role/editrole") {
            await RoleService.editRole(updateData)
                .then((response) => {
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Role has been successfully Updated",
                        );
                        setIsLoading(false);
                        history.push("/role");
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        setIsLoading(false);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    notify.openNotificationWithIcon("error", "Error", err.message);
                    setIsLoading(false);
                    console.log(err);
                });
        } else {
            delete updateData._id;
            await RoleService.addRole(updateData)
                .then((response) => {
                    console.log("response------------->>>", response);
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Role has been added successfully",
                        );
                        setIsLoading(false);
                        history.push({
                            pathname: "/role/editrole",
                            state: {
                                editData: response?.data,
                                id: [response?.data?._id],
                            },
                        });
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        setIsLoading(false);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };

    const fetchData = async () => {
        console.log(props);
        if (props?.location?.pathname === "/role/editrole") {
            await RoleService.getRoleById(props?.location?.state?.id[0])
                .then((response) => {
                    console.log("response ===> ", response)
                    setDataLoad(true);
                    setData({
                        name: response?.data?.name,
                        isActive: response?.data?.isActive,
                    })
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setDataLoad(true);
        }
    };

    useEffect(() => {
        fetchData();
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
                    {props.location.pathname === "/role/addrole" ? (
                        dataLoad && (<>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                style={{ maxWidth: 900 }}
                                initialValues={{ remember: true }}
                                ref={formRef}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Role Name"
                                    name="name"
                                    rules={[
                                        {
                                            required: data?.name === "",
                                            message: "Please enter role name!",
                                        },
                                        // {
                                        //   required: data?.name !== "",
                                        //   pattern: new RegExp(
                                        //     /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/i
                                        //   ),
                                        //   message: "Please enter only alphanumeric characters!",
                                        // },
                                    ]}
                                    required
                                >
                                    <Input
                                        type="text"
                                        placeholder="Enter Role Name"
                                        defaultValue={data?.name}
                                        value={data?.name}
                                        name="name"
                                        id="name"
                                        onChange={handleInputChange}

                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Is Active"
                                    name="isActive"
                                    style={{ marginTop: "10px" }}
                                >
                                    <Switch
                                        name="isActive"
                                        checked={isActive}
                                        onChange={(e) => handleStatusChange(e, isActive)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{ offset: 8, span: 16 }}
                                    style={{ marginLeft: "33%" }}
                                >
                                    <Button
                                        loading={isLoading}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        {props.location.pathname === "/role/addrole"
                                            ? "Add"
                                            : "Update"}
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
                        </>)
                    ) : (
                        <Tabs
                            defaultActiveKey={defaultActiveTabKey}
                            onChange={(key) => {
                                setDefaultActiveTabKey(key);
                                // dispatch(setNetworkActiveTab(key));
                            }}
                        >
                            <TabPane tab="Edit Role Details" key="1">
                                <Form
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    style={{ maxWidth: 900 }}
                                    initialValues={{ remember: true }}
                                    ref={formRef}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        label="Role Name"
                                        name="name"
                                        rules={[
                                            {
                                                required: data?.name === "",
                                                message: "Please enter role name!",
                                            },
                                            // {
                                            //   required: data?.name !== "",
                                            //   pattern: new RegExp(
                                            //     /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/i
                                            //   ),
                                            //   message: "Please enter only alphanumeric characters!",
                                            // },
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Enter Role Name"
                                            defaultValue={data?.name}
                                            value={data?.name}
                                            name="name"
                                            id="name"
                                            onChange={handleInputChange}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Is Active"
                                        name="isActive"
                                        style={{ marginTop: "10px" }}
                                    >
                                        <Switch
                                            name="isActive"
                                            checked={isActive}
                                            onChange={(e) => handleStatusChange(e, isActive)}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        wrapperCol={{ offset: 8, span: 16 }}
                                        style={{ marginLeft: "33%" }}
                                    >
                                        <Button
                                            loading={isLoading}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            {props.location.pathname === "/role/addrole"
                                                ? "Add"
                                                : "Update"}
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
                            </TabPane>

                            <TabPane tab="Role Details" key="2">
                                <RoleDetail props={props} />
                            </TabPane>
                        </Tabs>
                    )}
                </Card>
            </Auxiliary>
        </>
    );
}

export default withRouter(AddRole);