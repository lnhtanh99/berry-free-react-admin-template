import { Card, CardContent, Container, Stack, Button, Typography, Link as MUILink } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from "react-router-dom";

const Role = () => {
  return (
    <Container>
      <Card>
        <CardContent>
          <Stack>
            <Typography>
              <MUILink
                to="/admin/change-role"
                underline="none"
                color="inherit"
                component={RouterLink}
                sx={{ fontWeight: 'bold', m: 1 }}
              >
                <Button variant="contained" color="error">Thay đổi phân quyền</Button>
              </MUILink>
            </Typography>
            <Typography>
              <MUILink
                to="/admin/add-role"
                underline="none"
                color="inherit"
                component={RouterLink}
                sx={{ fontWeight: 'bold', m: 1 }}
              >
                <Button variant="contained" color="primary">Thêm quyền</Button>
              </MUILink>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Role
