import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
} from "@firebase/firestore";
import {
  auth,
  queryGetUserInfoByPhone,
  queryGetUserInfoByEmail,
  dataRef,
  db,
  injectionRef,
} from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {Button, TextField, Stack, MenuItem, FormControl, Select, InputLabel, Typography} from "@mui/material";


const AddInfo = ({ userId, setUserId }) => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [times, setTimes] = useState("");

  const [expand, setExpand] = useState(false);

  const [vaccineType1, setVaccineType1] = useState("");
  const [vaccineType2, setVaccineType2] = useState("");
  const [vaccineType3, setVaccineType3] = useState("");

  const [injectDate1, setInjectDate1] = useState("");
  const [injectDate2, setInjectDate2] = useState("");
  const [injectDate3, setInjectDate3] = useState("");

  const [injectPerson1, setInjectPerson1] = useState("");
  const [injectPerson2, setInjectPerson2] = useState("");
  const [injectPerson3, setInjectPerson3] = useState("");

  const [infectedTimes, setInfectedTimes] = useState("");

  const [infectedDate1, setInfectedDate1] = useState("");
  const [infectedDate2, setInfectedDate2] = useState("");
  const [infectedDate3, setInfectedDate3] = useState("");

  const [infectedNote1, setInfectedNote1] = useState("");
  const [infectedNote2, setInfectedNote2] = useState("");
  const [infectedNote3, setInfectedNote3] = useState("");

  const [totalUserInfo, setTotalUserInfo] = useState("");
  const [totalInjectionInfo, setTotalInjectionInfo] = useState([]);

  const [userInfo, setUserInfo] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  // const [userIdNumber, setUserIdNumber] = useState("");
  const [injectionInfo, setInjectionInfo] = useState({});
  const [injectionId, setInjectionId] = useState("");

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
          if (
            window.confirm(
              "Không tìm thấy dữ liệu người dùng. \n Nhấn OK để tạo dữ liệu"
            )
          ) {
            addDoc(injectionRef, {
              phone: phone,
              firstDose: "",
              secondDose: "",
              thirdDose: "",
              numberOfInjections: "",
            })
              .then(window.alert("Tạo dữ liệu thành công"))
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
    setDoc(doc(db, "injectionData", injectionId), {
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
      infectedTimes: "",
    });
    setDate("");
    setPlace("");
    setTimes("");
  };

  const deleteInfoHandler = (e) => {
    if (window.confirm("Bạn có muốn xóa dữ liệu của người dùng này không?")) {
      deleteDoc(doc(db, "injectionData", injectionId));
      window.prompt("Dữ liệu đã được xóa");
      window.location.reload(true);
    }
  };

  const expandHandler = (e) => {
    e.preventDefault();
    setExpand(!expand);
  };

  const submitInfectedInfoHandler = (e) => {
    e.preventDefault();
    setDoc(doc(db, "injectionData", injectionId), {
      ...injectionInfo,
      infectedDate1: infectedDate1,
      infectedDate2: infectedDate2,
      infectedDate3: infectedDate3,
      infectedNote1: infectedNote1,
      infectedNote2: infectedNote2,
      infectedNote3: infectedNote3,
      infectedTimes: infectedTimes,
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
    console.log(userId);
    console.log(totalUserInfo);
  }, [userId, userInfo]);

  return (
    <div className="container addInfo">
      {userRole === "admin" || userRole === "moderator" ? (
        <div>
          {userInfo ? (
            <div>
              <div>
                <div>
                  <Typography variant="h4" gutterBottom>
                    Thông tin người dùng
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Họ và tên: {userInfo.name}{" "}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Ngày sinh: {userInfo.dob}{" "}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Số mũi đã tiêm: {injectionInfo.numberOfInjections}{" "}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Mũi số 1: {injectionInfo.firstDose}{" "}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Mũi số 2: {injectionInfo.secondDose}{" "}
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Mũi số 3: {injectionInfo.thirdDose}{" "}
                  </Typography>
                </div>
              </div>
              <div>
                {/* <div>
              <input
                type="text"
                placeholder="Địa điểm tiêm"
                className="addInfo-place"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </div>
            <div>
              <input
                type="date"
                placeholder="Ngày tiêm"
                className="addInfo-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div> */}
                <div>
                  {" "}
                  <FormControl variant="outlined" sx={{ m: 1, minWidth: 210 }}>
                    <InputLabel id="demo-simple-select-label">
                      Số lần đã tiêm:{" "}
                    </InputLabel>
                    <Select
                      label={"Số lần đã tiêm"}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      className="addInfo-times"
                      onChange={(e) => setTimes(e.target.value)}
                      value={times}
                    >
                      {" "}
                      <MenuItem value="Chưa tiêm">Chưa tiêm</MenuItem>
                      <MenuItem value="1 mũi">1 lần</MenuItem>
                      <MenuItem value="2 mũi">2 lần</MenuItem>
                      <MenuItem value="3 mũi">3 lần</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <Stack spacing={2} direction="row" className="addInfo-button">
                  <div>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Mũi 1
                      </InputLabel>
                      <Select
                        label={"Mũi 1"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(e) => setVaccineType1(e.target.value)}
                        value={vaccineType1}
                      >
                        <MenuItem value="" disabled>
                          Chọn loại vaccine
                        </MenuItem>
                        <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                        <MenuItem value="Pfizer-BioNTech">
                          Pfizer-BioNTech
                        </MenuItem>
                        <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                        <MenuItem value="Moderna">Moderna</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Mũi 2
                      </InputLabel>
                      <Select
                        label={"Mũi 2"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(e) => setVaccineType2(e.target.value)}
                        value={vaccineType2}
                      >
                        <MenuItem value="" disabled>
                          Chọn loại vaccine
                        </MenuItem>
                        <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                        <MenuItem value="Pfizer-BioNTech">
                          Pfizer-BioNTech
                        </MenuItem>
                        <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                        <MenuItem value="Moderna">Moderna</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <InputLabel id="demo-simple-select-label">
                        Mũi 3
                      </InputLabel>
                      <Select
                        label={"Mũi 3"}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={(e) => setVaccineType3(e.target.value)}
                        value={vaccineType3}
                      >
                        <MenuItem value="" disabled>
                          Chọn loại vaccine
                        </MenuItem>
                        <MenuItem value="Nanocovax">Nanocovax</MenuItem>
                        <MenuItem value="Pfizer-BioNTech">
                          Pfizer-BioNTech
                        </MenuItem>
                        <MenuItem value="AstraZeneca">AstraZeneca</MenuItem>
                        <MenuItem value="Moderna">Moderna</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </Stack>
                <Stack
                  spacing={2}
                  direction="row"
                  className="addInfo-button"
                  sx={{ alignItems: "baseline" }}
                >
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
                    helperText="Ngày tiêm mũi 3"
                    variant="outlined"
                    type="date"
                    className="register-dob"
                    value={injectDate3}
                    onChange={(e) => setInjectDate3(e.target.value)}
                  />
                </Stack>
                <Stack
                  spacing={2}
                  direction="row"
                  className="addInfo-button"
                  sx={{ alignItems: "baseline" }}
                >
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
                  <TextField
                    id="standard-basic"
                    variant="outlined"
                    type="text"
                    label="Đơn vị tiêm mũi 2"
                    className="addInfo-findWithPhone"
                    value={injectPerson2}
                    onChange={(e) => setInjectPerson2(e.target.value)}
                  />
                  <TextField
                    id="standard-basic"
                    variant="outlined"
                    type="text"
                    label="Đơn vị tiêm mũi 3"
                    className="addInfo-findWithPhone"
                    value={injectPerson3}
                    onChange={(e) => setInjectPerson3(e.target.value)}
                  />
                </Stack>
                <Stack spacing={2} direction="row" className="addInfo-button">
                  <div>
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={submitInfoHanlder}
                    >
                      Gửi
                    </Button>
                  </div>
                  <div>
                    <Button variant="contained" onClick={deleteInfoHandler}>
                      Xóa dữ liệu
                    </Button>
                  </div>
                </Stack>
                {/* <Button
                  sx={{ margin: 5 }}
                  variant="contained"
                  type="sumbit"
                  onClick={expandHandler}
                >
                  Thêm thông tin lây nhiễm
                </Button> */}
                {expand ? (
                  <div>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 200 }}
                    >
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
                      <div>
                        <Stack
                          spacing={2}
                          direction="row"
                          className="addInfo-button"
                          sx={{ alignItems: "baseline" }}
                        >
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
                        </Stack>
                        <Stack
                          spacing={2}
                          direction="row"
                          className="addInfo-button"
                          sx={{ alignItems: "baseline" }}
                        >
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
                        </Stack>
                      </div>
                    ) : (
                      <div>
                        {infectedTimes === "2 lần" ? (
                          <div>
                            <Stack
                              spacing={2}
                              direction="row"
                              className="addInfo-button"
                              sx={{ alignItems: "baseline" }}
                            >
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
                                helperText="Lần nhiễm số 2"
                                variant="outlined"
                                type="date"
                                className="register-dob"
                                value={infectedDate2}
                                onChange={(e) =>
                                  setInfectedDate2(e.target.value)
                                }
                              />
                            </Stack>
                            <Stack
                              spacing={2}
                              direction="row"
                              className="addInfo-button"
                              sx={{ alignItems: "baseline" }}
                            >
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
                              <TextField
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
                            </Stack>
                          </div>
                        ) : (
                          <div>
                            {infectedTimes === "3 lần" ? (
                              <div>
                                <Stack
                                  spacing={2}
                                  direction="row"
                                  className="addInfo-button"
                                  sx={{ alignItems: "baseline" }}
                                >
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
                                    helperText="Lần nhiễm số 3"
                                    variant="outlined"
                                    type="date"
                                    className="register-dob"
                                    value={infectedDate3}
                                    onChange={(e) =>
                                      setInfectedDate3(e.target.value)
                                    }
                                  />
                                </Stack>
                                <Stack
                                  spacing={2}
                                  direction="row"
                                  className="addInfo-button"
                                  sx={{ alignItems: "baseline" }}
                                >
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
                                  <TextField
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
                                  <TextField
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
                                </Stack>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <Button
                      variant="contained"
                      type="sumbit"
                      sx={{ marginBottom: 5, marginTop: 2 }}
                      onClick={submitInfectedInfoHandler}
                    >
                      Gửi
                    </Button>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ) : (
            <div className="addRole-form">
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
              </Stack>
            </div>
          )}
        </div>
      ) : (
        <div>
          <Typography variant="h5" gutterBottom>
            Bạn không đủ quyền hạn để truy cập
          </Typography>
          <div>
            <Button variant="contained">Quay lại trang chủ</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddInfo;
