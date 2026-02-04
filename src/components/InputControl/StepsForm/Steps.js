import { Form, Input, Button, Space, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import DragDrop from "../../upload/DragDrop";
import { useEffect, useState } from "react";

const { Option } = Select;

const StepsForm = ({ path, stepsUrl, steps }) => {
  // useEffect(() => {
  //     if (steps && steps.length) {
  //         for (let i = 0; i < steps.length; i++) {
  //             console.log(i)
  //             setList(list.filter(function (obj) {
  //                 return obj.id !== steps[i].stepNumber.toString();
  //             }));
  //         }
  //     }
  //     // eslint-disable-next-line
  // }, [])

  useEffect(() => {
    async function fetchData() {
      if (steps && steps.length) {
        for (let i = 0; i < steps.length; i++) {
          console.log(i);
          setList(
            list.filter(function (obj) {
              return obj.id !== steps[i].stepNumber.toString();
            }),
          );
        }
      }
    }
    fetchData();
  }, []);

  const [list, setList] = useState([
    { name: "1", id: "1" },
    { name: "2", id: "2" },
    { name: "3", id: "3" },
    { name: "4", id: "4" },
    { name: "5", id: "5" },
    { name: "6", id: "6" },
    { name: "7", id: "7" },
    { name: "8", id: "8" },
    { name: "9", id: "9" },
    { name: "10", id: "10" },
  ]);

  const handleChange = (e) => {
    setList(
      list.filter(function (obj) {
        return obj.id !== e;
      }),
    );
  };

  const storeUrl = (id, link) => {
    stepsUrl({ id: id, link: link });
  };

  const handleRemove = (name) => {
    let selected = document.getElementsByClassName("ant-select-selection-item");
    if (selected[name]) {
      let id = selected[name].title;
      list.push({ name: id, id: id });
      list.sort((a, b) => a.id - b.id);
    }
  };

  return (
    <Form.List name="steps">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, fieldKey, ...restField }) => (
            <Space
              key={key}
              style={{ display: "flex", marginBottom: 8 }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, "stepNumber"]}
                fieldKey={[fieldKey, "stepNumber"]}
                rules={[{ required: true, message: "Missing step number" }]}
              >
                <Select
                  onChange={handleChange}
                  style={{ width: "100px" }}
                  placeholder="Step"
                >
                  {list &&
                    list.map((data) => (
                      <Option value={data.id} key={data.id}>
                        {data.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "description"]}
                fieldKey={[fieldKey, "description"]}
                rules={[{ required: true, message: "Missing description" }]}
              >
                <Input style={{ width: "300px" }} placeholder="Description" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, "image"]}
                fieldKey={[fieldKey, "image"]}
              >
                <DragDrop
                  url={steps[name] ? steps[name].image : ""}
                  dataUrl={storeUrl}
                  path={path}
                  type="image"
                  element="simple"
                />
              </Form.Item>
              <MinusCircleOutlined
                onClick={() => {
                  handleRemove(name);
                  remove(name);
                }}
              />
            </Space>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Add Steps
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default StepsForm;
