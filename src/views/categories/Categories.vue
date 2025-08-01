<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
const CreateCategory = defineAsyncComponent(()=>import('./Create.vue'));
const EditCategory = defineAsyncComponent(()=>import('./Edit.vue'));
import DeleteButton from '../components/Delete.vue';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {ref, onMounted, defineAsyncComponent} from 'vue';
import Api from '@/services/api.ts';
import Cookies from 'js-cookie';
import {getImageUrl} from "@/utils/getImageUrl.ts";
import {VueAwesomePaginate} from "vue-awesome-paginate";
const categories = ref([]);
const pagination = ref({
  currentPage: 1,
  perPage: 5,
  total: 0,
});

const keywords = ref("");

const fetchData = async (pageNumber = 1, search="") => {
  const token = Cookies.get('token');

  if(token){
    Api.defaults.headers.common['Authorization'] = token;

    try {
      const response = await Api.get(`/api/categories?page=${pageNumber}&search=${search}`);
      categories.value = response.data.data;
      pagination.value = {
        currentPage: response.data.pagination.currentPage,
        perPage:response.data.pagination.perPage,
        total: response.data.pagination.total,
      }
    }catch(err){
        console.error('Error Fetching Data : ', err);
    }
  }else{
    console.error('Token tidak valid');
  }
};

onMounted(() => {
  fetchData();
});

const searchHandler = ()=>{
  fetchData(1,keywords.value);
};

const handleKeyDown = (e)=>{
  if(e.key=== 'Enter') {
    searchHandler();
  }
};
</script>

<template>
  <div class="flex flex-col justify-between m-6">
    <div class="flex flex-col">
      <p class="font-sans text-gray-600 text-s">HALAMAN</p>
      <h2 class="font-bold text-2xl">KATEGORI</h2>
    </div>
    <div class="my-8 flex items-center ">
        <CreateCategory :fetchData="fetchData" />
      <Input id="search" type="text" placeholder="Cari Kategori" class="pl- 10" v-model="keywords" @keydown="handleKeyDown" />
      <Button class="ml-2 bg-blue-600 rounded-md h-8 hover:bg-sky-700" @click="searchHandler">Cari</Button>
    </div>
    <div class="rounded-md border overflow-x-scroll scrollbar-visible  w-full">
      <Table class="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead class="whitespace-nowrap">Nama Kategori</TableHead>
            <TableHead class="whitespace-nowrap">Deskripsi</TableHead>
            <TableHead class="whitespace-nowrap">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(category, index) in categories" :key="index">
            <TableCell>
              <div class="flex items-center py-1 max-w-[200px] md:max-w-none">
                <img
                    :src="getImageUrl(category.image)"
                    :alt="category.name"
                    class="w-10 h-10 rounded-full object-cover mr-3 shrink-0"
                />
                <p class="font-medium text-gray-900 truncate">{{ category.name }}</p>
              </div>
            </TableCell>
            <TableCell>
              <p class="text-gray-600 max-w-[300px] md:max-w-none truncate">
                {{ category.description }}
              </p>
            </TableCell>
            <TableCell>
              <div class="flex flex-wrap gap-2">
                <EditCategory :categoryId="category.id" :fetchData="fetchData" />
                <DeleteButton :id="category.id" endpoint="/api/categories" :fetchData="fetchData" />
              </div>
            </TableCell>
          </TableRow>

          <TableRow v-if="!categories.length">
            <TableCell colspan="3" class="text-center">
              <div class="bg-red-100 text-red-600 p-4 rounded-md">
                Data Belum Tersedia!
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>


    <div class="text-end">
      <VueAwesomePaginate :total-items="pagination.total" :items-per-page="pagination.perPage" :max-pages-shown="2" v-model="pagination.currentPage" @click="fetchData"
                          :container-class="'paginate-container'"
                          :page-class="'paginate-buttons'"
                          :active-page-class="'active'"/>
    </div>
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.paginate-buttons {
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: black;
  cursor: pointer;
}

.paginate-buttons.active {
  background-color: #2563eb;
  color: white;
  border-color: #2563eb;
}
</style>