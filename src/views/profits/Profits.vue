<script setup lang="ts">
import {defineAsyncComponent, ref} from 'vue';
import Api from '@/services/api.ts';
import Cookies from "js-cookie";
import {moneyFormat} from "@/utils/moneyFormat.ts";
const ExportButton = defineAsyncComponent(()=>import('../components/ExportButton.vue'));
import {Funnel} from "lucide-vue-next";
const profits = ref([]);
const startDate = ref('');
const endDate = ref('');
const total = ref();

const token = Cookies.get('token');

const filterProfits = async (e) => {
  e.preventDefault();
  if(token){
    try {
      Api.defaults.headers.Authorization = token;
      const response = await Api.get(`/api/profits?start_date=${startDate.value}&end_date=${endDate.value}`);
      profits.value = response.data.data.profits;
      total.value = response.data.data.total;
    }catch(err){
      console.log("Gagal mengambil data", err);
    }
  }else{
    console.log("Token tidak valid");
  }
}
</script>

<template>
  <div class="flex flex-col m-6">
    <div class="flex flex-col">
      <p class="font-sans text-gray-600 text-s">HALAMAN</p>
      <h2 class="font-bold text-2xl">PROFITS</h2>
    </div>
<!--    <form @submit="filterProfits">-->
<!--      <div class="flex my-4 bg-white border shadow-sm rounded-sm p-4 gap-4  items-center ">-->
<!--        <div class="flex flex-col gap-2 my-2 w-full">-->
<!--          <label class="font-bold">TANGGAL AWAL</label>-->
<!--          <input v-model="startDate" type="date" class="bg-white shadow-sm border border-b-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-b-blue-500 block w-full p-2.5">-->
<!--        </div>-->
<!--        <div class="flex flex-col gap-2 my-2 w-full">-->
<!--          <label class="font-bold">TANGGAL AKHIR</label>-->
<!--          <input v-model="endDate" type="date"  class="bg-white shadow-sm border border-b-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-b-blue-500 block w-full p-2.5">-->
<!--        </div>-->
<!--        <div class="mt-6 gap-4 flex flex-col">-->
<!--          <button class="text-white px-8 items-center ml-2 bg-blue-600 rounded-lg h-8 hover:bg-sky-700 flex">-->
<!--            <Funnel></Funnel>-->
<!--            Filter-->
<!--          </button>-->
<!--          <ExportButton :startDate="startDate" :endDate="endDate" type="profits" />-->
<!--        </div>-->

<!--      </div>-->
<!--    </form>-->

    <form @submit="filterProfits">
      <div class="container">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 gap-4 lg:grid-cols-3  ">
          <div class="flex flex-col gap-2 my-2 w-full">
            <label class="font-bold">TANGGAL AWAL</label>
            <input v-model="startDate" type="date" class="bg-white shadow-sm border border-b-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-b-blue-500 block w-full p-2.5">
          </div>
          <div class="flex flex-col gap-2 my-2 w-full">
            <label class="font-bold">TANGGAL AKHIR</label>
            <input v-model="endDate" type="date"  class="bg-white shadow-sm border border-b-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-b-blue-500 block w-full p-2.5">
          </div>
          <div class="mt-6 gap-4 w-1/2 flex flex-col  items-center md:items-center">
            <button class=" text-white w-full justify-center p-4 items-center bg-blue-600 rounded-md h-8 hover:bg-sky-700 flex">
              <Funnel></Funnel>
              Filter
            </button>
            <ExportButton :startDate="startDate" :endDate="endDate" type="profits" />
          </div>

        </div>
      </div>

    </form>


    <div v-if="profits.length > 0" class="overflow-x-auto rounded-md border mt-8">
      <table class="min-w-full table-auto border-collapse border border-gray-400 text-sm text-center">
        <thead class="bg-gray-200">
        <tr>
          <th class="p-2 border border-gray-300 whitespace-nowrap">Date</th>
          <th class="p-2 border border-gray-300 whitespace-nowrap">Invoice</th>
          <th class="p-2 border border-gray-300 whitespace-nowrap">Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(profit, index) in profits" :key="index">
          <td class="p-2 border border-gray-300 whitespace-nowrap">{{ profit.created_at }}</td>
          <td class="p-2 border border-gray-300 whitespace-nowrap">{{ profit.transaction.invoice }}</td>
          <td class="p-2 border border-gray-300 text-right whitespace-nowrap">{{ moneyFormat(profit.total) }}</td>
        </tr>
        <tr>
          <td colspan="2" class="text-center font-bold p-2 border border-gray-300">Total</td>
          <td class="text-end font-bold p-2 border border-gray-300 whitespace-nowrap">{{ moneyFormat(total) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>

</style>