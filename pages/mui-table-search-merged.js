import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

import { getSession } from "next-auth/react";
import { useSession, signIn } from "next-auth/react";

export default function CollapsibleTable() {
  const { data: session } = useSession();
  const [testsList, setTestsList] = useState([]);

  const [openStates, setOpenStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTestsList, setFilteredTestsList] = useState([]);

  useEffect(() => {
    const fetchTestsList = async () => {
      const data = await fetcher("/api/get-testslist");
      const specialTestsData = await fetcher("/api/get-specialTestsList");
      if (data && specialTestsData) {
        const mergedTestsList = [...data, ...specialTestsData];
        setTestsList(mergedTestsList);
        setFilteredTestsList(mergedTestsList);
        setOpenStates(
          Object.fromEntries(mergedTestsList.map((item) => [item.id, false]))
        );
      } else {
        console.error("Error fetching tests list from database");
      }
    };

    if (testsList.length === 0) {
      fetchTestsList();
    }
  }, [testsList]);

  const handleRowClick = (itemId) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const ExpiredRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.error.main,
  }));

  const SoonRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.main,
  }));

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    const filteredTests = testsList.filter((test) => {
      const name = test.testName ? test.testName : test.specialTestName;
      return name.toLowerCase().includes(inputValue.toLowerCase());
    });
    setFilteredTestsList(filteredTests);
  };

  if (session) {
    return (
      <TableContainer component={Paper} className="p-4">
        <Box sx={{ maxWidth: 800 }}>
          <TextField
            label="Search by Test Name"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleSearchInputChange}
          />
        </Box>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Test Name</TableCell>
              <TableCell>Total Stocks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTestsList.map((item) => (
              <React.Fragment key={item.id}>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowClick(item.id)}
                    >
                      {openStates[item.id] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {item.testName ? item.testName : item.specialTestName}
                  </TableCell>

                  <TableCell>
                    {item.totalStocks ? item.totalStocks : "N/A"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openStates[item.id]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Stocks
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Instrument</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Expiry Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.stocksArray &&
                              item.stocksArray.map((stock) => {
                                const expiryDate = new Date(stock.expiryDate);
                                const today = new Date();
                                const oneMonthFromToday = new Date(
                                  today.getFullYear(),
                                  today.getMonth() + 1,
                                  today.getDate()
                                );
                                return (
                                  <React.Fragment key={stock.id}>
                                    {expiryDate < today ? (
                                      <ExpiredRow key={stock.id?.$numberInt}>
                                        <TableCell>
                                          {stock.instrument}
                                        </TableCell>
                                        <TableCell>{stock.amount}</TableCell>
                                        <TableCell>
                                          {stock.expiryDate}
                                        </TableCell>
                                      </ExpiredRow>
                                    ) : expiryDate < oneMonthFromToday ? (
                                      <SoonRow key={stock.id?.$numberInt}>
                                        <TableCell>
                                          {stock.instrument}
                                        </TableCell>
                                        <TableCell>{stock.amount}</TableCell>
                                        <TableCell>
                                          {stock.expiryDate}
                                        </TableCell>
                                      </SoonRow>
                                    ) : (
                                      <TableRow key={stock.id?.$numberInt}>
                                        <TableCell>
                                          {stock.instrument}
                                        </TableCell>
                                        <TableCell>{stock.amount}</TableCell>
                                        <TableCell>
                                          {stock.expiryDate}
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-bold mb-4">Please login to continue</h2>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
}
