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

const PopularCard = ({ isLoading ,injectionState }) => {
    const [chartData, setChartData] = useState({});

    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const categories = injectionState ? [injectionState.overview[0]?.date, injectionState.overview[1]?.date, injectionState.overview[2]?.date, injectionState.overview[3]?.date] : ['test'];
    const userNotVaccinated = injectionState ? [injectionState.overview[0]?.userNotVaccinated, injectionState.overview[1]?.userNotVaccinated, injectionState.overview[2]?.userNotVaccinated, injectionState.overview[3]?.userNotVaccinated] : ['test'];
    const userVaccinatedOnce = injectionState ? [injectionState.overview[0]?.userVaccinatedOnce, injectionState.overview[1]?.userVaccinatedOnce, injectionState.overview[2]?.userVaccinatedOnce, injectionState.overview[3]?.userVaccinatedOnce] : ['test'];
    const userVaccinatedTwice = injectionState ? [injectionState.overview[0]?.userVaccinatedTwice, injectionState.overview[1]?.userVaccinatedTwice, injectionState.overview[2]?.userVaccinatedTwice, injectionState.overview[3]?.userVaccinatedTwice] : ['test'];
    const userVaccinatedThreeTimes = injectionState ? [injectionState.overview[0]?.userVaccinatedThreeTimes, injectionState.overview[1]?.userVaccinatedThreeTimes, injectionState.overview[2]?.userVaccinatedThreeTimes, injectionState.overview[3]?.userVaccinatedThreeTimes] : ['test'];

    const chart = {
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
                categories: categories
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

    useEffect(() => {
        setChartData(chart);
    }, [injectionState]);

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
                            {injectionState && <Chart {...chartData} />}
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
