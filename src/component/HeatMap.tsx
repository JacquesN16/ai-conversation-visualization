import { useState } from 'react';
import { Download } from "lucide-react";
import {ConversationData, HeatMapProps,  YearStats} from "../helper/types.ts";
import {Utils} from "../helper/utils.ts";
import {toPng} from "html-to-image";
import CalendarChart from "./CalendarChart.tsx";
import ColorSchemeSelect, {ColorScheme} from "./ColorSchemeSelector.tsx";



export default function HeatMap({ data, model }: HeatMapProps) {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const [selectedScheme, setSelectedScheme] = useState<ColorScheme['id']>('cosmic-twilight');
    const [downloading, setDownloading] = useState(false);

    const currentYearData = data.filter(item =>
        item.day.startsWith(currentYear.toString())
    );
    const previousYearData = data.filter(item =>
        item.day.startsWith(previousYear.toString())
    );

    const getYearStats = (yearData: ConversationData[]): YearStats => ({
        totalConversations: yearData.reduce((sum, item) => sum + item.value, 0),
        mostActiveDay: yearData.length > 0 ?
            yearData.reduce((max, item) =>
                item.value > (max?.value || 0) ? item : max, yearData[0]
            ) : null
    });


    const downloadHeatmap = async () => {
        setDownloading(true);
        try {
            const element = document.getElementById('charts-container');
            if (!element) {
                throw new Error('Heatmap container not found');
            }

            const dataUrl = await toPng(element, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });

            const link = document.createElement('a');
            const nowTs = new Date().getTime()
            link.download = `${Utils.getModelName(model)}-heatmap-${Math.trunc(nowTs/1000)}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error downloading heatmap:', error);
            throw error;
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-100">
                <h2 className="text-2xl font-bold">Your {Utils.getModelName(model)} usage</h2>
                <div className='flex items-center gap-1'>
                    <span>Theme</span>
                    <ColorSchemeSelect
                        value={selectedScheme}
                        onChange={setSelectedScheme}
                    />
                </div>

                <button
                    onClick={downloadHeatmap}
                    disabled={downloading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4 mr-2" />
                    {downloading ? "Downloading..." : "Download"}
                </button>
            </div>
            <div id="charts-container" className="bg-white p-8 rounded-lg">
                {!!previousYearData.length && (
                    <CalendarChart
                        data={previousYearData}
                        year={previousYear}
                        stats={getYearStats(previousYearData)}
                        colorSchemeId={selectedScheme}
                    />
                )}
                {!!currentYearData.length && (
                    <CalendarChart
                        data={currentYearData}
                        year={currentYear}
                        stats={getYearStats(currentYearData)}
                        colorSchemeId={selectedScheme}
                />)}

            </div>
        </div>
    );
}


