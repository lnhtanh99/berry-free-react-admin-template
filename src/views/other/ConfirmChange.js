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
  injectionRef,
} from "../../firebase/firebase";
import { onSnapshot, doc, setDoc, orderBy, addDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Container, Card, Button, TextField, Stack, MenuItem, FormControl, Select, InputLabel, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, CardContent, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const ConfirmChange = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [authInfo, setAuthInfo] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [requestInfo, setRequestInfo] = useState(null);
  const [requestId, setRequestId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [userId, setUserId] = useState(null);

  const [alertmsg, setAlertmsg] = useState("");

  const [injectInfo, setInjectInfo] = useState("");
  const [injectId, setInjectId] = useState("");

  //inject info
  const [phone, setPhone] = useState("");


  // upload img
  const [imageUpload, setImageUpload] = useState(null);

  // open dialogue

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const useStyles = makeStyles((theme) => ({
    header: {
      marginBottom: '30px'
    },
    textField: {
      marginBottom: '38px'
    }
  }));
  const classes = useStyles();

  const handleConfirm = (e) => {
    e.preventDefault();
    setDoc(doc(db, "injectionData", injectId), {
      ...injectInfo,
      numberOfInjections: requestInfo?.numberOfInjections,
      firstDose: requestInfo?.firstDose,
      secondDose: requestInfo?.secondDose,
      thirdDose: requestInfo?.thirdDose,
      injectDate1: requestInfo?.injectDate1,
      injectDate2: requestInfo?.injectDate2,
      injectDate3: requestInfo?.injectDate3,
      injectPerson1: requestInfo?.injectPerson1,
      injectPerson2: requestInfo?.injectPerson2,
      injectPerson3: requestInfo?.injectPerson3,
      dataSubmitted: true,
    });
    setDoc(doc(db, "injectionRequestData", requestId), {
      ...requestInfo,
      numberOfInjections: "",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      injectDate1: "",
      injectDate2: "",
      injectDate3: "",
      injectPerson1: "",
      injectPerson2: "",
      injectPerson3: "",
      infectedTimes: "",
      verifiedByAdmin: true,
      status: "approved",
    });
    setOpen(false);
  };
  const handleCloseReject = (e) => {
    e.preventDefault();
    setDoc(doc(db, "injectionRequestData", requestId), {
      ...requestInfo,
      numberOfInjections: "",
      firstDose: "",
      secondDose: "",
      thirdDose: "",
      injectDate1: "",
      injectDate2: "",
      injectDate3: "",
      injectPerson1: "",
      injectPerson2: "",
      injectPerson3: "",
      infectedTimes: "",
      status: "rejected",
      reason,
    });
    setOpen(false);
  };
  const handleClose = (e) => {
    setOpen(false);
  };

  //functions

  const findInfoByPhoneHandler = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      onSnapshot(
        queryGetUserInfoByPhone(injectionRequestRef, phone),
        (snapshot) => {
          if (snapshot._snapshot.docChanges.length === 0) {
            setAlertmsg("Không có thông tin cho người dùng này");
          }

          snapshot.forEach((data) => {
            setRequestInfo(data.data());
            setRequestId(data.id);
          });
        }
      );
      onSnapshot(queryGetUserInfoByPhone(injectionRef, phone), (snapshot) => {
        snapshot.forEach((data) => {
          setInjectInfo(data.data());
          setInjectId(data.id);
          // setUserIdNumber(data.data().idNumber);
        });
      });
    }
  };

  // firebase
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setIsLoggedIn(currentUser);
      setUserEmail(currentUser.email);
    } else {
      setIsLoggedIn(null);
    }
  });
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
          setUserId(data.id);
          setUserRole(data.data().assignedRole);
        });
      });
    }
  }, [isLoggedIn, requestInfo, injectInfo]);

  return (
    <Container className="container addInfo" sx={{ alignItems: "center" }}>
      {userRole === "admin" || userRole === "moderator" ? (
        <Card>
          {requestInfo ? (
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h3" className={classes.header} gutterBottom>
                Thông tin yêu cầu thay đổi
              </Typography>
              <Typography>Người yêu cầu: {requestInfo?.name}</Typography>

              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Typography variant="subtitle1" gutterBottom>Dữ liệu trên máy chủ</Typography>
                  {injectInfo?.numberOfInjections === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Số mũi đã tiêm:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Số mũi đã tiêm:"
                      value={injectInfo?.numberOfInjections}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.firstDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 1:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 1:"
                      value={injectInfo?.firstDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectDate1 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 1:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 1:"
                      value={injectInfo?.injectDate1}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectPerson1 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 1: "
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 1: "
                      value={injectInfo?.injectPerson1}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.secondDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 2: "
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 2: "
                      value={injectInfo?.secondDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectDate2 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 2: "
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 2: "
                      value={injectInfo?.injectDate2}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectPerson2 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 2: "
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 2: "
                      value={injectInfo?.injectPerson2}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.thirdDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 3: "
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 3: "
                      value={injectInfo?.thirdDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectDate3 === "" ? (
                    <TextField
                      className={classes.textField}
                      label=" Ngày tiêm mũi 3:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label=" Ngày tiêm mũi 3: "
                      value={injectInfo?.injectDate3}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {injectInfo?.injectPerson3 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 3:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 3: "
                      value={injectInfo?.injectPerson3}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                </Grid>
                <Grid item sm={6}>
                  <Typography variant="subtitle1" gutterBottom>Yêu cầu thay đổi</Typography>
                  {requestInfo?.numberOfInjections === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Số mũi đã tiêm:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Số mũi đã tiêm:"
                      value={requestInfo?.numberOfInjections}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.firstDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 1:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 1:"
                      value={requestInfo?.firstDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectDate1 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 1:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 1:"
                      value={requestInfo?.injectDate1}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectPerson1 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 1:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Đơn vị tiêm mũi 1:"
                      value={requestInfo?.injectPerson1}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.secondDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 2:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 2:"
                      value={requestInfo?.secondDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectDate2 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 2:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 2:"
                      value={requestInfo?.injectDate2}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectPerson2 === "" ? (
                    <TextField
                      className={classes.textField}
                      label=" Đơn vị tiêm mũi 2:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label=" Đơn vị tiêm mũi 2:"
                      value={requestInfo?.injectPerson2}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.thirdDose === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 3:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Mũi số 3:"
                      value={requestInfo?.thirdDose}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectDate3 === "" ? (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 3:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label="Ngày tiêm mũi 3:"
                      value={requestInfo?.injectDate3}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {requestInfo?.injectPerson3 === "" ? (
                    <TextField
                      className={classes.textField}
                      label=" Đơn vị tiêm mũi 3:"
                      value="Chưa có thông tin"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      className={classes.textField}
                      label=" Đơn vị tiêm mũi 3:"
                      value={requestInfo?.injectPerson3}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                    />
                  )}
                  {/* <img src={requestInfo?.imageProof}></img> */}
                </Grid>
              </Grid>
              <Button sx={{ marginTop: 3 }} variant="outlined">
                <Link href={requestInfo?.imageProof} target="blank">
                  Hình ảnh minh chứng
                </Link>
              </Button>
              <Stack
                direction="row"
                spacing={10}
                sx={{ justifyContent: "center", marginTop: 5 }}
              >
                <Stack>
                  <Button
                    variant="contained"
                    type="sumbit"
                    onClick={handleConfirm}
                    color="success"
                  >
                    Chấp thuận
                  </Button>
                </Stack>
                <Stack>
                  <Button
                    variant="contained"
                    type="sumbit"
                    onClick={handleClickOpen}
                    color="error"
                  >
                    Từ chối
                  </Button>
                  <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Nhập lí do từ chối</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Hãy nhập lí do từ chối thông tin này
                      </DialogContentText>
                      <TextField
                        margin="dense"
                        id="name"
                        label="Nhập lí do"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setReason(e.target.value)}
                        value={reason}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseReject}>OK</Button>
                      <Button onClick={handleClose}>Cancel</Button>
                    </DialogActions>
                  </Dialog>
                </Stack>
              </Stack>
            </CardContent>
          ) : (
            <CardContent>
              <Stack className="addRole-form">
                <Stack spacing={2}>
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    type="text"
                    label="Tìm theo số điện thoại"
                    className="addInfo-findWithPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    type="sumbit"
                    onClick={findInfoByPhoneHandler}
                  >
                    Tìm
                  </Button>
                  <Stack sx={{ color: 'red' }}>{alertmsg}</Stack>
                </Stack>
              </Stack>
            </CardContent>
          )}
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ color: 'red' }}>
              Bạn không đủ quyền hạn để truy cập
            </Typography>
            <Stack>
              <Button variant="contained">Quay lại trang chủ</Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ConfirmChange