import React, { useState, useEffect } from 'react';
import { onSnapshot, setDoc, doc, deleteDoc, addDoc } from '@firebase/firestore';
import { auth, queryGetUserInfoByPhone, queryGetUserInfoByEmail, dataRef, db, injectionRef } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Container, Button, TextField, Stack, MenuItem, FormControl, Select, InputLabel, Typography, Card, CardContent, Grid } from '@mui/material';
import { makeStyles } from "@mui/styles";

const AddInfo = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const [phone, setPhone] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [times, setTimes] = useState('');

  const [expand, setExpand] = useState(false);

  const [vaccineType1, setVaccineType1] = useState('');
  const [vaccineType2, setVaccineType2] = useState('');
  const [vaccineType3, setVaccineType3] = useState('');

  const [injectDate1, setInjectDate1] = useState('');
  const [injectDate2, setInjectDate2] = useState('');
  const [injectDate3, setInjectDate3] = useState('');

  const [injectPerson1, setInjectPerson1] = useState('');
  const [injectPerson2, setInjectPerson2] = useState('');
  const [injectPerson3, setInjectPerson3] = useState('');

  const [infectedTimes, setInfectedTimes] = useState('');

  const [infectedDate1, setInfectedDate1] = useState('');
  const [infectedDate2, setInfectedDate2] = useState('');
  const [infectedDate3, setInfectedDate3] = useState('');

  const [infectedNote1, setInfectedNote1] = useState('');
  const [infectedNote2, setInfectedNote2] = useState('');
  const [infectedNote3, setInfectedNote3] = useState('');

  const [totalUserInfo, setTotalUserInfo] = useState('');
  const [totalInjectionInfo, setTotalInjectionInfo] = useState([]);

  const [userInfo, setUserInfo] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');
  // const [userIdNumber, setUserIdNumber] = useState("");
  const [injectionInfo, setInjectionInfo] = useState({});
  const [injectionId, setInjectionId] = useState('');


  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUserEmail(currentUser.email);
      onSnapshot(queryGetUserInfoByEmail(userEmail), (snapshot) => {
        snapshot.forEach((data) => setUserRole(data.data().assignedRole));
      });
    }
  });

  const findInfoByPhoneHandler = (e) => {
    e.preventDefault();
    if (totalUserInfo) {
      onSnapshot(queryGetUserInfoByPhone(injectionRef, phone), (snapshot) => {
        console.log(snapshot._snapshot.docChanges.length);
        if (snapshot._snapshot.docChanges.length === 0) {
          //due to changes in Register, this may no longer useful
          if (window.confirm('Không tìm thấy dữ liệu người dùng. \n Nhấn OK để tạo dữ liệu')) {
            addDoc(injectionRef, {
              phone: phone,
              firstDose: '',
              secondDose: '',
              thirdDose: '',
              numberOfInjections: ''
            })
              .then(window.alert('Tạo dữ liệu thành công'))
              .catch((err) => {
                console.log(err);
              });
          }
        }
        {
          snapshot.forEach((data) => {
            setInjectionInfo(data.data());
            setInjectionId(data.id);
          });
        }
      });
      onSnapshot(queryGetUserInfoByPhone(dataRef, phone), (snapshot) => {
        {
          snapshot.forEach((data) => {
            setUserInfo(data.data());
            setUserId(data.id);
            // setUserIdNumber(data.data().idNumber);
          });
        }
      });
    }
  };

  const submitInfoHanlder = (e) => {
    e.preventDefault();
    setDoc(doc(db, 'injectionData', injectionId), {
      ...injectionInfo,
      numberOfInjections: times,
      // idNumber: userIdNumber,
      firstDose: vaccineType1,
      secondDose: vaccineType2,
      thirdDose: vaccineType3,
      injectDate1: injectDate1,
      injectDate2: injectDate2,
      injectDate3: injectDate3,
      injectPerson1: injectPerson1,
      injectPerson2: injectPerson2,
      injectPerson3: injectPerson3,
      infectedTimes: ''
    });
    setDate('');
    setPlace('');
    setTimes('');
  };

  const deleteInfoHandler = (e) => {
    if (window.confirm('Bạn có muốn xóa dữ liệu của người dùng này không?')) {
      deleteDoc(doc(db, 'injectionData', injectionId));
      window.prompt('Dữ liệu đã được xóa');
      window.location.reload(true);
    }
  };

  const expandHandler = (e) => {
    e.preventDefault();
    setExpand(!expand);
  };

  const submitInfectedInfoHandler = (e) => {
    e.preventDefault();
    setDoc(doc(db, 'injectionData', injectionId), {
      ...injectionInfo,
      infectedDate1: infectedDate1,
      infectedDate2: infectedDate2,
      infectedDate3: infectedDate3,
      infectedNote1: infectedNote1,
      infectedNote2: infectedNote2,
      infectedNote3: infectedNote3,
      infectedTimes: infectedTimes
    });
  };

  useEffect(() => {
    onSnapshot(injectionRef, (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setTotalInjectionInfo(users);
    });
    onSnapshot(dataRef, (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setTotalUserInfo(users);
    });
  }, [userId, userInfo]);

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
  return (
    <Container className="container addInfo">
      {userRole === 'admin' || userRole === 'moderator' ? (
        <Card>
          {userInfo ? (
            <CardContent>
              <Grid container spacing={2}>
                <Grid item sm={6}>
                  <Typography variant="h4" className={classes.header} gutterBottom>
                    Thông tin người dùng
                  </Typography>
                  <TextField
                    className={classes.textField}
                    label="Họ và tên:"
                    value={userInfo.name}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Ngày tháng năm sinh:"
                    value={userInfo.dob}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Số mũi đã tiêm:"
                    value={injectionInfo.numberOfInjections}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 1:"
                    value={injectionInfo.firstDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 2:"
                    value={injectionInfo.secondDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                  <TextField
                    className={classes.textField}
                    label="Mũi số 3:"
                    value={injectionInfo.thirdDose}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>

                <Grid item sm={6}>
                  <Stack alignItems="center">
                    <Typography variant="h4" className={classes.header} gutterBottom>
                      Khai báo số lần tiêm
                    </Typography>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 210 }}>
                      <InputLabel id="demo-simple-select-label">Số lần đã tiêm: </InputLabel>
                      <Select
                        label="Số lần đã tiêm"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        className="addInfo-times"
                        onChange={(e) => setTimes(e.target.value)}
                        value={times}
                      >
                        <MenuItem value="Chưa tiêm">Chưa tiêm</MenuItem>
                        <MenuItem value="1 mũi">1 lần</MenuItem>
                        <MenuItem value="2 mũi">2 lần</MenuItem>
                        <MenuItem value="3 mũi">3 lần</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <Grid container sx={{ justifyContent: 'center' }}>
                    <Box className={`${classes.box} ${classes.infected1}`}>
                      <Grid item lg={4} sx={{ textAlign: 'center' }} >
                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                          <InputLabel id="demo-simple-select-label">Mũi 1</InputLabel>
                          <Select
                            label="Mũi 1"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e) => setVaccineType1(e.target.value)}
                            value={vaccineType1}
                          >
                            <MenuItem value="" disabled>
                              Chọn loại vaccine
                            </MenuItem>
                            <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                            <MenuItem value="Pfizer-BioNTech">Pfizer-BioNTech</MenuItem>
                            <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                            <MenuItem value="Moderna">Moderna</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          helperText="Ngày tiêm mũi 1"
                          variant="outlined"
                          type="date"
                          className="register-dob"
                          value={injectDate1}
                          onChange={(e) => setInjectDate1(e.target.value)}
                        />
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          variant="outlined"
                          type="text"
                          label="Đơn vị tiêm mũi 1"
                          className="addInfo-findWithPhone"
                          value={injectPerson1}
                          onChange={(e) => setInjectPerson1(e.target.value)}
                        />
                      </Grid>
                    </Box>

                    <Box className={`${classes.box} ${classes.infected2}`}>
                      <Grid item lg={4} sx={{ textAlign: 'center' }}>
                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                          <InputLabel id="demo-simple-select-label">Mũi 2</InputLabel>
                          <Select
                            label="Mũi 2"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e) => setVaccineType2(e.target.value)}
                            value={vaccineType2}
                          >
                            <MenuItem value="" disabled>
                              Chọn loại vaccine
                            </MenuItem>
                            <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                            <MenuItem value="Pfizer-BioNTech">Pfizer-BioNTech</MenuItem>
                            <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                            <MenuItem value="Moderna">Moderna</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          helperText="Ngày tiêm mũi 2"
                          variant="outlined"
                          type="date"
                          className="register-dob"
                          value={injectDate2}
                          onChange={(e) => setInjectDate2(e.target.value)}
                        />
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          variant="outlined"
                          type="text"
                          label="Đơn vị tiêm mũi 2"
                          className="addInfo-findWithPhone"
                          value={injectPerson2}
                          onChange={(e) => setInjectPerson2(e.target.value)}
                        />
                      </Grid>
                    </Box>

                    <Box className={`${classes.box} ${classes.infected3}`}>
                      <Grid item lg={4} sx={{ textAlign: 'center' }}>
                        <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                          <InputLabel id="demo-simple-select-label">Mũi 3</InputLabel>
                          <Select
                            label="Mũi 3"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e) => setVaccineType3(e.target.value)}
                            value={vaccineType3}
                          >
                            <MenuItem value="" disabled>
                              Chọn loại vaccine
                            </MenuItem>
                            <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                            <MenuItem value="Pfizer-BioNTech">Pfizer-BioNTech</MenuItem>
                            <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                            <MenuItem value="Moderna">Moderna</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          helperText="Ngày tiêm mũi 3"
                          variant="outlined"
                          type="date"
                          className="register-dob"
                          value={injectDate3}
                          onChange={(e) => setInjectDate3(e.target.value)}
                        />
                        <TextField
                          sx={{ margin: 1, minWidth: 210 }}
                          id="standard-basic"
                          variant="outlined"
                          type="text"
                          label="Đơn vị tiêm mũi 3"
                          className="addInfo-findWithPhone"
                          value={injectPerson3}
                          onChange={(e) => setInjectPerson3(e.target.value)}
                        />
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>

                <Stack spacing={2} direction="row" className="addInfo-button">
                  <Button variant="contained" type="submit" onClick={submitInfoHanlder} color="info">
                    Gửi
                  </Button>
                  <Button variant="contained" onClick={deleteInfoHandler} color="error">
                    Xóa dữ liệu
                  </Button>
                </Stack>
              </Grid>
            </CardContent>
          ) : (
            <CardContent className="addRole-form">
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
                <Button variant="contained" type="sumbit" onClick={findInfoByPhoneHandler}>
                  Tìm
                </Button>
              </Stack>
            </CardContent>
          )}
        </Card>
      ) : (
        <Stack>
          <Typography variant="h5" gutterBottom sx={{ color: 'red' }}>
            Bạn không đủ quyền hạn để truy cập
          </Typography>
          <div>
            <Button variant="contained">Quay lại trang chủ</Button>
          </div>
        </Stack>
      )}
    </Container>
  );
};

export default AddInfo;
