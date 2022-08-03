import React, { useState, useEffect } from "react";
import { useNavigate,  Link as RouterLink } from "react-router-dom";


import { Link as MUILink } from "@mui/material";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  auth,
  queryGetUserInfoByEmail,
  queryGetUserInfoByPhone,
  queryGetUserInfoById,
  injectionRef,
  dataRef,
  selfDeclareRef,
} from "../../firebase/firebase";

import { onSnapshot, doc, setDoc, orderBy, getDocs } from "@firebase/firestore";
import { Typography, Stack, Container, Card, Box, CardContent, Button, Grid, TextField } from "@mui/material";
import axios from "axios";

import { makeStyles } from "@mui/styles";

const Main = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  //injectionRef
  const [injectionInfo, setInjectionInfo] = useState({});
  const [injectionId, setInjectionId] = useState("");
  //selfDeclareRef
  const [declareRefInfo, setDeclareRefInfo] = useState(null);
  const [declareRefId, setDeclareRefId] = useState("");
  //================
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);

  const [injectionInfoQuery, setInjectionInfoQuery] = useState("");
  const [injectionIdQuery, setInjectionIdQuery] = useState("");
  const [userInfoQuery, setUserInfoQuery] = useState("");
  const [userIdQuery, setUserIdQuery] = useState("");
  const [queryPhone, setQueryPhone] = useState("");
  const [queryId, setQueryId] = useState("");

  const [cases, setCases] = useState([]);
  const [location, setLocation] = useState("");
  const [todayCases, setTodayCases] = useState("");

  const useStyles = makeStyles((theme) => ({
    title: {
      paddingBottom: '30px',
      textTransform: 'uppercase',
    },
    box: {
      padding: '10px',
      borderRadius: '5px',
      boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
    },
    first: {
      backgroundColor: '#dfe6e9',
    },
    second: {
      backgroundColor: '#ecf0f1'
    },
    third: {
      backgroundColor: '#eee'
    },
    grid: {
      justifyContent: 'center',
      marginBottom: '30px'
    },
    textField: {
      margin: "20px 0",
    },
  }));

  const classes = useStyles();
  // query dataa
  const findInfoByPhoneHandler = (e) => {
    e.preventDefault();
    if (queryPhone) {
      onSnapshot(
        queryGetUserInfoByPhone(injectionRef, queryPhone),
        (snapshot) => {
          console.log(snapshot._snapshot.docChanges.length);
          if (snapshot._snapshot.docChanges.length === 0) {
            window.alert("Không tìm thấy dữ liệu người dùng");
          }

          snapshot.forEach((data) => {
            setInjectionInfoQuery(data.data());
            setInjectionIdQuery(data.id);
          });
        }
      );
      onSnapshot(queryGetUserInfoByPhone(dataRef, queryPhone), (snapshot) => {
        snapshot.forEach((data) => {
          // console.log(data.data().phone);
          setUserInfoQuery(data.data());
          setUserIdQuery(data.id);
        });
      });
    }
    if (queryId) {
      onSnapshot(queryGetUserInfoById(injectionRef, queryId), (snapshot) => {
        console.log(snapshot);
        if (snapshot._snapshot.docChanges.length === 0) {
          window.alert("Không tìm thấy dữ liệu người dùng");
          setUserInfoQuery("");
        }

        snapshot.forEach((data) => {
          setInjectionInfoQuery(data.data());
          setInjectionIdQuery(data.id);
        });
      });
      onSnapshot(queryGetUserInfoById(dataRef, queryId), (snapshot) => {
        snapshot.forEach((data) => {
          // console.log(data.data().phone);
          setUserInfoQuery(data.data());
          setUserIdQuery(data.id);
        });
      });
    }
  };

  const goBackHandler = (e) => {
    e.preventDefault();
    setUserInfoQuery("");
  };

  //axios
  const fetchCases = async () => {
    const { data } = await axios.post(
      `https://static.pipezero.com/covid/data.json`
    );
    setCases(data.locations);
  };

  const getLocalCases = () => {
    setTodayCases(cases[authInfo.districtId].casesToday);
    setLocation(cases[authInfo.districtId].name);
  };

  // `date` is a `Date` object
  const formatYmd = (date) => date.toISOString().slice(0, 10);
  const d = new Date();
  d.setDate(d.getDate() + 2);
  // Example

  useEffect(() => {

    fetchCases();

    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(currentUser);
        setUserEmail(currentUser.email);
      } else {
        setIsLoggedIn(null);
      }
    });

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
        });
      });
    }
    if (phone) {
      onSnapshot(queryGetUserInfoByPhone(injectionRef, phone), (snapshot) => {
        snapshot.forEach((data) => {
          setInjectionInfo(data.data());
          setInjectionId(data.id);
        });
      });
      onSnapshot(queryGetUserInfoByPhone(selfDeclareRef, phone), (snapshot) => {
        snapshot.forEach((data) => {
          setDeclareRefInfo(data.data());
          setDeclareRefId(data.id);
        });
      });
    }
  }, [isLoggedIn, phone, queryId]);

  useEffect(() => {
    if (cases.length && authInfo) {
      getLocalCases();
    }
  }, [cases, authInfo]);

  return (
    <Container className="container main">
      {isLoggedIn ? (
        <Card>
          {injectionInfo.numberOfInjections ? (
            <CardContent>
              {injectionInfo && (
                <>
                  {!injectionInfo.dataSubmitted ? (
                    <Stack sx={{ height: '80vh', textAlign: 'center' }}>
                      <Typography variant="h4" >
                        Chưa có dữ liệu tiêm chủng của bạn
                      </Typography>
                      <Typography>
                        Vui lòng bấm vào đây để gửi yêu cầu xác nhận thông tin
                        tiêm chủng
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography variant="h2" sx={{ textAlign: 'center' }} className={classes.title}>
                      Bạn đã tiêm {injectionInfo?.numberOfInjections} vaccine
                    </Typography>
                  )}
                  <Grid container spacing={5} className={classes.grid}>
                    {injectionInfo?.firstDose === "" ? (
                      <></>
                    ) : (
                      <Grid item md={4} >
                        <Box className={`${classes.box} ${classes.first}`}>
                          <TextField
                            className={classes.textField}
                            label=" Mũi số 1: "
                            value={injectionInfo?.firstDose}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                          <TextField
                            className={classes.textField}
                            label=" Ngày tiêm : "
                            value={injectionInfo?.injectDate1}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                          <TextField
                            className={classes.textField}
                            label=" Đơn vị tiêm: "
                            value={injectionInfo?.injectPerson1}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            multiline
                            minRows={3}
                          />
                        </Box>
                      </Grid>
                    )}
                    {injectionInfo.secondDose === "" ||
                      injectionInfo.secondDose === "Chưa tiêm" ? (
                      ""
                    ) : (
                      <Grid item md={4}>
                        <Box className={`${classes.box} ${classes.second}`}>
                          <TextField
                            className={classes.textField}
                            label=" Mũi số 2: "
                            value={injectionInfo?.secondDose}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                          <TextField
                            className={classes.textField}
                            label=" Ngày tiêm : "
                            value={injectionInfo?.injectDate2}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />

                          <TextField
                            className={classes.textField}
                            label=" Đơn vị tiêm: "
                            value={injectionInfo?.injectPerson3}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            minRows={3}
                            multiline
                          />
                        </Box>
                      </Grid>
                    )}
                    {injectionInfo.thirdDose === "" ||
                      injectionInfo.thirdDose === "Chưa tiêm" ? (
                      ""
                    ) : (
                      <Grid item md={4}>
                        <Box className={`${classes.box} ${classes.third}`}>
                          <TextField
                            className={classes.textField}
                            label="  Mũi số 3: "
                            value={injectionInfo?.thirdDose}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                          <TextField
                            className={classes.textField}
                            label=" Ngày tiêm : "
                            value={injectionInfo?.injectDate3}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />

                          <TextField
                            className={classes.textField}
                            label=" Đơn vị tiêm: "
                            value={injectionInfo?.injectPerson3}
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                            minRows={3}
                            multiline
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                  <Grid container>
                    <Grid item>
                      <Typography variant="subtitle1" gutterBottom>
                        Để yêu cầu thay đổi thông tin, vui lòng bấm
                        <MUILink
                          to="/utils/injection-info-request"
                          underline="none"
                          color="inherit"
                          component={RouterLink}
                          sx={{ fontWeight: 'bold', m: 1 }}
                        >
                          <Button variant="outlined" color="error">vào đây</Button>
                        </MUILink>
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          ) : (
            <div>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                Bạn chưa có thông tin tiêm chủng
              </Typography>
            </div>
          )}
        </Card>
      ) : (
        <Typography variant="h5" gutterBottom>
          Vui lòng đăng nhập để tiếp tục
        </Typography>
      )}
    </Container>
  );
};

export default Main;
