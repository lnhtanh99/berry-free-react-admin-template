import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onSnapshot, setDoc, doc } from '@firebase/firestore';
import { auth, queryGetUserInfoByEmail, queryGetUserInfoByPhone, dataRef, db, injectionRef } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Container } from '@mui/material';

import { makeStyles } from "@mui/styles";


const AddRole = () => {
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [totalUserInfo, setTotalUserInfo] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [injectionInfo, setInjectionInfo] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState('');

    const [currentRole, setCurrentRole] = useState("")

    const navigate = useNavigate();

    const useStyles = makeStyles((theme) => ({
        header: {
            marginBottom: '30px',
            textTransform: 'uppercase',
        },
        textField: {
            marginBottom: '38px'
        }
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
                    setCurrentRole(data.data().assignedRole)
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

        setDoc(doc(db, 'userData', userId), {
            ...userInfo,
            assignedRole: role
        });
        setRole('');
    };

    const backToMainPagehandler = (e) => {
        e.preventDefault();
        navigate('/');
    };

    useEffect(() => {
        onSnapshot(dataRef, (snapshot) => {
            let users = [];
            snapshot.docs.forEach((doc) => {
                users.push({ ...doc.data(), id: doc.id });
            });
            setTotalUserInfo(users);
        });
        console.log(currentRole);
    }, [userId, userRole]);

    if (!userRole) {
        return <div> Loading </div>;
    }

    return (
        <Container>
            <Card>
                {userRole === 'admin' ? (
                    userInfo ? (
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h2" className={classes.header} gutterBottom>
                                Thông tin người dùng
                            </Typography>
                            <TextField
                                className={classes.textField}
                                label="Họ và tên:"
                                defaultValue={userInfo.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                variant="outlined"
                            />
                            <TextField
                                className={classes.textField}
                                label="Vai trò:"
                                defaultValue={userInfo.assignedRole}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                variant="outlined"
                            />
                            <div>
                                <Stack className="addRole-form">
                                    <FormControl variant="standard" sx={{ m: 2, minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-label">Phân quyền </InputLabel>{' '}
                                        <Select
                                            className="addRole-role"
                                            onChange={(e) => setRole(e.target.value)}
                                            value={role}
                                            label={'Phân quyền'}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                        >
                                            <MenuItem value="user"> User </MenuItem>
                                            <MenuItem value="moderator"> Moderator </MenuItem>{' '}
                                        </Select>
                                    </FormControl>
                                </Stack>
                                <Button variant="contained" type="submit" onClick={submitInfoHandler}>
                                    Gửi
                                </Button>
                            </div>
                        </CardContent>
                    ) : (
                        <CardContent >
                            <form className="addRole-form">
                                <Stack spacing={2} >
                                    <TextField
                                        id="standard-basic"
                                        variant="standard"
                                        type="text"
                                        label="Tìm theo số điện thoại"
                                        className="addInfo-findWithPhone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />{' '}
                                    <Button variant="contained" type="sumbit" onClick={findInfoByPhoneHandler}>
                                        Tìm{' '}
                                    </Button>{' '}
                                </Stack>{' '}
                            </form>{' '}
                        </CardContent>
                    )
                ) : (
                    <div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Bạn không đủ quyền hạn để truy cập{' '}
                            </Typography>{' '}
                        </div>{' '}
                        <Button variant="contained" onClick={backToMainPagehandler}>
                            Quay lại trang chủ{' '}
                        </Button>{' '}
                    </div>
                )}{' '}
            </Card>
        </Container>
    );
};

export default AddRole;
