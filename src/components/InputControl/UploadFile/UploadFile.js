import React, { Component, PureComponent } from "react";
import { Upload, message, Button, Form } from "antd";
import s3 from "../../../util/AWS/AwsDoc";
import AWSConfig from "../../../util/AWS/AWSConfig";

class UploadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url_file: [],
      filelistData: [],
    };
  }

  componentDidMount = () => {
    console.log("list>>>>>>>>>>", this.props.fileListUrl);
    if (this.props.isCancel === true) {
      this.RemoveImage();
    }
  };

  RemoveImage = () => {
    this?.props?.img_urls.map((item) => {
      if (item !== undefined) {
        let params;
        let name = item.split("/");
        if (name[5] === undefined) {
          params = { Bucket: "demo-bucket", Key: `${name[3]}/${name[4]}` };
        } else {
          params = {
            Bucket: "demo-bucket",
            Key: `${name[3]}/${name[4]}/${name[5]}/${name[6]}`,
          };
        }
        s3.deleteObject(
          params,
          function (err, data) {
            if (err) {
              console.log(err);
            }
          }.bind(this),
        );
      }
    });
  };
  uploadImage = {
    name: "file",
    customRequest: ({ onSuccess, onError, file }) => {
      const params = {
        Body: file,
        Bucket: `${AWSConfig.bucketName}`,
        ContentType: file.type,
        Key: this.props.params + `${file.uid + file.name.replace(/ /g, "")}`,
      };
      s3.putObject(params)
        .on("build", (request) => {
          request.httpRequest.headers.Host = `${AWSConfig.digitalOceanSpaces}`;
          request.httpRequest.headers["Content-Length"] = file.size;
          request.httpRequest.headers["Content-Type"] = file.type;
          request.httpRequest.headers["x-amz-acl"] = "public-read";
        })
        .send((err, data) => {
          if (err) {
            onError();
          } else {
            const Url_Data = `${process.env.REACT_APP_DIGITALOCEAN_URL}/${this.props.params + file.uid + file.name.replace(/ /g, "")}`;
            console.log("Url_Data>>>>>>", Url_Data);

            if (
              this.state.url_file === undefined &&
              this.state.url_file === []
            ) {
              this.setState({ url_file: [Url_Data] });
              onSuccess();
            } else {
              let newData = this.state.url_file;
              newData.push(Url_Data);
              this.setState({ url_file: newData });
              onSuccess();
            }
          }
        });
    },
    onRemove: (file) => {
      let params;
      if (file.originFileObj !== undefined) {
        params = {
          Bucket: "demo-bucket",
          Key: this.props.params + `${file.uid + file.name.replace(/ /g, "")}`,
        };
      } else {
        let name = file.name.split("/");
        if (name[5] === undefined) {
          params = { Bucket: "demo-bucket", Key: `${name[3]}/${name[4]}` };
        } else {
          params = {
            Bucket: "demo-bucket",
            Key: `${name[3]}/${name[4]}/${name[5]}`,
          };
        }
      }
      s3.deleteObject(
        params,
        function (err, data) {
          if (err) {
            console.log(err);
          } else {
            let urls = this.state.url_file;
            let data = this.state.filelistData;
            let name = file.name.split("/").at(-1);
            let newUrls = urls.filter(
              (item) => item.split("/").at(-1) !== name,
            );
            let newdata = data.filter(
              (item) => item.name.split("/").at(-1) !== name,
            );
            this.setState({ url_file: newUrls, filelistData: newdata });
            if (file.status === "removed") {
              let finalDataUrls;
              if (newUrls.length === 1) {
                finalDataUrls = newUrls[0];
              } else {
                finalDataUrls = newUrls;
              }
              let fieldName = this.props.name;
              this.props.field.current.setFieldsValue({
                [fieldName]: finalDataUrls,
              });
            }
          }
        }.bind(this),
      );
    },
  };

  urlList = () => {
    var data;
    var typedata = typeof this.props.fileListUrl;
    if (typedata === "string") {
      data = [this.props.fileListUrl];
    } else {
      data = this.props.fileListUrl;
    }
    this.setState({ url_file: data });
    let dataArray = this.state.filelistData;
    if (data && data.length) {
      for (let i = 0; i < data.length; i++) {
        let dataObj = {
          uid: i + 1,
          name: data[i],
          status: "done",
          response: "done",
          url: data[i],
        };
        dataArray.push(dataObj);
      }
    }
    return dataArray;
  };

  handleChange = (response) => {
    if (response.file.status !== "uploading") {
      console.log(response.file, response.fileList);
    }
    if (response.file.status === "done") {
      message.success(`${response.file.name}
            file uploaded successfully`);
    } else if (response.file.status === "error") {
      message.error(`${response.file.name}
            file upload failed.`);
    } else if (response.file.status === "removed") {
      message.success(`${response.file.name} 
            file Deleted successfully`);
    }
  };

  normFile = (e) => {
    this.handleChange(e);
    var data;
    if (this.state.url_file !== undefined && this.state.url_file !== []) {
      if (this.state.url_file.length === 1) {
        data = this.state.url_file[0];
      } else {
        data = this.state.url_file;
      }
    }
    // this.setState({ url_file: undefined })
    if (data !== undefined) {
      return data;
    } else {
      return e && e.fileList;
    }
  };

  render() {
    return (
      <Form.Item
        name={this.props.name}
        label={this.props.label}
        getValueFromEvent={this.normFile}
        rules={[
          {
            required: this.props.required,
            message: this.props.requiredMessage,
          },
        ]}
      >
        {this.props.fileListUrl !== undefined &&
        this.props.fileListUrl.length > 0 ? (
          <Upload
            {...this.uploadImage}
            listType="picture-card"
            maxCount={this.props.maxCount}
            defaultFileList={this.urlList}
            accept={this.props.accept}
          >
            {this.state.url_file !== undefined &&
            this.state.url_file !== [] &&
            this.state.url_file.length === this.props.maxCount
              ? null
              : "Upload"}
          </Upload>
        ) : (
          <Upload
            {...this.uploadImage}
            listType="picture-card"
            maxCount={this.props.maxCount}
            accept={this.props.accept}
          >
            {this.state.url_file !== undefined &&
            this.state.url_file !== [] &&
            this.state.url_file.length === this.props.maxCount
              ? null
              : "Upload"}
          </Upload>
        )}
      </Form.Item>
    );
  }
}

export default UploadFile;
