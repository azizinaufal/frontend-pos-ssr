<script setup lang="ts">
import Cookies from 'js-cookie';
import generateRandomColors from "@/utils/generateRandomColors.ts";
import {getImageUrl} from "@/utils/getImageUrl.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ClientOnly from '@/components/ClientOnly.vue';
const VueApexCharts = defineAsyncComponent(() =>
    import('vue3-apexcharts')
);
import { ref, onMounted, watchEffect,defineAsyncComponent } from "vue";
import Api from "@/services/api.js";

import { moneyFormat } from "@/utils/moneyFormat.ts";

//Penjualan hari ini dan mingguan
const countSalesToday = ref(0);
const sumSalesToday = ref(0);
const sumSalesWeek = ref(0);
const salesDate = ref([]);
const salesTotal = ref([]);
const salesChartOptions = ref({});
const salesChartSeries = ref([]);

//Perhitungan Profit
const sumProfitsToday = ref(0);
const sumProfitsWeek = ref(0);
const profitsDate = ref([]);
const profitsTotal = ref([]);
const profitsChartOptions = ref({});
const profitsChartSeries = ref([]);

//Penjualan Terbaik
const productsBestSelling = ref([]);
const productBestSellingChartOptions = ref({});
const bestProductSellingChartSereis = ref([]);

//Stok limit
const productsLimitStock = ref([]);

const fetchData = async () => {
  const token =  Cookies.get('token');

  if (token) {
    try {
      Api.defaults.headers.common["Authorization"] = token;
      const response = await Api.get("/api/dashboard");


      countSalesToday.value = response.data.data.count_sales_today;
      sumSalesToday.value = response.data.data.sum_sales_today;
      sumSalesWeek.value = response.data.data.sum_sales_week;
      salesDate.value = response.data.data.sales.sales_date;
      salesTotal.value = response.data.data.sales.sales_total;

      sumProfitsToday.value = response.data.data.sum_profits_today;
      sumProfitsWeek.value = response.data.data.sum_profit_week;
      profitsDate.value = response.data.data.profits.profits_date;
      profitsTotal.value = response.data.data.profits.profits_total;

      productsBestSelling.value = response.data.data.best_selling_products;

      productsLimitStock.value = response.data.data.products_limit_stock;
    } catch (error) {
      console.error("Error fetching dashboard data");
    }
  } else {
    console.error("Token tidak ada!");
  }
};

const commonChartOptions = {
  fontFamily: 'inherit',
  animations: { enabled: false },
  dataLabels: { enabled: false },
  grid: { strokeDashArray: 4 },
  tooltip: { theme: 'dark' },
  xaxis: {
    labels: { padding: 0 },
    tooltip: { enabled: false },
    axisBorder: { show: false },
    type: 'datetime',
  },
  yaxis: { labels: { padding: 2 } },
  colors: ['#206bc4'],
  legend: { show: false },
};

