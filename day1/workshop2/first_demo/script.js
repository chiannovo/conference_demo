// 智慧家庭電器儀表板 JavaScript

class SmartHomeDashboard {
    constructor() {
        this.appliances = {
            'air-conditioner': { name: '冷氣', power: 850, isOn: false, icon: '❄️' },
            'light': { name: '燈光', power: 60, isOn: false, icon: '💡' },
            'tv': { name: '電視', power: 200, isOn: false, icon: '📺' },
            'refrigerator': { name: '冰箱', power: 150, isOn: true, icon: '🧊' }
        };
        
        this.currentPeriod = 'weekly';
        this.chart = null;
        
        this.init();
    }

    init() {
        this.updateCurrentTime();
        this.setupEventListeners();
        this.initializeAppliances();
        this.createPowerChart();
        this.updateAnalytics();
        
        // 每秒更新時間
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // 每5秒更新分析數據
        setInterval(() => this.updateAnalytics(), 5000);
    }

    // 更新當前時間
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    // 設置事件監聽器
    setupEventListeners() {
        // 家電開關按鈕
        Object.keys(this.appliances).forEach(applianceId => {
            const toggleBtn = document.getElementById(`${applianceId}-toggle`);
            toggleBtn.addEventListener('click', () => this.toggleAppliance(applianceId));
        });

        // 用電量統計切換按鈕
        document.getElementById('weekly-btn').addEventListener('click', () => this.switchPeriod('weekly'));
        document.getElementById('monthly-btn').addEventListener('click', () => this.switchPeriod('monthly'));
    }

    // 初始化家電狀態
    initializeAppliances() {
        Object.keys(this.appliances).forEach(applianceId => {
            this.updateApplianceDisplay(applianceId);
        });
    }

    // 切換家電開關
    toggleAppliance(applianceId) {
        this.appliances[applianceId].isOn = !this.appliances[applianceId].isOn;
        this.updateApplianceDisplay(applianceId);
        this.updateAnalytics();
    }

    // 更新家電顯示
    updateApplianceDisplay(applianceId) {
        const appliance = this.appliances[applianceId];
        const statusIndicator = document.getElementById(`${applianceId}-status`);
        const statusText = document.getElementById(`${applianceId}-text`);
        const powerDisplay = document.getElementById(`${applianceId}-power`);
        const toggleBtn = document.getElementById(`${applianceId}-toggle`);

        if (appliance.isOn) {
            statusIndicator.classList.add('active');
            statusText.textContent = '開啟';
            powerDisplay.textContent = `${appliance.power}W`;
            toggleBtn.textContent = '關閉';
            toggleBtn.classList.add('active');
        } else {
            statusIndicator.classList.remove('active');
            statusText.textContent = '關閉';
            powerDisplay.textContent = '0W';
            toggleBtn.textContent = '開啟';
            toggleBtn.classList.remove('active');
        }
    }

