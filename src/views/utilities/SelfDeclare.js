import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  db,
  queryGetUserInfoByEmail,
  queryGetUserInfoByPhone,
  dataRef,
  injectionRequestRef,
  storage,
  selfDeclareRef,
  injectionRef,
} from "../../firebase/firebase";
import { onSnapshot, doc, setDoc, orderBy, addDoc } from "@firebase/firestore";

import { Container, Card, Button, TextField, Stack, MenuItem, FormControl, Select, InputLabel, Typography, CardContent, Grid, Box } from "@mui/material";

import { makeStyles } from "@mui/styles";

const SelfDeclare = () => {
  const [totalUserInfo, setTotalUserInfo] = useState("");
  const [totalInjectionInfo, setTotalInjectionInfo] = useState([]);

  const [infectedTimes, setInfectedTimes] = useState("");

  const [infectedDate1, setInfectedDate1] = useState("");
  const [infectedDate2, setInfectedDate2] = useState("");
  const [infectedDate3, setInfectedDate3] = useState("");

  const [curedDate1, setCuredDate1] = useState("");
  const [curedDate2, setCuredDate2] = useState("");
  const [curedDate3, setCuredDate3] = useState("");

  const [infectedNote1, setInfectedNote1] = useState("");
  const [infectedNote2, setInfectedNote2] = useState("");
  const [infectedNote3, setInfectedNote3] = useState("");

  const [userInfo, setUserInfo] = useState("");
  const [userRole, setUserRole] = useState("");

  const [declareRefInfo, setDeclareRefInfo] = useState(null)
  const [declareRefId, setDeclareRefId] = useState("")

  const [injectRefInfo, setInjectRefInfo] = useState(null);
  const [injectRefId, setInjectRefId] = useState("");


  const [userEmail, setUserEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [userId, setUserId] = useState(null);
  // const [userIdNumber, setUserIdNumber] = useState("");
  const [injectionInfo, setInjectionInfo] = useState({});
  const [injectionId, setInjectionId] = useState("");
  const [authInfo, setAuthInfo] = useState('');

  const [isCurrentlyInfected, setIsCurrentlyInfected] = useState(false);

  const useStyles = makeStyles((theme) => ({
    header: {
      marginBottom: '30px',
      textTransform: 'uppercase',
    },
    textField: {
      marginBottom: '22px'
    },
    box: {
      border: '2px solid black',
      borderRadius: '10px',
      boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)',
      padding: '10px 0',
      margin: '10px 0',
    },
    infected1: {
      backgroundColor: '#dff9fb',
    },
    infected2: {
      backgroundColor: '#dcdde1'
    },
    infected3: {
      backgroundColor: '#fab1a0'
    }
  }));

  const classes = useStyles();

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setIsLoggedIn(currentUser);
      setUserEmail(currentUser.email);
    } else {
      setIsLoggedIn(null);
    }
  });


  const submitSelfDeclareHandler = (e) => {
    e.preventDefault();
    setDoc(doc(db, "selfDeclareData", declareRefId), {
      ...declareRefInfo,
      infectedDate1: infectedDate1,
      infectedDate2: infectedDate2,
      infectedDate3: infectedDate3,
      infectedNote1: infectedNote1,
      infectedNote2: infectedNote2,
      infectedNote3: infectedNote3,
      curedDate1,
      curedDate2,
      curedDate3,

    });
    setDoc(doc(db, "injectionData", injectRefId), {
      ...declareRefInfo,
      infectedTimes: infectedTimes,
    });
  };

  useEffect(() => {
    onSnapshot(dataRef, orderBy("name", "desc"), (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUserInfo(users);
    });
    if (isLoggedIn) {
      onSnapshot(queryGetUserInfoByEmail(isLoggedIn.email), (snapshot) => {
        snapshot.forEach((data) => {
          setAuthInfo(data.data());
          setPhone(data.data().phone);
          setUserId(data.id);
          setUserRole(data.data().assignedRole);
        });
      });
      if (authInfo.name) {
        onSnapshot(queryGetUserInfoByPhone(selfDeclareRef, phone), (snapshot) => {
          console.log(snapshot._snapshot.docChanges.length);
          if (snapshot._snapshot.docChanges.length === 0) {
            addDoc(selfDeclareRef, {
              phone: phone,
              firstDose: "",
              secondDose: "",
              thirdDose: "",
              numberOfInjections: "",
              infectedTimes: "",
              injectDate1: "",
              injectDate2: "",
              injectDate3: "",
              injectPerson1: "",
              injectPerson2: "",
              injectPerson3: "",
              name: authInfo.name,
            });
          }
          snapshot.forEach((data) => {
            setDeclareRefInfo(data.data());
            setDeclareRefId(data.id);
          });
        }
        );
        onSnapshot(queryGetUserInfoByPhone(injectionRef, phone), (snapshot) => {
          console.log(snapshot._snapshot.docChanges.length);
          snapshot.forEach((data) => {
            setInjectRefInfo(data.data());
            setInjectRefId(data.id);
          });
        })
      }
    }

  }, [isLoggedIn, userRole]);

  return (
    <Container>
      {userRole === "admin" ||
        userRole === "moderator" ||
        userRole === "user" ? (
        <Card>
          {declareRefInfo ? (
            <CardContent sx={{ textAlign: "center" }}>
              <Grid container spacing={2} >
                <Grid item sm={6}>
                  <Typography variant="h4" className={classes.header} gutterBottom>
                    Thông tin người dùng
                  </Typography>
                  <TextField
                    className={classes.textField}
                    label="Họ và tên:"
                    value={authInfo.name}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Ngày tháng năm sinh:"
                    value={authInfo.dob}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Số mũi đã tiêm:"
                    value={declareRefInfo.numberOfInjections}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 1:"
                    value={declareRefInfo.firstDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 2:"
                    value={declareRefInfo.secondDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 3:"
                    value={declareRefInfo.thirdDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">
                      Tình trạng nhiễm bệnh hiện tại
                    </InputLabel>
                    <Select
                      label={"Tình trạng nhiễm bệnh hiện tại"}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => setIsCurrentlyInfected(e.target.value)}
                      value={isCurrentlyInfected}
                    >
                      <MenuItem value="true">Có</MenuItem>
                      <MenuItem value="false">Không</MenuItem>
                    </Select>
                  </FormControl>

                  <Stack>
                    <Typography variant="h6" gutterBottom>
                      Lịch sử lây nhiễm
                    </Typography>
                    {declareRefInfo.infectedTimes === "" ? (
                      <Typography variant="subtitle1" gutterBottom>
                        <em>Bạn chưa từng nhiễm bệnh</em>
                      </Typography>
                    ) : (
                      <Stack>
                        {declareRefInfo.infectedDate1 === "" ? (
                          <></>
                        ) : (
                          <>
                            <TextField
                              className={classes.textField}
                              label="Ngày nhiễm bệnh lần 1:"
                              value={declareRefInfo.infectedDate1}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <TextField
                              className={classes.textField}
                              label="Ngày khỏi bệnh:"
                              value={declareRefInfo.curedDate1}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <>
                              {declareRefInfo.infectedNote1 === "" ? (
                                <TextField
                                  className={classes.textField}
                                  label="Ghi chú"
                                  value="Không có"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              ) : (
                                <TextField
                                  className={classes.textField}
                                  label="Ghi chú:"
                                  value={declareRefInfo.infectedNote1}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              )}
                            </>
                          </>
                        )}
                        {declareRefInfo.infectedDate2 === "" ? (
                          ""
                        ) : (
                          <>
                            <TextField
                              className={classes.textField}
                              label="Ngày nhiễm bệnh lần 2:"
                              value={declareRefInfo.infectedDate2}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <TextField
                              className={classes.textField}
                              label="Ngày khỏi bệnh:"
                              value={declareRefInfo.curedDate2}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <>
                              {declareRefInfo.infectedNote2 === "" ? (
                                <TextField
                                  className={classes.textField}
                                  label="Không có"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              ) : (
                                <TextField
                                  className={classes.textField}
                                  label="Ghi chú:"
                                  value={declareRefInfo.infectedNote2}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              )}
                            </>
                          </>
                        )}
                        {declareRefInfo.infectedDate3 === "" ? (
                          ""
                        ) : (
                          <>
                            <TextField
                              className={classes.textField}
                              label="Ngày nhiễm bệnh lần 2:"
                              value={declareRefInfo.infectedDate3}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <TextField
                              className={classes.textField}
                              label="Ngày khỏi bệnh:"
                              value={declareRefInfo.curedDate3}
                              InputProps={{
                                readOnly: true,
                              }}
                              fullWidth
                            />
                            <>
                              {declareRefInfo.infectedNote3 === "" ? (
                                <TextField
                                  className={classes.textField}
                                  label="Không có"
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              ) : (
                                <TextField
                                  className={classes.textField}
                                  label="Ghi chú:"
                                  value={declareRefInfo.infectedNote3}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                  fullWidth
                                />
                              )}
                            </>
                          </>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Grid>

                <Grid item sm={6}>
                  <Stack alignItems="center" sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" className={classes.header} gutterBottom>
                      Khai báo số lần nhiễm bệnh
                    </Typography>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                      <InputLabel id="demo-simple-select-label">
                        Số lần nhiễm bệnh
                      </InputLabel>
                      <Select
                        label={"Số lần nhiễm bệnh"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(e) => setInfectedTimes(e.target.value)}
                        value={infectedTimes}
                      >
                        <MenuItem value="" disabled>
                          Số lần nhiễm bệnh
                        </MenuItem>
                        <MenuItem value="1 lần">1 lần</MenuItem>
                        <MenuItem value="2 lần">2 lần</MenuItem>
                        <MenuItem value="3 lần">3 lần</MenuItem>
                      </Select>
                    </FormControl>

                    {infectedTimes === "1 lần" ? (
                      <Grid container>
                        <Grid item >
                          <Box className={`${classes.box} ${classes.infected1}`}>
                            <TextField
                              sx={{ margin: 1, minWidth: 210 }}
                              id="standard-basic"
                              helperText="Lần nhiễm số 1"
                              variant="outlined"
                              type="date"
                              className="register-dob"
                              value={infectedDate1}
                              onChange={(e) => setInfectedDate1(e.target.value)}
                            />
                            <TextField
                              sx={{ margin: 1, minWidth: 210 }}
                              id="standard-basic"
                              helperText="Ngày khỏi bệnh"
                              variant="outlined"
                              type="date"
                              className="register-dob"
                              value={curedDate1}
                              onChange={(e) => setCuredDate1(e.target.value)}
                            />
                            <TextField
                              sx={{ margin: 1, minWidth: 210 }}
                              id="standard-basic"
                              variant="outlined"
                              type="text"
                              label="Ghi chú lần 1"
                              className="addInfo-findWithPhone"
                              value={infectedNote1}
                              onChange={(e) => setInfectedNote1(e.target.value)}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    ) : (
                      <Stack>
                        {infectedTimes === "2 lần" ? (
                          <Grid container spacing={2}>
                            <Grid item lg={6}>
                              <Box className={`${classes.box} ${classes.infected1}`}>
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  helperText="Lần nhiễm số 1"
                                  variant="outlined"
                                  type="date"
                                  className="register-dob"
                                  value={infectedDate1}
                                  onChange={(e) => setInfectedDate1(e.target.value)}
                                />
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  helperText="Ngày khỏi bệnh"
                                  variant="outlined"
                                  type="date"
                                  className="register-dob"
                                  value={curedDate1}
                                  onChange={(e) => setCuredDate1(e.target.value)}
                                />
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  variant="outlined"
                                  type="text"
                                  label="Ghi chú lần 1"
                                  className="addInfo-findWithPhone"
                                  value={infectedNote1}
                                  onChange={(e) => setInfectedNote1(e.target.value)}
                                />
                              </Box>
                            </Grid>
                            <Grid item lg={6}>
                              <Box className={`${classes.box} ${classes.infected2}`}>
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  helperText="Lần nhiễm số 2"
                                  variant="outlined"
                                  type="date"
                                  className="register-dob"
                                  value={infectedDate2}
                                  onChange={(e) => setInfectedDate2(e.target.value)}
                                />
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  helperText="Ngày khỏi bệnh"
                                  variant="outlined"
                                  type="date"
                                  className="register-dob"
                                  value={curedDate2}
                                  onChange={(e) => setCuredDate2(e.target.value)}
                                />
                                <TextField
                                  sx={{ margin: 1, minWidth: 210 }}
                                  id="standard-basic"
                                  variant="outlined"
                                  type="text"
                                  label="Ghi chú lần 2"
                                  className="addInfo-findWithPhone"
                                  value={infectedNote2}
                                  onChange={(e) => setInfectedNote2(e.target.value)}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        ) : (
                          <Stack>
                            {infectedTimes === "3 lần" ? (
                              <Grid container sx={{ justifyContent: 'center' }}>
                                <Box className={`${classes.box} ${classes.infected1}`}>
                                  <Grid item>
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Lần nhiễm số 1"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={infectedDate1}
                                      onChange={(e) =>
                                        setInfectedDate1(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Ngày khỏi bệnh"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={curedDate1}
                                      onChange={(e) =>
                                        setCuredDate1(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      variant="outlined"
                                      type="text"
                                      label="Ghi chú lần 1"
                                      className="addInfo-findWithPhone"
                                      value={infectedNote1}
                                      onChange={(e) =>
                                        setInfectedNote1(e.target.value)
                                      }
                                    />
                                  </Grid>
                                </Box>
                                <Box className={`${classes.box} ${classes.infected2}`}>
                                  <Grid item>
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Lần nhiễm số 2"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={infectedDate2}
                                      onChange={(e) =>
                                        setInfectedDate2(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Ngày khỏi bệnh"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={curedDate2}
                                      onChange={(e) =>
                                        setCuredDate2(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      variant="outlined"
                                      type="text"
                                      label="Ghi chú lần 2"
                                      className="addInfo-findWithPhone"
                                      value={infectedNote2}
                                      onChange={(e) =>
                                        setInfectedNote2(e.target.value)
                                      }
                                    />
                                  </Grid>
                                </Box>
                                <Box className={`${classes.box} ${classes.infected3}`}>
                                  <Grid item>
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Lần nhiễm số 3"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={infectedDate3}
                                      onChange={(e) =>
                                        setInfectedDate3(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      helperText="Ngày khỏi bệnh"
                                      variant="outlined"
                                      type="date"
                                      className="register-dob"
                                      value={curedDate3}
                                      onChange={(e) =>
                                        setCuredDate3(e.target.value)
                                      }
                                    />
                                    <TextField
                                      sx={{ margin: 1, minWidth: 210 }}
                                      id="standard-basic"
                                      variant="outlined"
                                      type="text"
                                      label="Ghi chú lần 3"
                                      className="addInfo-findWithPhone"
                                      value={infectedNote3}
                                      onChange={(e) =>
                                        setInfectedNote3(e.target.value)
                                      }
                                    />
                                  </Grid>
                                </Box>
                              </Grid>
                            ) : (
                              <></>
                            )}
                          </Stack>
                        )}
                      </Stack>
                    )}
                    <Button
                      variant="contained"
                      type="sumbit"
                      sx={{ marginBottom: 5, marginTop: 2 }}
                      onClick={submitSelfDeclareHandler}
                    >
                      Gửi
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

            </CardContent>
          ) : (
            <Stack className="addRole-form">
            </Stack>
          )}
        </Card>
      ) : (
        <Stack>
          <Stack>
            <Typography variant="h5" gutterBottom>
              Vui lòng đăng nhập để tiếp tục
            </Typography>
          </Stack>
          <Stack alignItems="center">
            <Button variant="contained">Quay lại trang chủ</Button>
          </Stack>
        </Stack>
      )}
    </Container>
  );
};


export default SelfDeclare;