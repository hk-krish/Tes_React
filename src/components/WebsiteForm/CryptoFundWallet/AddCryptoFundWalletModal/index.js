import { Button, Form, message, Modal, Select, Spin, Switch } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min"
import CircularProgress from "../../../CircularProgress";
import notify from "../../../../Notification";
import { CustomFormItem } from "../../../InputControl/InputForm";
import CryptoFundWalletService from "../../../../service/CryptoFundWalletService";
const { Option } = Select;

const AddCryptoFundWalletModal = (props) => {
    const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
    const [form] = Form.useForm();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        })
    };

    const handleChangeCoin = (e) => {
        setData({ ...data, coinId: e });
    };

    const onFinish = async () => {
        setLoading(true);
        let updateData = {
            _id: data?._id,
            name: data?.name,
            coinId: data?.coinId,
            websiteId: props?.websiteId,
            address: data?.address,
            privateKey: data?.privateKey,
            isActive: data?.isActive
        };

        if (props?.isEditData !== null) {
            await CryptoFundWalletService.editCryptoFundWallet(updateData)
                .then((response) => {
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Crypto Wallet has been successfully Updated",
                        );
                        setData(null);
                        props.setIsFundWalletModalVisible(false);
                        props?.setRefresh(true);
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    notify.openNotificationWithIcon("error", "Error", err.message);
                    console.log(err);
                });
        } else {
            delete updateData._id;
            await CryptoFundWalletService.addNewCryptoFundWallet(updateData)
                .then((response) => {
                    console.log("response------------->>>", response);
                    if (response.status === 200 || response.status === 202) {
                        notify.openNotificationWithIcon(
                            "success",
                            "Success",
                            "Crypto Wallet has been added successfully",
                        );
                        setData(null);
                        props.setIsFundWalletModalVisible(false);
                        props?.setRefresh(true);
                    } else {
                        notify.openNotificationWithIcon("error", "Error", response.message);
                        console.log(response.message);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        setLoading(false);
    };

    useEffect(() => {
        if (props?.isEditData) {
            const editData = props?.isEditData;
            setData(props?.isEditData);
            form.setFieldsValue({
                name: editData?.name,
                coinId: editData?.coinId,
                address: editData?.address,
                privateKey: editData?.privateKey,
                isActive: editData?.isActive
            });
        } else {
            form.resetFields();
        }
    }, [props])

    return (
        <>
            <Modal
                title={`${props?.isEditData ? "Edit" : "Add"} Crypto Fund Wallet`}
                visible={props.visible}
                onCancel={() => {
                    setData(null);
                    form.resetFields();
                    props.setIsFundWalletModalVisible(false);
                }}
                footer={null}
            >
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 900 }}
                    initialValues={{ remember: true }}
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <CustomFormItem
                        label="Name"
                        name="name"
                        value={data?.name}
                        placeholder="Enter Crypto Wallet Name"
                        onChange={handleInputChange}
                        rules={[
                            {
                                required: data?.name === "",
                                message: "Please enter your crypto wallet name",
                            }
                        ]}
                    />
                    <Form.Item
                        label="Select Coin"
                        name="coinId"
                        rules={[
                            {
                                required: true,
                                message: "Please select a coin!",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select Coin"
                            value={data?.coinId}
                            onSelect={(e) => handleChangeCoin(e)}
                        >
                            {props?.coinData && props?.coinData.length > 0 && props?.coinData.map(data => (
                                <Option key={data._id} value={data._id}>{data.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <CustomFormItem
                        label="Address"
                        name="address"
                        value={data?.address}
                        placeholder="Enter Crypto Wallet Address"
                        onChange={handleInputChange}
                        rules={[
                            {
                                required: data?.address === "",
                                message: "Please enter your crypto wallet address",
                            }
                        ]}
                    />
                    <CustomFormItem
                        label="Private Key"
                        name="privateKey"
                        value={data?.privateKey}
                        placeholder="Enter Crypto Wallet Private Key"
                        onChange={handleInputChange}
                        rules={[
                            {
                                required: data?.privateKey === "",
                                message: "Please enter your crypto wallet private key",
                            }
                        ]}
                    />
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
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {props?.isEditData ? "Update" : "Add"}
                        </Button>
                        <Button
                            style={{ padding: "0 25px" }}
                            type="primary"
                            onClick={() => {
                                setData(null);
                                form.resetFields();
                                props.setIsFundWalletModalVisible(false);
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
            </Modal>
        </>
    )
}

export default withRouter(AddCryptoFundWalletModal);