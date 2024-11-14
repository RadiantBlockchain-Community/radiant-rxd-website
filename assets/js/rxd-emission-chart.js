// start RXD emission chart
document.addEventListener('DOMContentLoaded', function() {
	const ctx = document.getElementById('radiantEmissionChart').getContext('2d');
	
	const years = [2022, 2024, 2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040];
	const blockRewards = [50000, 25000, 12500, 6250, 3125, 1562.5, 781.25, 390.625, 195.3125, 97.65625];
	const totalMined = [
		0, 10.5, 15.75, 18.375, 19.6875, 20.34375, 20.671875, 20.8359375, 20.91796875, 20.958984375
	];

	const data = {
		labels: years,
		datasets: [
			{
				label: 'RXD Block Reward',
				data: blockRewards,
				borderColor: '#BF0A56',
				backgroundColor: '#BF0A56',
				yAxisID: 'y-axis-1',
				stepped: true
			},
			{
				label: 'Total RXD Coins Mined (billions)',
				data: totalMined,
				borderColor: '#069BCB',
				backgroundColor: '#069BCB',
				yAxisID: 'y-axis-2'
			}
		]
	};

	const config = {
		type: 'line',
		data: data,
		options: {
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				legend: {
					labels: {
						color: '#e2e8f0'
					}
				},
				tooltip: {
					enabled: true,
					mode: 'index',
					intersect: false,
					// Tooltip styles will be dynamically updated
				}
			},
			scales: {
				x: {
					display: true,
					title: {
						display: true,
						text: 'Year',
						color: '#e2e8f0'
					},
					ticks: {
						color: '#e2e8f0'
					},
					grid: {
						color: 'rgba(226, 232, 240, 0.1)'
					}
				},
				'y-axis-1': {
					type: 'linear',
					display: true,
					position: 'left',
					title: {
						display: true,
						text: 'Block Reward',
						color: '#e2e8f0'
					},
					ticks: {
						color: '#e2e8f0',
						callback: function(value, index, values) {
							return value.toLocaleString();
						}
					},
					grid: {
						color: 'rgba(226, 232, 240, 0.1)'
					}
				},
				'y-axis-2': {
					type: 'linear',
					display: true,
					position: 'right',
					title: {
						display: true,
						text: 'Total Coins Mined (billions)',
						color: '#e2e8f0'
					},
					max: 21,
					ticks: {
						color: '#e2e8f0'
					},
					grid: {
						drawOnChartArea: false,
						color: 'rgba(226, 232, 240, 0.1)'
					}
				}
			}
		}
	};

	// Define color palettes for light and dark themes, including tooltip styles
	const themeColors = {
		light: {
			blockReward: '#E4307B',
			totalMined: '#069BCB',
			labelColor: '#333333',
			titleColor: '#333333',
			gridColor: 'rgba(0, 0, 0, 0.1)',
			tooltip: {
				backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light tooltip background
				titleColor: '#333333',                          // Dark title text
				bodyColor: '#333333'                            // Dark body text
			}
		},
		dark: {
			blockReward: '#BF0A56',
			totalMined: '#069BCB',
			labelColor: '#e2e8f0',
			titleColor: '#e2e8f0',
			gridColor: 'rgba(226, 232, 240, 0.1)',
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.8)',         // Dark tooltip background
				titleColor: '#e2e8f0',                          // Light title text
				bodyColor: '#e2e8f0'                            // Light body text
			}
		}
	};

	// Function to get the current theme
	function getCurrentTheme() {
		const theme = document.documentElement.getAttribute("data-theme");
		if (theme === 'light') return 'light';
		if (theme === 'dark') return 'dark';
		if (theme === 'system' || theme === 'default') {
			return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		return 'dark'; // Default to 'dark' if no valid theme is set
	}

	// Function to update chart colors based on theme
	function updateChartColors(chart, theme) {
		// Update dataset colors
		chart.data.datasets[0].borderColor = themeColors[theme].blockReward;
		chart.data.datasets[0].backgroundColor = themeColors[theme].blockReward;
		chart.data.datasets[1].borderColor = themeColors[theme].totalMined;
		chart.data.datasets[1].backgroundColor = themeColors[theme].totalMined;

		// Update legend labels
		chart.options.plugins.legend.labels.color = themeColors[theme].labelColor;

		// Update scales
		chart.options.scales.x.title.color = themeColors[theme].titleColor;
		chart.options.scales.x.ticks.color = themeColors[theme].labelColor;
		chart.options.scales.x.grid.color = themeColors[theme].gridColor;

		chart.options.scales['y-axis-1'].title.color = themeColors[theme].titleColor;
		chart.options.scales['y-axis-1'].ticks.color = themeColors[theme].labelColor;
		chart.options.scales['y-axis-1'].grid.color = themeColors[theme].gridColor;

		chart.options.scales['y-axis-2'].title.color = themeColors[theme].titleColor;
		chart.options.scales['y-axis-2'].ticks.color = themeColors[theme].labelColor;
		chart.options.scales['y-axis-2'].grid.color = themeColors[theme].gridColor;

		// Update Tooltip Styles
		chart.options.plugins.tooltip.backgroundColor = themeColors[theme].tooltip.backgroundColor;
		chart.options.plugins.tooltip.titleColor = themeColors[theme].tooltip.titleColor;
		chart.options.plugins.tooltip.bodyColor = themeColors[theme].tooltip.bodyColor;

		chart.update();
	}

	const chart = new Chart(ctx, config);

	// Set initial colors based on the current theme
	const currentTheme = getCurrentTheme();
	updateChartColors(chart, currentTheme);

	// Add a MutationObserver to listen for changes to the 'data-theme' attribute
	const observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.attributeName === 'data-theme') {
				const newTheme = getCurrentTheme();
				updateChartColors(chart, newTheme);
			}
		});
	});

	// Start observing the <html> element for attribute changes
	observer.observe(document.documentElement, { attributes: true });

	// Optional: Listen to system theme changes if 'system' is selected
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		const theme = getCurrentTheme(); // Re-fetch the current theme
		updateChartColors(chart, theme);
	});
});
// end RXD emission chart