watchEffect(() => {


  if (salesTotal.value.length > 0) {
    salesChartSeries.value = [{
      name: "Sales",
      data: salesTotal.value,
    }];

    salesChartOptions.value = {
      ...commonChartOptions,
      chart: {
        type: "area",
        height: 40.0,
        sparkline: { enabled: true   }
      },
      fill: { opacity: 0.10, type: 'solid' },
      stroke: { width: 2, lineCap: "round", curve: "smooth"},
      labels: salesDate.value,
      colors: ['#206bc4'],
    };
  }

  if(profitsTotal.value.length > 0) {
    profitsChartSeries.value = [{
      name: "Profits",
      data: profitsTotal.value,
    }];
    profitsChartOptions.value = {
      ...commonChartOptions,
      chart:{
        type: "bar",
        height: 40.0,
        sparkline: { enabled: true   }
      },
      fill: { opacity: 1, type: 'solid' },
      plotOptions: {
        bar:{
          columnWidth: '50%',
        },
      },
      labels: profitsDate.value,
    };
  }

  if(productsBestSelling.value.length > 0) {
    bestProductSellingChartSereis.value= productsBestSelling.value.map(product=>product.total);
    productBestSellingChartOptions.value = {
      chart:{
        type:'pie',
        height:'auto',
      },
      labels:productsBestSelling.value.map(product=>product.title),
      responsive:[{
        breakpoint: 640,
        options: {
          chart: {
            width: '100%',
          },
          legend: {
            position: 'bottom',
          }
        }
      },
        {
          // Tablets
          breakpoint: 1024,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: 'bottom',
            }
          }
      }],
      colors:generateRandomColors(productsBestSelling.value.length),
      legend:{
        position: 'bottom',
      },
      tooltip:{
        y:{
          formatter:(val)=>`${val}`
        }
      }
    };
  }
});
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="container">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4">

      <div class="w-full h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Penjualan Hari Ini</CardTitle>
            <CardDescription>Hasil total penjualan hari ini</CardDescription>
          </CardHeader>
          <CardContent class="grow">
            <div class="text-2xl font-medium">{{ countSalesToday }}</div>
            <div class="my-2 h-0.5 border-t-0 bg-neutral-600 dark:bg-white/10"></div>
            <div class="pb-4 font-bold text-2xl">{{ moneyFormat(sumSalesToday) }}</div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      <div class="w-full h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Keuntungan Hari Ini</CardTitle>
            <CardDescription>Keuntungan Penjualan Hari Ini</CardDescription>
          </CardHeader>
          <CardContent class="grow">
            <div class="pb-4 font-bold text-2xl">{{ moneyFormat(sumProfitsToday) }}</div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      <div class="w-full h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Penjualan</CardTitle>
            <CardDescription>7 Hari Terakhir</CardDescription>
          </CardHeader>
          <CardContent class="grow px-0">
            <div class="px-6 font-bold">{{ moneyFormat(sumSalesWeek) }}</div>
          </CardContent>
          <CardFooter>
            <ClientOnly>
              <VueApexCharts type="area" height="70" :options="salesChartOptions" :series="salesChartSeries" />
            </ClientOnly>
          </CardFooter>
        </Card>
      </div>

      <div class="w-full h-full">
        <Card class="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Keuntungan</CardTitle>
            <CardDescription>Keuntungan 7 Hari Terakhir</CardDescription>
          </CardHeader>
          <CardContent class="grow px-0">
            <div class="px-6 font-bold">{{ moneyFormat(sumProfitsWeek) }}</div>

          </CardContent>
          <CardFooter>
            <ClientOnly>
              <VueApexCharts type="bar" height="65" :options="profitsChartOptions" :series="profitsChartSeries" />
            </ClientOnly>
          </CardFooter>
        </Card>
      </div>

    </div>
  </div>

<div class="container">
  <div class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3">
    <div class="mt-4 bg-white shadow-sm w-full rounded-xl border py-6 shadow-sm lg:col-span-2">
      <h5 class="font-bold mx-4 ">PRODUK TERLARIS</h5>
      <div class="border-b-4 border-gray-100 my-4"></div>
      <div class="w-full flex justify-center">
        <VueApexCharts
            type="pie"
            :options="productBestSellingChartOptions"
            :series="bestProductSellingChartSereis"
            width="100%"
        />
      </div>
    </div>
    <div class="mt-4 bg-white shadow-sm w-full rounded-xl border py-6 shadow-sm">
      <h5 class="font-bold mx-4 ">PRODUK DENGAN STOK LIMIT</h5>
      <div class="border-b-4 border-gray-100 my-4"></div>
      <div v-for="product in productsLimitStock" :key="product.id" class="mb-4 px-6 flex">
        <img :src="`${getImageUrl(product.image)}`" :alt="product.title" width="50" height="50" class="me-3" />
        <div class="flex flex-col">
          <h4 class="mb-0 font-bold">{{ product.title }}</h4>
          <hr class="mb-1 mt-1" />
          <p class="text-red-600 text-xs mb-0">Stock: {{ product.stock }}</p>
          <p class="text-red-600 text-xs">Peringatan: {{product.warning}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
<style scoped>
</style>
