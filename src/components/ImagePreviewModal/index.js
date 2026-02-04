import React, { useEffect, useState } from "react";
import { Modal, Image } from "antd";
const ImagePreviewModal = (props) => {
  const { visible, onClose, data } = props;
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   if (data) {
  //     const img = new window.Image();
  //     img.src = data;
  //     img.onload = () => {
  //       setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  //     };
  //   }
  // }, [data]);

  return (
    <>
      <Modal
        centered
        visible={visible}
        onCancel={onClose}
        // width={imageSize.width}
        footer={null}
        style={{ zIndex: 999, minWidth: "50px" }}
      >
        <Image
          preview={false}
          src={data}
          // style={{ width: "auto", height: "auto" }}
        />
      </Modal>
    </>
  );
};
export default ImagePreviewModal;
