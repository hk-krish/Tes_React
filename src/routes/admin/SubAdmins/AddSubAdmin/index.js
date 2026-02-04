import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Select, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom/cjs/react-router-dom.min"
import Auxiliary from "util/Auxiliary";
import CircularProgress from "../../../../components/CircularProgress";
import RoleService from "../../../../service/RoleService";
import SubAdminService from "../../../../service/SubAdminService";
import notify from "../../../../Notification";
const { Option } = Select;

const AddSubAdmin = (props) => {
    const title =
        props?.location?.pathname === "/sub-admins/editSubAdmin"
            ? "Edit Sub Admin"
            : "Add Sub Admin";
    const { loader, alertMessage, showMessage, user } = useSelector(({ auth }) => auth);
    const [dataLoad, setDataLoad] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    };

    const handleChangeRole = (e) => {
        setData({ ...data, roleId: e });
    }

    const fetchRoleData = async () => {
        setDataLoad(true);
        await RoleService.getAllRole({
            page: 1,
            limit: Number.MAX_SAFE_INTEGER,
            activeFilter: true,
        }).then(response => {
            console.log("response===> ", response);
            setRoleData(response?.data?.role_data);
        })
        setDataLoad(false);
    }

    const onFinish = async () => {
        setLoading(true);
        let updateData = {
            _id: data?._id,
            name: data?.name,
            userId: data?.userId,
            password: data?.password,
            roleId: data?.roleId,
            isActive: data?.isActive,
        };

        if (props?.location?.pathname === "/sub-admins/editSubAdmin") {
            await SubAdminService.editSubAdmin(updateData)
                .then((response) => {
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Sub Admin has been successfully Updated",
                        );
                        setLoading(false);
                        history.push("/sub-admins");
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
            delete updateData._id;
            await SubAdminService.addSubAdmin(updateData)
                .then((response) => {
                    console.log("response------------->>>", response);
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Sub Admin has been added successfully",
                        );
                        setLoading(false);
                        history.push("/sub-admins")
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

    const fetchSubAdminById = async () => {
        setDataLoad(true);
        await SubAdminService.getSubAdminById(props?.location?.state?.id[0])
            .then((response) => {
                console.log("response ===> ", response)
                setData(response?.data);
                form.setFieldsValue({
                    name: response?.data?.name,
                    userId: response?.data?.userId,
                    password: response?.data?.password,
                    roleId: response?.data?.roleId
                  });
                setDataLoad(false);
            })
            .catch((err) => {
                console.log(err);
                setDataLoad(false);
            });
    }

    useEffect(() => {
        fetchRoleData();
        if (props?.location?.pathname === "/sub-admins/editSubAdmin") {
            fetchSubAdminById();
        }
    }, [])

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
                    {dataLoad ? (<div
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
                    </div>) : (
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 900, position: "relative" }}
                            initialValues={{ remember: true }}
                            // ref={formRef}
                            form={form}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Select Role"
                                name="roleId"
                                rules={[
                                    {
                                        required: data?.roleId ? false : true,
                                        message: "Please select Role!",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select Role"
                                    onSelect={(e) => handleChangeRole(e)}
                                    onDeselect={(e) => handleChangeRole(e)}

                                    defaultValue={{
                                        // label: data?.roleId,
                                        value: data?.roleId,
                                    }}
                                >
                                    {roleData && roleData?.length > 0 && roleData?.map(data =>
                                        <Select.Option value={data?._id} key={data?._id}>{data.name}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="Sub Admin Name"
                                name="name"
                                required
                                rules={[
                                    {
                                        required: data?.name == "" || data?.name == undefined,
                                        message: "Please enter your sub admin name!",
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter Sub Admin Name"
                                    name="name"
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="User Name"
                                name="userId"
                                required
                                rules={[
                                    {
                                        required: data?.userId === "" || data?.userId == undefined,
                                        message: "Please enter your sub admin User Name!",
                                    },
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter Sub Admin User Name"
                                    name="userId"
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your password!",
                                    },
                                    {
                                        min: 6,
                                        message: "Password must be at least 6 characters long.",
                                    },
                                    {
                                        pattern:
                                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/,
                                        message:
                                            "Password must include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Enter password"
                                    name="password"
                                    onChange={handleInputChange}
                                    iconRender={(visible) =>
                                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label="Is Active"
                                name="isActive"
                                style={{ marginTop: "10px" }}
                            >
                                <Switch
                                    name="isActive"
                                    checked={data?.isActive || false}
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
                    )}

                </Card>
            </Auxiliary>
        </>
    )
}

export default withRouter(AddSubAdmin);