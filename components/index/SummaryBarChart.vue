<template>
  <Bar :data="chartData" :options="config" :key="chartKey" />
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: Object,
});


const chartData = {
  labels: ['มกราคม', 'กุมภาพัน', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  datasets: [
    {
      label: 'รายรับ',
      data: [],
      backgroundColor: '#7E57C2',
    },
    {
      label: 'รายจ่าย',
      data: [],
      backgroundColor: '#5E35B1',
    },
  ]
}

const config = {
  scales: {
    y: {
      beginAtZero: true,
      max: Math.max(...chartData.datasets[0].data, ...chartData.datasets[1].data),
      ticks: {
        stepSize: Math.max(...chartData.datasets[0].data, ...chartData.datasets[1].data) / 100
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

defineEmits(['update:chartData']);

const chartKey = ref(0);

// Watch for changes in chartData and emit an event to notify the parent
watch(() => props.chartData, (newChartData) => {
  // Update the chartData locally
  if (newChartData) {
    chartData.datasets[0].data = newChartData.datasets[0].data;
    chartData.datasets[1].data = newChartData.datasets[1].data;

    // Update the y-axis scale max and tick stepSize
    config.scales.y.max = Math.max(...newChartData.datasets[0].data, ...newChartData.datasets[1].data);
    config.scales.y.ticks.stepSize = Math.max(...newChartData.datasets[0].data, ...newChartData.datasets[1].data) / 100;
  }
  // Emit an event to notify the parent about the updated chartData
  console.log(chartData)
  chartKey.value++;
}, { immediate: true });

onMounted(() => { });
</script>