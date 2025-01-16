import {ApexOptions} from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { ConversationData, FormattedData, YearStats} from "../helper/types.ts";
import {useMemo} from "react";
import {Utils} from "../helper/utils.ts";

interface CalendarHeatmapProps {
    data: ConversationData[];
    year: number;
    stats: YearStats;
    colorSchemeId: 'cosmic-twilight' | 'forest-commits' | 'autumn-accessible' | 'ocean-depths';
}
export default function CalendarChart({ year, data, stats, colorSchemeId }: CalendarHeatmapProps) {

    const colorsScale = useMemo(()=>Utils.getColorRanges(colorSchemeId),[colorSchemeId])
    const colorsScheme = useMemo(()=>Utils.getColorSchemeById(colorSchemeId),[colorSchemeId])

    const formatDataForHeatmap = (data: ConversationData[]): FormattedData[] => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize formatted data with all days and months
        const formattedData: FormattedData[] = daysOfWeek.map(day => ({
            name: day,
            data: months.map(month => ({
                x: month,
                y: 0
            }))
        }));

        // Populate with actual data
        data.forEach(item => {
            const date = new Date(item.day);
            const dayOfWeek = date.getDay();
            const month = date.toLocaleString('default', { month: 'short' });

            // Find the corresponding month index in the data array
            const monthIndex = formattedData[dayOfWeek].data.findIndex(m => m.x === month);
            if (monthIndex !== -1) {
                formattedData[dayOfWeek].data[monthIndex].y = item.value;
            }
        });

        return formattedData;
    };

    const chartOptions: ApexOptions = {
        chart: {
            type: 'heatmap',
            toolbar: {
                show: false
            },
            fontFamily: 'inherit'
        },
        dataLabels: {
            enabled: false
        },
        colors: colorsScheme.colors,
        title: {
            text: `${year} Activity`,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 600
            }
        },
        subtitle: {
            text: `Total conversations: ${stats.totalConversations} - Most active day: ${new Date(stats.mostActiveDay?.day || 0).toLocaleDateString()} (${stats.mostActiveDay?.value ?? ""} conversations)`
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: colorsScale
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const value = series[seriesIndex][dataPointIndex];
                const dayOfWeek = w.globals.labels[seriesIndex];
                const month = w.globals.seriesXvalues[seriesIndex][dataPointIndex];
                return `
                    <div class="apexcharts-tooltip-custom">
                        <span>${dayOfWeek}, ${month} ${year}</span><br/>
                        <span>Conversations: ${value}</span>
                    </div>
                `;
            }
        },
        xaxis: {
            type: 'category',
            labels: {
                show: true,
                rotate: 0,
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit'
                }
            }
        },
        yaxis: {
            labels: {
                show: true,
                style: {
                    fontSize: '12px',
                    fontFamily: 'inherit'
                }
            }
        }
    };

    return (
        <div className="mb-12">
            <div className="h-[300px]">
                <ReactApexChart
                    options={chartOptions}
                    series={formatDataForHeatmap(data)}
                    type="heatmap"
                    height={300}
                />
            </div>
        </div>
    );
}