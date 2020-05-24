const vm = new Vue({
    el: '#app',
    data: {
        confirmedCases: [],
        deathCases: [],
        uniqueprovince: [],
        globalData: [],
        counter: 0,
    },
    mounted: function () {
        this.start();
    },
    methods: {
        start() {
            var countries = [];
            axios.get('https://api.covid19api.com/countries')
                .then(response => {
                    response.data.forEach(element => {
                        countries.push(element['Country']);
                    });
                    countries.sort();
                });
            $("#countryname").autocomplete({
                source: countries
            });
        },
        showdata() {
            event.preventDefault();
            const countryname = document.getElementById('countryname');
            const datacanvas = document.getElementById('datacanvas');
            const chart = document.getElementById('chart1');
            const mprovincelist = document.getElementById('mprovincelist');
            const rprovincelist = document.getElementById('rprovincelist');
            const drtable = document.getElementById('drtable');
            datacanvas.setAttribute('style', 'display:block;');
            chart.setAttribute('style', 'display:block;');
            var confirmed = [];
            var deaths = [];
            var recovered = [];
            var timeline = []
            var provinces = [];
            var countries = [];
            axios.get('https://api.covid19api.com/countries')
                .then(response => {
                    response.data.forEach(element => {
                        countries.push(element['Country']);
                    });
                    countries.sort();
                    this.countries = countries;
                });
            axios.get('https://api.covid19api.com/summary')
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        alert('Try Again');
                        return;
                    }
                    if (this.counter == 0) {
                        this.globalData.push(response.data.Global)
                        this.counter = this.counter + 1;
                    }
                    Highcharts.chart('globaldatacontainer', {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: 'Global Covid-19 Data'
                        },
                        subtitle: {
                            text: 'Source: <a href="https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest#27454960-ea1c-4b91-a0b6-0468bb4e6712">Postman</a>'
                        },
                        xAxis: {
                            categories: ['NewConfirmed', 'TotalConfirmed', 'NewDeaths', 'TotalDeaths', 'NewRecovered', 'TotalRecovered'],
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Cases',
                                align: 'high'
                            },
                            labels: {
                                overflow: 'justify'
                            }
                        },
                        tooltip: {
                            valueSuffix: ' '
                        },
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    enabled: true
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'top',
                            x: -40,
                            y: 80,
                            floating: true,
                            borderWidth: 1,
                            backgroundColor:
                                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                            shadow: true
                        },
                        credits: {
                            enabled: false
                        },
                        series: [{
                            name: 'Cases',
                            data: [response.data.Global['NewConfirmed'], response.data.Global['TotalConfirmed'], response.data.Global['NewDeaths'], response.data.Global['TotalDeaths'], response.data.Global['NewRecovered'], response.data.Global['TotalRecovered']]
                        }]
                    });
                })
            axios.get(`https://api.covid19api.com/country/${countryname.value}/status/confirmed/live`)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    if (response.data[0]['Province'] != '') {
                        axios.get(`https://api.covid19api.com/total/country/${countryname.value}/status/confirmed`)
                            .then(provinceresponse => {
                                console.log(provinceresponse.data[0]);
                                provinceresponse.data.forEach(element => {
                                    confirmed.push(
                                        { y: element['Cases'] });
                                });
                                drtable.setAttribute('style', 'display:none;');
                                document.getElementById('tablechart').setAttribute('style', 'display:block;')
                                this.confirmedCases = provinceresponse.data.splice(provinceresponse.data.length - 4);
                                Highcharts.chart('caseschartcontainer', {

                                    title: {
                                        text: 'Covid-19 Confirmed cases Chart'
                                    },

                                    xAxis: {
                                        title: {
                                            text: 'Days'
                                        },
                                        tickInterval: 1,
                                        type: 'logarithmic',
                                    },

                                    yAxis: {
                                        title: {
                                            text: 'Cases'
                                        },
                                        type: 'logarithmic',
                                        minorTickInterval: 1,
                                    },

                                    tooltip: {
                                        headerFormat: '<b>Confirmed Cases</b><br />',
                                        pointFormat: 'Days = {point.x}, Cases = {point.y}'
                                    },

                                    series: [{
                                        name: 'Confirmed Cases',
                                        data: confirmed,
                                        pointStart: 1
                                    }]
                                });
                            });
                    } else {
                        response.data.forEach(element => {
                            confirmed.push(
                                { y: element['Cases'] });
                        });
                        this.confirmedCases = response.data.splice(response.data.length - 4);
                        Highcharts.chart('caseschartcontainer', {

                            title: {
                                text: 'Covid-19 Confirmed cases Chart'
                            },

                            xAxis: {
                                title: {
                                    text: 'Days'
                                },
                                tickInterval: 1,
                                type: 'logarithmic',
                            },

                            yAxis: {
                                title: {
                                    text: 'Cases'
                                },
                                type: 'logarithmic',
                                minorTickInterval: 1,
                            },

                            tooltip: {
                                headerFormat: '<b>Confirmed Cases</b><br />',
                                pointFormat: 'Days = {point.x}, Cases = {point.y}'
                            },

                            series: [{
                                name: 'Confirmed Cases',
                                data: confirmed,
                                pointStart: 1
                            }]
                        });
                    }
                });
            axios.get(`https://api.covid19api.com/live/country/${countryname.value}/status/confirmed`)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.data.forEach(element => {
                        deaths.push(element['Deaths']);
                        recovered.push(element['Recovered']);
                        timeline.push(element['Date'].slice(0, 10))
                        if (element['Province'] != '') {
                            provinces.push(element['Province']);
                            provinces.sort();
                        }
                    });
                    this.uniqueprovince = [...new Set(provinces)]
                    if (response.data[0]['Province'] != '') {
                        mprovincelist.setAttribute('style', 'display:block');
                        rprovincelist.setAttribute('style', 'display:block');
                        document.getElementById('deathchartcontainer').setAttribute('style', 'display:none;');
                        document.getElementById('recoveredchartcontainer').setAttribute('style', 'display:none;')
                    } else {
                        mprovincelist.setAttribute('style', 'display:none');
                        rprovincelist.setAttribute('style', 'display:none');
                    }
                    this.deathCases = response.data.splice(response.data.length - 4);
                    Highcharts.chart('deathchartcontainer', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Confirmed Deaths Chart'
                        },
                        xAxis: {
                            title: {
                                text: 'Dates'
                            },
                            categories: timeline
                        },
                        yAxis: {
                            title: {
                                text: 'Deaths'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false
                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: countryname.value,
                            data: deaths
                        }]
                    });
                    Highcharts.chart('recoveredchartcontainer', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Confirmed Recovery Chart'
                        },
                        xAxis: {
                            title: {
                                text: 'Dates'
                            },
                            categories: timeline
                        },
                        yAxis: {
                            title: {
                                text: 'Recovered'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false
                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: countryname.value,
                            data: recovered
                        }]
                    });
                });
        },
        mortalitydata() {
            const countryname = document.getElementById('countryname');
            const provincedrop = document.getElementById("mprovinceoption");
            var selectedprovince = provincedrop.options[provincedrop.selectedIndex].text;
            var deaths = [];
            var timeline = [];
            axios.get(`https://api.covid19api.com/live/country/${countryname.value}/status/confirmed`)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.data.forEach(element => {
                        if (element['Province'] == selectedprovince) {
                            deaths.push(element['Deaths']);
                            timeline.push(element['Date'].slice(0, 10))
                        }
                    });
                    document.getElementById('deathchartcontainer').setAttribute('style', 'display:block;')
                    Highcharts.chart('deathchartcontainer', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Confirmed Deaths Chart'
                        },
                        xAxis: {
                            title: {
                                text: 'Dates'
                            },
                            categories: timeline
                        },
                        yAxis: {
                            title: {
                                text: 'Deaths'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false
                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: selectedprovince,
                            data: deaths
                        }]
                    });
                });
        },
        recovereddata() {
            const countryname = document.getElementById('countryname');
            const provincedrop = document.getElementById("rprovinceoption");
            var selectedprovince = provincedrop.options[provincedrop.selectedIndex].text;
            var recovered = [];
            var timeline = [];
            axios.get(`https://api.covid19api.com/live/country/${countryname.value}/status/confirmed`)
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    response.data.forEach(element => {
                        if (element['Province'] == selectedprovince) {
                            // console.log(element)
                            recovered.push(element['Recovered']);
                            timeline.push(element['Date'].slice(0, 10))
                        }
                    });
                    document.getElementById('recoveredchartcontainer').setAttribute('style', 'display:block;')
                    Highcharts.chart('recoveredchartcontainer', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Confirmed Recovered Chart'
                        },
                        xAxis: {
                            title: {
                                text: 'Dates'
                            },
                            categories: timeline
                        },
                        yAxis: {
                            title: {
                                text: 'Recovered'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false
                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: selectedprovince,
                            data: recovered
                        }]
                    });
                });
        }
    }
});
