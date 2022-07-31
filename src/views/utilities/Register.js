import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import useDistrict from "../../hooks/useDistrict";
import axios from "axios";
import { addDoc, setDoc, onSnapshot, doc } from "@firebase/firestore";
import { dataRef, injectionRef } from "../../firebase/firebase";
import { auth, queryGetUserInfoByPhone, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { Container, Button, TextField, Stack, MenuItem, FormControl, Select, InputLabel, Typography, Card, CardActions, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [inputEmail, setInputEmail] = useState("");
  // const [inputName, setInputName] = useState("");
  const [inputDate1, setInputDate1] = useState("");
  // const [inputAddress, setInputAddress] = useState("");

  const [fetchData, setFetchData] = useState([]);
  const [inputCity, setInputCity] = useState("");

  const [district, setDistrict] = useState([]);
  const [inputDistrict, setInputDistrict] = useState("");

  const [ward, setWard] = useState([]);
  const [inputWard, setInputWard] = useState("");

  const [cityName, setCityName] = useState("");
  const [position, setPosition] = useState(0);

  //useDistrict
  const { districtName } = useDistrict(district.name);


  const inputEmailHandler = (e) => {
    setInputEmail(e.target.value);
  };

  const districtNameHandler = () => {
    if (district !== null) {
      if (district.name.includes("Tỉnh")) {
        setCityName(district.name.replace("Tỉnh", ""));
      }
    }
  };
  const cityNameHandler = () => {
    if (district !== null) {
      if (district.name.includes("Thành phố")) {
        setCityName(district.name.replace("Thành phố", ""));
      }
    }
  };

  const cityHandler = (e) => {
    setInputCity(e.target.value);
    setInputDistrict("");
    setInputWard("");
  };

  const districtHandler = (e) => {
    setInputDistrict(e.target.value);
    setInputWard("");
    // districtNameHandler();
    // cityNameHandler();
  };


  useEffect(() => {
    const fetchDistrict = async () => {
      if (inputCity) {
        const { data } = await axios.get(
          `https://provinces.open-api.vn/api/p/${inputCity}?depth=2`
        );
        setDistrict(data);
      } else {
        setDistrict("");
      }
    };

    const fetchWard = async () => {
      if (inputDistrict) {
        const { data } = await axios.get(
          `https://provinces.open-api.vn/api/d/${inputDistrict}?depth=2`
        );
        setWard(data);
      }
    };

    fetchDistrict();
    fetchWard();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setInputEmail(currentUser.email);
      }
    });

    axios.get("https://provinces.open-api.vn/api/?depth=1").then((result) => {
      const { data } = result;

      setFetchData(data);
    });

  }, [inputCity, inputDistrict, cityName]);

  const [userInfo, setUserInfo] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [totalUserInfo, setTotalUserInfo] = useState("");

  const useStyles = makeStyles((theme) => ({
    header: {
      marginBottom: '30px',
      textTransform: 'uppercase',
    },
    textField: {
      marginBottom: '38px'
    },
    form: {
      border: '1px solid black',
      boxShadow: '1px 2px 4px rgba(0,0,0,0.4)',
      borderRadius: '10px',
      padding: '20px',
    }
  }));

  const classes = useStyles();

  return (
    <Container className="container register">
      <Card sx={{ minWidth: '270px' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <form
            onSubmit={handleSubmit((data) => {
              if (
                window.confirm("Hãy chắc chắn những thông tin đã nhập là chính xác")
              ) {
                if (district && ward) {
                  const updateData = addDoc(dataRef, {
                    city: district.name,
                    district: ward.name,
                    ward: inputWard,
                    name: data.inputName,
                    idNumber: data.inputId,
                    email: inputEmail,
                    phone: data.inputPhone,
                    dob: data.inputDate,
                    address: data.inputAddress,
                    assignedRole: "user",
                    infected: false,
                    districtId: districtName,
                  });

                  addDoc(injectionRef, {
                    numberOfInjections: "Chưa tiêm",
                    phone: data.inputPhone,
                    firstDose: "",
                    secondDose: "",
                    thirdDose: "",
                    infectedTimes: "",
                    injectDate1: "",
                    injectDate2: "",
                    injectDate3: "",
                    injectPerson1: "",
                    injectPerson2: "",
                    injectPerson3: "",
                    dataSubmitted: false,
                    vaccinated: false,
                    isCurrentlyInfected: false,
                    verifiedByAdmin: false,
                    infectedDate1: "",
                    infectedDate2: "",
                    infectedDate3: "",
                    infectedNote1: "",
                    infectedNote2: "",
                    infectedNote3: "",
                    curedDate1: "",
                    curedDate2: "",
                    curedDate3: "",
                    infectedTimes: "",
                  });

                  if (updateData) {
                    window.alert("Đăng ký thành công");
                    navigate("/");
                  }
                }
              }
              // console.log(data, inputWard);
            })}
          >
            <Stack className={classes.form}>
              <Typography variant="h2" gutterBottom className={classes.header}>
                Đăng ký thông tin cá nhân
              </Typography>
              <TextField
                sx={{ margin: 1 }}
                variant="outlined"
                label="Email"
                type="text"
                className={classes.textField}
                onChange={inputEmailHandler}
                value={inputEmail}
              />
              <>
                <TextField
                  sx={{ margin: 1 }}
                  variant="outlined"
                  label="Họ và tên"
                  autoComplete="off"
                  className={classes.textField}
                  {...register("inputName", { required: "Điền tên" })}
                />
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ color: "red" }}
                >
                  {errors.inputName?.message}
                </Typography>
              </>

              <>
                <TextField
                  sx={{ margin: 1 }}
                  id="standard-basic"
                  variant="outlined"
                  className={classes.textField}
                  label="Số điện thoại"
                  autoComplete="off"
                  helperText=""
                  {...register("inputPhone", {
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                      message: "Nhập đúng định dạng số điện thoại",
                    },
                  })}
                />

                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ color: "red" }}
                >
                  {errors.inputPhone?.message}
                </Typography>

              </>

              <TextField
                variant="outlined"
                className={classes.textField}
                id="standard=basic"
                label="CMND/CCCD"
                autoComplete="off"
                helperText=""
                sx={{ margin: 1 }}
                {...register("inputId", { required: "Nhập số CMND hoặc số CCCD" })}
              />

              <>
                <TextField
                  sx={{ margin: 1, minWidth: 184 }}
                  id="standard-basic"
                  helperText="Tháng/Ngày/Năm sinh"
                  variant="outlined"
                  type="date"
                  className={classes.textField}
                  {...register("inputDate", { required: "Nhập ngày tháng năm sinh" })}
                />
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ color: "red" }}
                >
                  {errors.inputDate?.message}
                </Typography>
              </>
              <>
                <TextField
                  className={classes.textField}
                  label="Địa chỉ"
                  sx={{ margin: 1, marginBottom: 2 }}
                  id="standard-basic"
                  variant="outlined"
                  autoComplete="off"
                  {...register("inputAddress", { required: "Điền địa chỉ" })}
                />

                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  style={{ color: "red" }}
                >
                  {errors.inputAddress?.message}
                </Typography>
              </>
              <Stack>
                <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Thành phố</InputLabel>
                  <Select
                    sx={{ minWidth: 120 }}
                    label={"Thành phố"}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="register-city"
                    onChange={cityHandler}
                    value={inputCity}
                  >
                    <MenuItem value="" disabled>
                      Chọn thành phố
                    </MenuItem>
                    {fetchData &&
                      fetchData.map((val) => (
                        <MenuItem key={val.code} value={val.code}>
                          {val.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Quận/Huyện</InputLabel>
                  <Select
                    sx={{ minWidth: 120 }}
                    label={"Quận/Huyện"}
                    labelId="demo-simple-select-label1"
                    id="demo-simple-select"
                    className="register-district"
                    onChange={districtHandler}
                    value={inputDistrict}
                  >
                    <MenuItem value="" disabled>
                      Chọn quận huyện
                    </MenuItem>
                    {district.districts &&
                      district.districts.map((val) => (
                        <MenuItem key={val.code} value={val.code}>
                          {val.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Phường/Xã</InputLabel>
                  <Select
                    sx={{ minWidth: 120 }}
                    label={"Phường/Xã"}
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select"
                    className="register-district"
                    onChange={(event) => setInputWard(event.target.value)}
                    value={inputWard}
                  >
                    <MenuItem value="" disabled>
                      Chọn phường xã
                    </MenuItem>
                    {ward.wards &&
                      ward.wards.map((val) => (
                        <MenuItem key={val.code} value={val.name}>
                          {val.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Stack>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="submit">
                  Đăng ký
                </Button>
              </CardActions>
            </Stack>
          </form>
        </CardContent>
      </Card>

    </Container>
  );
};

export default Register;
//onClick={inputSubmithandler}
