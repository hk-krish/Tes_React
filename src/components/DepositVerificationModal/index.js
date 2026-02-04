import { PictureOutlined } from "@ant-design/icons";
import { Button, Divider, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import ImagePreviewModal from "../ImagePreviewModal";

const DepositVerificationModal = ({
  visible,
  onClose,
  modalName,
  data,
  isDepositReport,
}) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const hasUser = data?.user && Object.keys(data.user).length > 0;
  const hasOperator = data?.operator && Object.keys(data.operator).length > 0;
  const hasVendor =
    isDepositReport && data?.vendor && Object.keys(data.vendor).length > 0;
  const hasAgent =
    isDepositReport && data?.agent && Object.keys(data.agent).length > 0;
  const hasAdmin =
    isDepositReport && data?.admin && Object.keys(data?.admin).length > 0;

  const sectionCount = [
    hasUser,
    hasOperator,
    hasVendor,
    hasAgent,
    hasAdmin,
  ].filter(Boolean).length;

  console.log("sectionCount===>>", sectionCount);

  const modalWidth = Math.max(600, sectionCount * 300); // Dynamically adjust modal width

  const handleImagePreview = (image) => {
    setSelectedImage(image);
    setIsImageModalVisible(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalVisible(false);
    setSelectedImage(null);
  };

  const handleOk = () => {
    onClose();
  };

  const DetailSection = ({ title, history, minWidth }) => (
    <div style={{ minWidth: minWidth }}>
      <Title level={5}>{title}</Title>
      <Divider />
      {history?.remark && (
        <p>
          <span style={{ fontWeight: "bold" }}>Remark: </span>
          {history?.remark || "N/A"}
        </p>
      )}
      {history?.utr && (
        <p>
          <span style={{ fontWeight: "bold" }}>UTR ID: </span>
          {history?.utr || "N/A"}
        </p>
      )}
      {history?.amount && (
        <p>
          <span style={{ fontWeight: "bold" }}>Amount: </span>
          {history?.amount || "N/A"}
        </p>
      )}
      {history?.paymentSS && (
        <div>
          <Button
            title={"View Payment Screenshot"}
            onClick={() => handleImagePreview(history?.paymentSS)}
            style={{ color: "green", margin: "0" }}
          >
            <PictureOutlined />
          </Button>
        </div>
      )}
    </div>
  );

  const renderUserDepositDetails = (data) => {
    const minWidth = `${100 / sectionCount}%`; // Dynamically adjust minWidth

    return (
      <div style={{ display: "flex" }}>
        {data?.user && Object.keys(data?.user).length > 0 && (
          <DetailSection
            title="User"
            history={data?.user}
            minWidth={minWidth}
          />
        )}
        {data?.operator && Object.keys(data?.operator).length > 0 && (
          <DetailSection
            title={`Operator (${data?.operator?.createdBy?.name})`}
            history={data?.operator}
            minWidth={minWidth}
          />
        )}
        {isDepositReport &&
          data?.vendor &&
          Object.keys(data?.vendor).length > 0 && (
            <DetailSection
              title={`Vendor (${data?.vendor?.createdBy?.name})`}
              history={data?.vendor}
              minWidth={minWidth}
            />
          )}
        {isDepositReport &&
          data?.agent &&
          Object.keys(data?.agent).length > 0 && (
            <DetailSection
              title={`Agent (${data?.agent?.createdBy?.name})`}
              history={data?.agent}
              minWidth={minWidth}
            />
          )}
        {isDepositReport &&
          data?.admin &&
          Object.keys(data?.admin).length > 0 && (
            <DetailSection
              title={`TES`}
              history={data?.admin}
              minWidth={minWidth}
            />
          )}
      </div>
    );
  };

  return (
    <>
      <Modal
        id="depositVerificationTab"
        title={modalName}
        visible={visible}
        width={modalWidth}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
        onCancel={handleOk}
      >
        {renderUserDepositDetails(data)}
      </Modal>
      {/* Image Preview Modal */}
      <ImagePreviewModal
        visible={isImageModalVisible}
        data={selectedImage}
        onClose={handleImageModalClose}
      />
    </>
  );
};

export default DepositVerificationModal;
