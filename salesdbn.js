// GLOBAL STATE
let masterData = [];
let currentFilteredData = [];
let lineChart = null;
const SALES_TARGET = 1000000;

// EVENT LISTENERS
document.getElementById('uploadBtn').onclick = () => document.getElementById('csvFileInput').click();
document.getElementById('csvFileInput').onchange = handleFileUpload;
document.getElementById('filterBtn').onclick = applyFilters;
document.getElementById('resetBtn').onclick = resetFilters;
document.getElementById('exportCsvBtn').onclick = () => exportToCSV(currentFilteredData);
document.getElementById('exportPdfBtn').onclick = exportToPDF;

// 1. FILE HANDLING & SMART PARSING
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        masterData = parseCSV(event.target.result);
        currentFilteredData = [...masterData];
        renderDashboard(currentFilteredData);
        document.getElementById('statusMessage').textContent = `Loaded ${masterData.length} records.`;
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines.shift().split(',').map(h => h.trim().replace(/["']/g, ''));
    
    return lines.map(line => {
        // Regex para sa CSV parsing na may commas sa loob ng quotes
        const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const obj = {};
        
        headers.forEach((header, i) => {
            let val = values[i] ? values[i].trim().replace(/["']/g, '') : "";
            let key = header.toLowerCase();

            // SMART DETECTION LOGIC[cite: 8]
            if (key.includes('item') || key.includes('sku') || key.includes('description')) {
                obj['sku'] = val;
            } 
            else if (key.includes('date')) {
                obj['date'] = val;
            } 
            else if (key.includes('name') || key.includes('account') || key.includes('customer')) {
                obj['salesman'] = val;
            } 
            else if (key.includes('qty') || key.includes('quantity') || key.includes('amount')) {
                let num = parseFloat(val.replace(/[^0-9.-]+/g, ""));
                obj['amount'] = isNaN(num) ? 0 : num;
            }
        });
        return obj;
    }).filter(r => r.date && (r.sku || r.salesman));
}

// 2. ORCHESTRATOR
function renderDashboard(data) {
    updateKPIs(data);
    generateInsights(data);
    renderCharts(data);
}

// 3. KPI & TOP LISTS (TOP 10 SKU + ACCOUNTS)
function updateKPIs(data) {
    const total = data.reduce((sum, row) => sum + (row.amount || 0), 0);
    document.getElementById('totalSalesValue').textContent = total.toLocaleString();
    
    // Achievement Logic
    const ach = (total / SALES_TARGET) * 100;
    document.getElementById('achievementValue').textContent = ach.toFixed(1) + '%';
    document.getElementById('progressBar').style.width = Math.min(ach, 100) + '%';

    // TOP 10 SKU (PINAKAMABAKAL)
    const salesBySku = data.reduce((acc, row) => {
        if (row.sku) acc[row.sku] = (acc[row.sku] || 0) + row.amount;
        return acc;
    }, {});
    
    const sortedSkus = Object.entries(salesBySku).sort((a,b) => b[1]-a[1]).slice(0, 10);
    const skuList = document.getElementById('topSkuList');
    
    if (sortedSkus.length > 0) {
        skuList.innerHTML = sortedSkus.map(([name, val], i) => 
            `<div class="top-item">
                <span style="color:var(--clr-accent)">${i+1}</span>
                <span>${name}</span>
                <span style="font-weight:bold">${val.toLocaleString()}</span>
            </div>`
        ).join('');
    } else {
        skuList.innerHTML = '<p class="card__sub">No SKU/Item detected.</p>';
    }

    // TOP 10 ACCOUNTS
    const salesByAccount = data.reduce((acc, row) => {
        if (row.salesman) acc[row.salesman] = (acc[row.salesman] || 0) + row.amount;
        return acc;
    }, {});
    
    const sortedAccounts = Object.entries(salesByAccount).sort((a,b) => b[1]-a[1]).slice(0, 10);
    document.getElementById('topPerformerList').innerHTML = sortedAccounts.map(([name, val], i) => 
        `<div class="top-item"><span>${i+1}</span><span>${name}</span><span>${val.toLocaleString()}</span></div>`
    ).join('');
}

// 4. INSIGHTS GENERATOR
function generateInsights(data) {
    if (!data.length) return;
    const salesByDate = data.reduce((acc, row) => { acc[row.date] = (acc[row.date] || 0) + row.amount; return acc; }, {});
    const sortedDates = Object.entries(salesByDate).sort((a,b) => b[1]-a[1]);
    
    document.getElementById('insightsContainer').innerHTML = `
        <div><small>PEAK DAY</small><p>${sortedDates[0][0]}</p></div>
        <div><small>AVG UNITS/TXN</small><p>${(data.reduce((s,r)=>s+r.amount,0)/data.length).toFixed(1)} CS</p></div>
    `;
}

// 5. CHARTING (CHART.JS)
function renderCharts(data) {
    const salesByDate = data.reduce((acc, row) => { 
        if(row.date) acc[row.date] = (acc[row.date] || 0) + row.amount; 
        return acc; 
    }, {});
    const dates = Object.keys(salesByDate).sort();

    if (lineChart) lineChart.destroy();
    lineChart = new Chart(document.getElementById('chartSalesOverTime'), {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{ 
                label: 'Volume Sold', 
                data: dates.map(d => salesByDate[d]), 
                borderColor: '#f0a500', 
                backgroundColor: 'rgba(240, 165, 0, 0.1)',
                fill: true,
                tension: 0.4 
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// 6. FILTERS
function applyFilters() {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    currentFilteredData = masterData.filter(item => {
        if (start && item.date < start) return false;
        if (end && item.date > end) return false;
        return true;
    });
    renderDashboard(currentFilteredData);
}

function resetFilters() {
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    currentFilteredData = [...masterData];
    renderDashboard(masterData);
}

// 7. EXPORTS[cite: 8]
function exportToCSV(data) {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Sales_Data_Export.csv";
    link.click();
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const dashboard = document.querySelector('.main');
    const canvas = await html2canvas(dashboard, { scale: 2, backgroundColor: "#0b0e14" });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new pdf('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, 'PNG', 0, 0, width, (canvas.height * width) / canvas.width);
    pdf.save("Dashboard_Report.pdf");
}