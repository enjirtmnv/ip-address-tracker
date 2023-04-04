// import React from "react";
// import Table from "./views/TableBook";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { Space, Table, Tag, Input, Button, Spin } from "antd";

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [header, setHeader] = useState([]);
  const [isSort, setIsSort] = useState(true);

  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchSeries, setSearchSeries] = useState("");
  const [inputFocus, setInputFocus] = useState("Бренд");
  const [filterFocus, setFilterFocus] = useState("");

  const handleInputAuthor = (e) => {
    setInputFocus("Автор");
    setFilterFocus(e.target.value);
    setSearchAuthor(e.target.value);
  };

  const handleInputSeries = (e) => {
    setInputFocus("Серия");
    setFilterFocus(e.target.value);
    setSearchSeries(e.target.value);
  };

  const mySort = (arr) => {
    const wow = arr.sort((a, b ) => {
      if (a["Бренд"] < b["Бренд"]) {
        return -1;
      }
      if (a["Бренд"] > b["Бренд"]) {
        return 1;
      }
      return 0;
    });

    const wow2 = wow.sort((a , b ) => {
      if (a["Бренд"] === b["Бренд"]) {
        if (a["Наименование"] < b["Наименование"]) {
          return -1;
        }
        if (a["Наименование"] > b["Наименование"]) {
          return 1;
        }
        return 0;
      }
    });
    const wow3 = wow2.sort((a , b ) => {
      if (
        a["Бренд"] === b["Бренд"] &&
        a["Наименование"] === b["Наименование"]
      ) {
        if (a["Год"] < b["Год"]) {
          return -1;
        }
        if (a["Год"] > b["Год"]) {
          return 1;
        }
        return 0;
      }
    });
    return wow3;
  };

  function myGroup(array ) {
    const myArr  = [];
    const myObj  = {};

    for (var i = 0; i < array.length; i++) {
      let brand =
        array[i]["Бренд"] + array[i]["Наименование"] + array[i]["Год"];

      if (myObj[brand]) {
        myObj[brand].push(array[i]);
      } else {
        myObj[brand] = [array[i]];
      }
    }

    for (let value of (Object).values(myObj)) {
      myArr.push({
        ["Бренд"]: value[0]["Бренд"],
        ["Наименование"]: value[0]["Наименование"],
        ["Год"]: value[0]["Год"],
        ["Автор"]: value[0]["Автор"],
        ["Серия"]: value[0]["Серия"],
        ["Языки"]: value[0]["Языки"],
        ["Артикул продавца"]: value[0]["Артикул продавца"],
        ["Заказали шт."]: value[0]["Заказали шт."],
        ["Поступления шт."]: value.reduce(
          (res , val ) => res + val["Поступления шт."],
          0
        ),
        ["Выкупили, шт."]: value.reduce(
          (res , val ) => res + val["Выкупили, шт."],
          0
        ),
        ["Сумма заказов минус комиссия WB, руб."]: value.reduce(
          (res , val ) =>
            res + val["Сумма заказов минус комиссия WB, руб."],
          0
        ),
        ["Текущий остаток, шт."]: value.reduce(
          (res , val ) => res + val["Текущий остаток, шт."],
          0
        ),
        ["К перечислению за товар, руб."]: value.reduce(
          (res , val ) => res + val["К перечислению за товар, руб."],
          0
        ),
        list: value,
        ["Дубликаты"]: value.length,
        ["Предмет"]: value[0]["Предмет"],
        key: uuidv4(),
      });
    }
    return myArr;
  }
  

  const handleFile = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const sheetName = wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const headerTable = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
          const dataTable = XLSX.utils.sheet_to_json(ws, { header: 2 });

          const headerTableNew = ["Дубликаты"].concat([
            ...(headerTable),
          ]);

          const newDataTable = myGroup(mySort(dataTable));

          setData(newDataTable);
          setHeader(headerTableNew);
        }
      };
      reader.readAsBinaryString(files[0]);
      
    }
  };

  // const filteredData = () => {
  //   if (searchSeries && searchAuthor) {
  //     const newData = data.filter((item) => {
  //       return item["Автор"].toLowerCase().includes(searchAuthor.toLowerCase());
  //     });
  //     return newData.filter((item) => {
  //       return item["Серия"].toLowerCase().includes(searchSeries.toLowerCase());
  //     });
  //   }
  //   return data.filter((item) => {
  //     return item[inputFocus].toLowerCase().includes(filterFocus.toLowerCase());
  //   });
  // };

  const columns = header.map((item ) => {
    if (item === "Дубликаты") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Текущий остаток, шт.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "К перечислению за товар, руб.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Поступления шт.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Выкупили, шт.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Сумма заказов минус комиссия WB, руб.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Заказали шт.") {
      return {
        title: item,
        dataIndex: item,
        sorter: (a , b ) => a[item] - b[item],
        key: uuidv4(),
      };
    }
    if (item === "Предмет") {
      return {
        title: item,
        dataIndex: item,
        filters: [
          { text: "Книги", value: "Книги" },
          { text: "Букинистика", value: "Букинистические книги" },
        ],
        onFilter: (value, record ) => record[item].includes(value),
        key: uuidv4(),
      };
    }
    if (item === "Автор") {
      return {
        title: (
          <>
            {item}
            {/* <Space.Compact>
              <Input
                style={{ width: "200px" }}
                placeholder="Введите автора"
                onChange={handleInputAuthor}
                value={searchAuthor}
              />
            </Space.Compact> */}
            {/* {filteredData().length} */}
            {/* <div>
              <Button type="primary" onClick={handleSort}>
                Отсортировать
              </Button>
            </div>
            <div>
              <Button type="primary" onClick={handleGroup}>
                Сгруппировать
              </Button>
            </div> */}
          </>
        ),
        dataIndex: item,
        key: uuidv4(),
      };
    }
    if (item === "Серия") {
      return {
        title: (
          <>
            {item}
            {/* <Space.Compact>
              <Input
                style={{ width: "200px" }}
                placeholder="Введите серию"
                onChange={handleInputSeries}
                value={searchSeries}
              />
            </Space.Compact> */}
            {/* {filteredData().length} */}
          </>
        ),
        dataIndex: item,
        key: uuidv4(),
      };
    }

    return {
      title: item,
      dataIndex: item,
      key: uuidv4(),
    };
  });

  const columns2 = header.map((item ) => {
    return {
      title: item,
      dataIndex: item,
      key: uuidv4(),
    };
  });

  return (
    <div>
      <h2>Upload Excel File</h2>
      <input type="file" onChange={handleFile} />
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                columns={columns2}
                dataSource={record.list}
                pagination={false}
              />
            );
          },
          rowExpandable: (record) => record["Дубликаты"] !== 1,
        }}
        expandRowByClick
      />
      {/* {loading && (
        <Spin tip="Loading" size="large">
          <div className="content" />
        </Spin>
      )} */}
    </div>
  );
}

export default App;
