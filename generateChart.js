const fs = require('fs');
const path = require('path');

// Параметры из JSON
const config = {
  data: [
    { language: 'JS', value: 70 },
    { language: 'Python', value: 50 },
    { language: 'Java', value: 40 },
    { language: 'C++', value: 30 },
    { language: 'Ruby', value: 20 }
  ],
  color: '#4285F4',
  width: 650,
  height: 400,
  padding: 50,
  barWidth: 45,
  spacing: 15,
  borderRadius: 10
};

function generateSVG(data) {
  const maxValue = Math.max(...data.map(item => item.value));
  const totalBarsWidth = data.length * config.barWidth + (data.length - 1) * config.spacing;
  const startX = (config.width - totalBarsWidth) / 2;
  
  let svg = `
    <svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .bar {
          fill: ${config.color};
          transform-origin: bottom;
        }
        .label {
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: bold;
          fill: #333;
          text-anchor: middle;
        }
      </style>
  `;

  // Горизонтальная линия (ось X) - черная и жирная
  svg += `
    <line x1="${startX}" y1="${config.height - config.padding}" x2="${startX + totalBarsWidth}" y2="${config.height - config.padding}" stroke="black" stroke-width="2" />
  `;

  // Добавляем столбцы с анимацией
  data.forEach((item, index) => {
    const x = startX + index * (config.barWidth + config.spacing);
    const barHeight = (item.value / maxValue) * (config.height - 2 * config.padding);
    const y = config.height - config.padding - barHeight;

    // Столбец с закруглением только сверху
    svg += `
      <rect class="bar" x="${x}" y="${config.height - config.padding}" width="${config.barWidth}" height="0" rx="${config.borderRadius}" ry="${config.borderRadius}" style="rx:${config.borderRadius}; ry:${config.borderRadius};">
        <animate attributeName="height" from="0" to="${barHeight}" dur="0.8s" begin="${index * 0.15}s" fill="freeze" calcMode="spline" keyTimes="0; 1" keySplines="0.1 0.8 0.2 1" />
        <animate attributeName="y" from="${config.height - config.padding}" to="${y}" dur="0.8s" begin="${index * 0.15}s" fill="freeze" calcMode="spline" keyTimes="0; 1" keySplines="0.1 0.8 0.2 1" />
        <animate attributeName="rx" from="0" to="${config.borderRadius}" dur="0.8s" begin="${index * 0.15}s" fill="freeze" />
        <animate attributeName="ry" from="0" to="${config.borderRadius}" dur="0.8s" begin="${index * 0.15}s" fill="freeze" />
      </rect>
    `;

    // Надпись над столбиком
    svg += `
      <text class="label" x="${x + config.barWidth / 2}" y="${y - 10}">${item.language}</text>
    `;
  });

  svg += '</svg>';

  return svg;
}

// Создаем папку dist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Генерируем и сохраняем SVG
const svgContent = generateSVG(config.data);
fs.writeFileSync(path.join(distDir, 'chart.svg'), svgContent);

console.log('SVG chart generated successfully in dist/chart.svg');