<template>
  <Bar :data="chartData" :options="config" />
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, type ChartData } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  chartData: Object,
});

const chartData = {
  labels: ['มกราคม', 'กุมภาพัน', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  datasets: [
    {
      label: 'รายรับ',
      data: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 1200],
      backgroundColor: '#7E57C2',
    },
    {
      label: 'รายจ่าย',
      data: [500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500, 1000],
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
        // forces step size to be 50 units
        stepSize: Math.max(...chartData.datasets[0].data, ...chartData.datasets[1].data) / 100
      }
    }
  },
  responsive: true,
  maintainAspectRatio: false
};

onMounted(() => { })

defineEmits(['update:chartData']);
</script>