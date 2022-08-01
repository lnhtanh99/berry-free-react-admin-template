import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onSnapshot, setDoc, doc } from "@firebase/firestore";
import {
  auth,
  queryGetUserInfoByEmail,
  queryGetUserInfoByPhone,
  dataRef,
  db,
  injectionRef,
  rolesRef,
} from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { Card, CardContent, Container, Menu } from "@mui/material";

import { makeStyles } from "@mui/styles";

const AddRole = () => {
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [roleSpecify, setRoleSpecify] = useState("");
  const [totalUserInfo, setTotalUserInfo] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [injectionInfo, setInjectionInfo] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");

  const [autoCompleteVal, setAutocompleteVal] = useState("");

  const [currentRole, setCurrentRole] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [roleName, setRoleName] = useState("");

  const navigate = useNavigate();

  const useStyles = makeStyles((theme) => ({
    header: {
      marginBottom: "30px",
      textTransform: "uppercase",
    },
    textField: {
      marginBottom: "38px",
    },
  }));

  const classes = useStyles();

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
      onSnapshot(queryGetUserInfoByPhone(dataRef, phone), (snapshot) => {
        snapshot.forEach((data) => {
          setUserInfo(data.data());
          setUserId(data.id);
          setCurrentRole(data.data().assignedRole);
        });
      });
      onSnapshot(queryGetUserInfoByPhone(injectionRef, phone), (snapshot) => {
        snapshot.forEach((data) => {
          setInjectionInfo(data.data());
        });
      });
    }
  };

  const submitInfoHandler = (e) => {
    e.preventDefault();

    setDoc(doc(db, "userData", userId), {
      ...userInfo,
      assignedRole: role,
      //   role: roleSpecify,
    });
    setRole("");
    setRoleSpecify("");
  };

  const backToMainPagehandler = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const removeItemAtOnce = (arr, value) => {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
  };

  const addRole = (e) => {
    e.preventDefault();
    if (roleList.indexOf(roleName) === -1){
        roleList.push(roleName)
        setDoc(doc(db, "roleData", "taQPWqV16yQr1NZOkEXM"), {
            roles: roleList,
          });
    } else {
        window.alert("Đã có role này trên hệ thống")
    }
    setRoleName("")
  };

  const removeRole = (e) => {
    e.preventDefault();
    removeItemAtOnce(roleList, autoCompleteVal);
    console.log(roleList);

    setDoc(doc(db, "roleData", "taQPWqV16yQr1NZOkEXM"), {
      roles: roleList,
    });
    setAutocompleteVal("")
  };

  useEffect(() => {
    onSnapshot(dataRef, (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setTotalUserInfo(users);
    });
    onSnapshot(rolesRef, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push(...doc.data().roles);
      });
      setRoleList(data);
    });
  }, [userId, userRole, autoCompleteVal]);

  if (!userRole) {
    return <div> Loading </div>;
  }

  return (
    <Container>
        {/* Giao diện chỉ admin nhìn thấy */}
      <Stack>
        <Stack sx={{ flexDirection: "row", m: 2 }}>
          <TextField
            label="tạo role"
            onChange={e => setRoleName(e.target.value)}
            value={roleName}
          ></TextField>
          <Button variant="contained" onClick={addRole}>Tạo</Button>
        </Stack>
        <Stack sx={{ flexDirection: "row", m: 2 }}>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.id === value.id}
            disablePortal
            onChange={(event, value) => setAutocompleteVal(value)}
            value={autoCompleteVal}
            id="combo-box-demo"
            options={roleList}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Chọn vai trò" />
            )}
          />
          <Button variant="contained" onClick={removeRole}>
            Xóa
          </Button>
        </Stack>
      </Stack>
      <Card>
        {userRole === "admin" ? (
          userInfo ? (
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h2" className={classes.header} gutterBottom>
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
                variant="outlined"
              />
              <TextField
                className={classes.textField}
                label="Vai trò:"
                value={userInfo.assignedRole}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                variant="outlined"
              />
              <div>
                <Stack className="addRole-form">
                  <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">
                      Phân quyền{" "}
                    </InputLabel>{" "}
                    <Select
                      className="addRole-role"
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                      label={"Phân quyền"}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value="user"> User </MenuItem>
                      <MenuItem value="moderator"> Moderator </MenuItem>{" "}
                    </Select>
                  </FormControl>
                </Stack>
                <Stack className="addRole-form">
                  <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-label">
                      Vai trò{" "}
                    </InputLabel>{" "}
                    <Select
                      className="addRole-role"
                      onChange={(e) => setRoleSpecify(e.target.value)}
                      value={roleSpecify}
                      label={"Vai trò "}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value="1A"> 1A </MenuItem>
                      <MenuItem value="1B"> 1B </MenuItem>{" "}
                    </Select>
                  </FormControl>
                </Stack>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={submitInfoHandler}
                >
                  Gửi
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              <form className="addRole-form">
                <Stack spacing={2}>
                  <TextField
                    id="standard-basic"
                    variant="standard"
                    type="text"
                    label="Tìm theo số điện thoại"
                    className="addInfo-findWithPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />{" "}
                  <Button
                    variant="contained"
                    type="sumbit"
                    onClick={findInfoByPhoneHandler}
                  >
                    Tìm{" "}
                  </Button>{" "}
                </Stack>{" "}
              </form>{" "}
            </CardContent>
          )
        ) : (
          <CardContent>
            <div>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "red" }}
              >
                Bạn không đủ quyền hạn để truy cập{" "}
              </Typography>{" "}
            </div>{" "}
            <Button variant="contained" onClick={backToMainPagehandler}>
              Quay lại trang chủ{" "}
            </Button>{" "}
          </CardContent>
        )}{" "}
      </Card>
    </Container>
  );
};

export default AddRole;
