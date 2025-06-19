import React, { useState, useCallback, useRef } from "react";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop, createDndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import ImagePickerSection from './ImagePickerSection';
import UrlSection from "./UrlSection";
import DescriptionSection from './DescriptionSection';
import CategorySection from './CategorySection';

const RNDContext = createDndContext(HTML5Backend);
const type = "DragableBodyRow";

const DragableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  const ref = React.useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ""}`}
      style={{ cursor: "move", ...style }}
      {...restProps}
    />
  );
};

const columns = [
  {
    title: "",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "",
    dataIndex: "url",
    key: "url",
  },
];

const RowItem = () => {
  const [data, setData] = useState([
    // {
    //   key: "1",
    //   image: <ImagePickerSection/>,
    //   category:<CategorySection/>,
    //   description: <DescriptionSection/>,
    //   url:<UrlSection/>
    // },
    {
      key: "1",
      image: <ImagePickerSection/>,
      category:<CategorySection/>,
      description: <DescriptionSection/>,
      url:<UrlSection/>
    },

  ]);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        })
      );
    },
    [data]
  );

  const manager = useRef(RNDContext);

  return (
    <DndProvider manager={manager.current.dragDropManager}>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
      />
    </DndProvider>
  );
};

export default RowItem;