    // 切換統計期間
    switchPeriod(period) {
        this.currentPeriod = period;
        
        // 更新按鈕狀態
        document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${period}-btn`).classList.add('active');
        
        // 重新創建圖表
        this.createPowerChart();
    }

    // 創建用電量圖表
    createPowerChart() {
        const data = this.getPowerData();
        
        this.chart = Highcharts.chart('powerChart', {
            chart: {
                type: 'line',
                backgroundColor: 'transparent',
                style: {
                    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                }
            },
            title: {
                text: this.currentPeriod === 'weekly' ? '本週用電量趨勢' : '本月用電量趨勢',
                style: {
                    color: '#e2e8f0',
                    fontSize: '16px'
                }
            },
            xAxis: {
                categories: data.categories,
                labels: {
                    style: {
                        color: '#a0aec0'
                    }
                },
                gridLineColor: 'rgba(255, 255, 255, 0.1)'
            },
            yAxis: {
                title: {
                    text: '用電量 (kWh)',
                    style: {
                        color: '#a0aec0'
                    }
                },
                labels: {
                    style: {
                        color: '#a0aec0'
                    }
                },
                gridLineColor: 'rgba(255, 255, 255, 0.1)'
            },
            series: [{
                name: '用電量',
                data: data.values,
                color: '#4facfe',
                lineWidth: 3,
                marker: {
                    radius: 6,
                    fillColor: '#4facfe',
                    lineWidth: 2,
                    lineColor: '#ffffff'
                }
            }],
            legend: {
                itemStyle: {
                    color: '#a0aec0'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(45, 55, 72, 0.9)',
                borderColor: '#4facfe',
                style: {
                    color: '#ffffff'
                }
            },
            plotOptions: {
                line: {
                    animation: {
                        duration: 1000
                    }
                }
            }
        });
    }

    // 獲取用電量數據
    getPowerData() {
        if (this.currentPeriod === 'weekly') {
            return {
                categories: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
                values: [45.2, 52.8, 38.6, 61.4, 48.9, 67.3, 55.1]
            };
        } else {
            return {
                categories: ['第1週', '第2週', '第3週', '第4週'],
                values: [285.6, 312.4, 298.7, 324.8]
            };
        }
    }

    // 更新分析數據
    updateAnalytics() {
        this.updatePeakTime();
        this.updateHighestConsumer();
    }

    // 更新最高用電時段
    updatePeakTime() {
        const peakTimes = [
            '19:00-21:00', '18:30-20:30', '20:00-22:00', 
            '19:30-21:30', '18:00-20:00'
        ];
        const randomPeakTime = peakTimes[Math.floor(Math.random() * peakTimes.length)];
        document.getElementById('peak-time').textContent = randomPeakTime;
    }

    // 更新最高耗電家電
    updateHighestConsumer() {
        const activeAppliances = Object.entries(this.appliances)
            .filter(([_, appliance]) => appliance.isOn)
            .sort((a, b) => b[1].power - a[1].power);

        if (activeAppliances.length > 0) {
            const [applianceId, appliance] = activeAppliances[0];
            document.getElementById('highest-consumer').textContent = appliance.name;
            document.getElementById('highest-power').textContent = `${appliance.power}W`;
        } else {
            document.getElementById('highest-consumer').textContent = '無';
            document.getElementById('highest-power').textContent = '0W';
        }
    }

    // 獲取總用電量
    getTotalPowerConsumption() {
        return Object.values(this.appliances)
            .filter(appliance => appliance.isOn)
            .reduce((total, appliance) => total + appliance.power, 0);
    }

    // 模擬用電量數據生成
    generateSimulatedData() {
        const baseConsumption = this.getTotalPowerConsumption();
        const variation = Math.random() * 0.2 - 0.1; // ±10% 變化
        return Math.max(0, baseConsumption * (1 + variation));
    }
}

// 頁面載入完成後初始化儀表板
document.addEventListener('DOMContentLoaded', () => {
    new SmartHomeDashboard();
});

// 添加一些動態效果
document.addEventListener('DOMContentLoaded', () => {
    // 為家電卡片添加點擊動畫
    document.querySelectorAll('.appliance-card').forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // 為按鈕添加點擊效果
    document.querySelectorAll('.toggle-btn, .period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
});

// 添加鍵盤快捷鍵支持
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '1':
            document.getElementById('air-conditioner-toggle').click();
            break;
        case '2':
            document.getElementById('light-toggle').click();
            break;
        case '3':
            document.getElementById('tv-toggle').click();
            break;
        case '4':
            document.getElementById('refrigerator-toggle').click();
            break;
        case 'w':
            document.getElementById('weekly-btn').click();
            break;
        case 'm':
            document.getElementById('monthly-btn').click();
            break;
    }
});

// 添加響應式處理
window.addEventListener('resize', () => {
    if (window.innerWidth < 1920) {
        document.querySelector('.dashboard').style.width = '100%';
        document.querySelector('.dashboard').style.height = '100vh';
    } else {
        document.querySelector('.dashboard').style.width = '1920px';
        document.querySelector('.dashboard').style.height = '1080px';
    }
});
