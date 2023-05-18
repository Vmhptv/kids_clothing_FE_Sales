import React, { Component, useState, useEffect, useRef } from "react";
import { getToken } from "../core/common/Common";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import "./sale.css";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Autocomplete,
  Box,
  IconButton,
} from "@mui/material";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Add, Close } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

//
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// ///////////////////

//
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
//
const SaleComponent = () => {
  const [dataSearch, setDataSearch] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [listProductDetail, setProductDetail] = useState([]);
  const [checked, setChecked] = React.useState([true, false]);
  const [quantity, setQuantity] = React.useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [sdt, setSdt] = useState("");
  const [bySdt, setBySdt] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [inputValue, setInputValue] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  // dialog
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //Yêu cầu login
  const configToken = {
    headers: {
      Authorization: "Bearer " + getToken(),
    },
  };

  useEffect(() => {
    findAllByIsDeleteFalse();
    calculateTotalPrice();
    findAllProductDetail();
    calculateTotalQuantity();
    calculateTotalAmount(dataSearch);
    calculateTotalPrices();
  }, [quantities, bySdt, dataSearch]);

  const findAllByIsDeleteFalse = () => {
    axios
      .get(
        `http://localhost:8080/Customer/ProductController/findAllByIsDeleteFalse`,
        configToken
      )
      .then((response) => {
        setListProduct(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const findAllProductDetail = () => {
    axios
      .get(
        `http://localhost:8080/Customer/ProductDetailController/findAllProductDetai`,
        configToken
      )
      .then((response) => {
        setProductDetail(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const findSdt = (event) => {
    const sdts = event.target.value;
    setSdt(sdts);
    if (sdt.length == 9) {
      axios
        .get(
          `http://localhost:8080/Manager/AccountManagerController/findByPhone/${sdts}`,
          configToken
        )
        .then((response) => {
          setBySdt(response.data.data[0].username);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const handleCheckboxChange = (event) => {
    const productId = event.target.value;
    if (event.target.checked) {
      const foundObject = listProduct.find((object) => object.id == productId);
      setDataSearch([...dataSearch, foundObject]);
      let total = 0;
      total += dataSearch.price;
      setTotalPrice(total);
    } else {
      const updatedDataSearch = dataSearch.filter(
        (object) => object.id != productId
      );
      setDataSearch(updatedDataSearch);
      setQuantity(dataSearch.length - 1);
    }
  };

  const handleQuantityChange = (event, id, currentPrice) => {
    // const { value } = event.target;
    // setQuantities((prevQuantities) => ({
    //   ...prevQuantities,
    //   [itemId]: Number(value),
    // }));
    const newQuantity = parseInt(event.target.value);
    const newPrice = newQuantity * currentPrice;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newQuantity,
    }));
    calculateTotalQuantity();
    setTotalAmount(
      (prevTotalPrice) => prevTotalPrice - currentPrice + newPrice
    );
  };
  const calculateTotalQuantity = () => {
    let sum = 0;
    dataSearch.forEach((item) => {
      sum += quantities[item.id] || 1;
    });
    setTotalAmount(sum);
    setTotalQuantity(sum);
  };
  const calculateTotalPrices = () => {
    let sum = 0;
    dataSearch.forEach((item) => {
      const quantity = quantities[item.id] || 1;
      const price = item.product.price;
      sum += quantity * price;
    });
    setTotalAmount(sum);
  };
  const handleDelete = (itemId) => {
    // Xử lý sự kiện khi click vào IconButton
    const updatedData = dataSearch.filter((item) => item.id !== itemId);
    setDataSearch(updatedData);
  };
  const getTotal = () => {
    let total = 0;
    Object.values(quantities).forEach((quantity) => {
      total += quantity || 1;
    });
    return total;
  };
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    dataSearch.forEach((item) => {
      const quantity = quantities[item.id] || 1;
      totalPrice += quantity * item.price;
    });
    setTotalPrice(totalPrice);
  };
  const handleInputChange = (event) => {
    const productId = event.target.value;
    setInputValue(event.target.value);
    axios
      .get(
        `http://localhost:8080/Customer/ProductDetailController/findByIdProduct/${productId}`,
        configToken
      )
      .then((response) => {
        setProductDetail(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSelectProduct = (product) => {
    // Xử lý khi người dùng chọn đối tượng product
    console.log("Selected product:", product);
    // Lưu trữ đối tượng product vào state hoặc thực hiện các xử lý khác
    setDataSearch([...dataSearch, product]);
  };
  const calculateTotalAmount = (list) => {
    let sum = 0;
    list.forEach((item) => {
      sum += item.product.price;
    });
    setTotalAmount(sum);
  };
  // ==========================================================
  const handlePay = () => {
    // Xử lý sự kiện thanh toán đơn hàng
    const list_quantity = dataSearch.map(item => ({
      id_quantity: item.id,
      bill_quantity: 1,
    }));
    console.log('Nút được nhấp vào');
    const billDto = {
      statusshipping: "Đơn không đăng nhập",
      transportFee: 123456,
      voucher_id: null,
      discount: 0,
      downtotal: totalAmount,
      payment: 0,
      total: totalAmount,
      address: "Mua hàng tại quầy",
      note: null,
      fullname: bySdt,
      refund: null,
      sdt: sdt,
      list_quantity,
    };
    axios
      .post(`http://localhost:8080/api/bill/creat`, billDto, configToken)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <hr />
      <header>
        <div
          style={{
            backgroundColor: "#f7f7f8",
          }}
        >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={listProduct}
            disableCloseOnSelect
            getOptionLabel={(option) => `${option.id}`}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                  value={option.id}
                  // key={option.id}
                  onChange={handleCheckboxChange}
                />
                <img loading="lazy" width="20" src={option.image} />
                {/* {option.id} */}
                {option.name}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mã sản phẩm"
                placeholder="Favorites"
              />
            )}
          />
          {/* dialog */}
          <div>
            <Button variant="outlined" onClick={handleClickOpen}>
              Open dialog
            </Button>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
            >
              <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
              >
                Modal title
                <FormControl variant="standard">
                  <InputLabel htmlFor="component-helper">Name</InputLabel>
                  <Input
                    id="component-helper"
                    aria-describedby="component-helper-text"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ảnh</TableCell>
                      <TableCell>Tên sản phẩm</TableCell>
                      <TableCell>Gía tiền</TableCell>
                      <TableCell>Màu sắc</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Số lượng còn</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listProductDetail.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <img
                            loading="lazy"
                            width="60"
                            src={item.product.image}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <p style={{ fontSize: "13px", margin: "0px" }}>
                            {item.product.name}
                          </p>
                        </TableCell>
                        <TableCell>{item.product.price}</TableCell>
                        <TableCell>{item.property.name}</TableCell>
                        <TableCell>{item.size.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleSelectProduct(item)}>
                            Chọn
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose}>
                  Save changes
                </Button>
              </DialogActions>
            </BootstrapDialog>
          </div>
          <div
            className="col-md-2"
            style={{
              display: "flex",
              alignItems: "right",
              justifyContent: "right",
            }}
          ></div>
          <div>
            <article>
              <div className="row">
                <div
                  className="col-md-8"
                  style={{
                    backgroundColor: "",
                    float: "left",
                    width: "70%",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Gía tiền</TableCell>
                        <TableCell>Màu sắc</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Tổng tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataSearch.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              size="small"
                              onClick={() => handleDelete(item.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                          <TableCell align="left">
                            <p style={{ fontSize: "13px", margin: "0px" }}>
                              {item.product.name}
                            </p>
                          </TableCell>
                          <TableCell>{item.product.price}</TableCell>
                          <TableCell>{item.property.name}</TableCell>
                          <TableCell>{item.size.name}</TableCell>
                          <TableCell>
                            <TextField
                              id={`input-${item.id}`}
                              type="number"
                              InputProps={{ inputProps: { min: 1 } }}
                              variant="standard"
                              focused
                              value={quantities[item.id] || 1}
                              onChange={(event) =>
                                handleQuantityChange(
                                  event,
                                  item.id,
                                  quantities[item.id] * item.product.price
                                )
                              }
                            />
                          </TableCell>

                          <TableCell>
                            {quantities[item.id] * item.product.price ||
                              item.product.price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div
                  className="col-md-4"
                  style={{
                    float: "right",
                    // backgroundColor:"red",
                    width: "30%",
                  }}
                >
                  <div>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <AccountCircle sx={{ color: "action.active" }} />
                        <TextField
                          id="input-with-sx"
                          label="Thêm khách hàng vào đơn hàng"
                          variant="standard"
                          value={sdt}
                          onChange={findSdt}
                        />
                      </Box>
                    </Box>
                  </div>
                  <div>
                    <h3>Tên khách hàng: {bySdt || ""}</h3>
                    <h3>
                      Số lượng sản phẩm:{" "}
                      {/* {getTotal() + dataSearch.length || dataSearch.length} */}
                      {totalQuantity ||
                        getTotal() + dataSearch.length ||
                        dataSearch.length}
                    </h3>
                    <h3>Tổng tiền: {totalAmount}</h3>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handlePay}
                    >
                      Thanh toán
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </header>
    </div>
  );
};

export default SaleComponent;
