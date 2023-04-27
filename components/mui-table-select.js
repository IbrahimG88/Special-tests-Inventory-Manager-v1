//you can ignore this file embedded in another component
import * as React from "react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";

export default function ListTable() {
  const testsList = props.testsList;

  // select the rows item.id
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "testName", headerName: "Test Name", width: 130 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={testsList}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
          console.log("newRowSelectionModel", newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
      />
    </div>
  );
}
