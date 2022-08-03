import { Card, CardContent, Container, FormControl, Select, Typography } from '@mui/material'
import React from 'react'

const AddRole = () => {
    return (
        <Container>
            <Card>
                <CardContent>
                    <Typography variant="h2">
                        Thêm quyền
                    </Typography>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="demo-simple-select-label">
                            Thêm quyền
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
                </CardContent>
            </Card>
        </Container>
    )
}

export default AddRole