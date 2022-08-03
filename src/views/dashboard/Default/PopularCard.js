import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';


// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const PopularCard = ({ isLoading ,injectionState, infectionState }) => {
    const [injectionChartData, setInjectionChartData] = useState({});
    const [infectionChartData, setInfectionChartData] = useState({});

    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const injectionCategories = injectionState ? [injectionState[0]?.date, injectionState[1]?.date, injectionState[2]?.date, injectionState[3]?.date] : ['test'];
    const userNotVaccinated = injectionState ? [injectionState[0]?.userNotVaccinated, injectionState[1]?.userNotVaccinated, injectionState[2]?.userNotVaccinated, injectionState[3]?.userNotVaccinated] : ['test'];
    const userVaccinatedOnce = injectionState ? [injectionState[0]?.userVaccinatedOnce, injectionState[1]?.userVaccinatedOnce, injectionState[2]?.userVaccinatedOnce, injectionState[3]?.userVaccinatedOnce] : ['test'];
    const userVaccinatedTwice = injectionState ? [injectionState[0]?.userVaccinatedTwice, injectionState[1]?.userVaccinatedTwice, injectionState[2]?.userVaccinatedTwice, injectionState[3]?.userVaccinatedTwice] : ['test'];
    const userVaccinatedThreeTimes = injectionState ? [injectionState[0]?.userVaccinatedThreeTimes, injectionState[1]?.userVaccinatedThreeTimes, injectionState[2]?.userVaccinatedThreeTimes, injectionState[3]?.userVaccinatedThreeTimes] : ['test'];

    const infectionCategories = infectionState ? [infectionState[0]?.date, infectionState[1]?.date, infectionState[2]?.date, infectionState[3]?.date] : ['test'];
    const totalUser = infectionState ? [infectionState[0]?.totalUser, infectionState[1]?.totalUser, infectionState[2]?.totalUser, infectionState[3]?.totalUser] : ['test'];
    const userInfected = infectionState ? [infectionState[0]?.userInfected, infectionState[1]?.userInfected, infectionState[2]?.userInfected, infectionState[3]?.userInfected] : ['test'];
    const userNotInfected = infectionState ? [infectionState[0]?.userNotInfected, infectionState[1]?.userNotInfected, infectionState[2]?.userNotInfected, infectionState[3]?.userNotInfected] : ['test'];

    const injectionChart = {
        height: 480,
        type: 'bar',
        options: {
            chart: {
                id: 'bar-chart',
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%'
                }
            },
            xaxis: {
                type: 'category',
                categories: injectionCategories
            },
            legend: {
                show: true,
                fontSize: '14px',
                fontFamily: `'Roboto', sans-serif`,
                position: 'bottom',
                offsetX: 20,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 16,
                    height: 16,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 8
                }
            },
            fill: {
                type: 'solid'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: true
            }
        },
        series: [
            {
                name: 'Chưa tiêm',
                data: userNotVaccinated,
                color: '#f1c40f'
            },
            {
                name: 'Tiêm 1 mũi',
                data: userVaccinatedOnce,
                color: '#d63031'
            },
            {
                name: 'Tiêm 2 mũi',
                data: userVaccinatedTwice,
                color: '#686de0'
            },
            {
                name: 'Tiêm 3 mũi',
                data: userVaccinatedThreeTimes,
                color: '#2ecc71'
            }
        ],
    };

    const infectionChart = {
        height: 480,
        type: 'bar',
        options: {
            chart: {
                id: 'bar-chart',
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%'
                }
            },
            xaxis: {
                type: 'category',
                categories: infectionCategories
            },
            legend: {
                show: true,
                fontSize: '14px',
                fontFamily: `'Roboto', sans-serif`,
                position: 'bottom',
                offsetX: 20,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 16,
                    height: 16,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 8
                }
            },
            fill: {
                type: 'solid'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: true
            }
        },
        series: [
            {
                name: 'Tổng số nhân viên',
                data: totalUser,
                color: '#686de0'
            },
            {
                name: 'Số người nhiễm bệnh',
                data: userInfected,
                color: '#d63031'
            },
            {
                name: 'Số người chưa nhiễm bệnh',
                data: userNotInfected,
                color: '#2ecc71'
            }
        ],
    };

    useEffect(() => {
        setInjectionChartData(injectionChart);
        setInfectionChartData(infectionChart);
        console.log(infectionState)
    }, [injectionState, infectionState]);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Biểu đồ chi tiết</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">Số liệu COVID-19 tại tổ chức</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            {injectionState && <Chart {...injectionChartData} />}
                        </Grid>
                        <Grid item xs={12}>
                            {infectionState && <Chart {...infectionChartData} />}
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool,
    everydayCases: PropTypes.array
};

export default PopularCard;
