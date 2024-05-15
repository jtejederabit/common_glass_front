<script setup lang="ts">
import {onMounted, ref, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getCustomers} from "../services/customers.ts";
import {getCustomerProducts} from "../services/products.ts";
import {customerColumns, customerSearchProps, productColumns, productSearchProps} from "../utils/constants.ts";
import {ICustomer, IProduct} from "../utils/types.ts";
import {externalLink, userIcon} from "../assets/icons/icons.ts";
import Modal from "../components/modal/modal.vue";
import DataTable from "../components/table/DataTable.vue";

const route = useRoute();
const router = useRouter();

const customers = ref<ICustomer[]>([]);
const products = ref<IProduct[]>([]);
const visible = ref<boolean>(false);
const selectedCustomer = ref<ICustomer | undefined>();
const loadingCustomerData = ref<boolean>(false);
const loadingCustomerProducts = ref<boolean>(false);
const errorAlert = ref<boolean>(false);

const customerTableData = computed(() => {
  return customers.value.map((customer) => {
    return {
      ...customer,
      docNum: `${customer.docNum} (${customer.docType.toUpperCase()})`,
      action: {
        actionText: 'Obrir',
        actionIcon: externalLink,
        action: () => toggleModal(customer.customerId)
      }
    };
  });
});

const loadCustomerData = async () => {
  try{
    loadingCustomerData.value = true;
    await getCustomers().then((data) => {
      customers.value = data;
    });
  } catch (error) {
    errorAlert.value = true;
  }finally {
    loadingCustomerData.value = false;
  }
};

const loadCustomerProducts = async () => {
  if(!selectedCustomer.value) return;
  try{
    loadingCustomerProducts.value = true;
    await getCustomerProducts(selectedCustomer.value.customerId).then((data) => {
      products.value = data;
    });
  } catch (error) {
    errorAlert.value = true;
  } finally {
    loadingCustomerProducts.value = false;
  }
};

const toggleModal = (customerId?: string) => {
  if (customerId) {
    selectedCustomer.value = customers.value.find(customer => customer.customerId === customerId);
    loadCustomerProducts();
  }

  if(products.value.length) {
    products.value = [];
  }
  visible.value = !visible.value;
};

// En aquesta vista actualitzem la query de la ruta amb la currentPage
const updateQuery = (query: Record<any, any>) => {
  router.push({
    name: 'home',
    query: { ...route.query, ...query }
  })
};

onMounted(() => {
  loadCustomerData();
});

</script>

<template>
  <Modal :visible="visible" @toggle="toggleModal">
    <template v-slot:header>
      <div class="flex items-center gap-2">
        <span v-html="userIcon"></span>
        <h2 class="text-2xl font-semibold">
          {{ selectedCustomer?.givenName }}
        </h2>
      </div>
    </template>

    <template v-slot:body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col">
          <label class="font-bold">Nom:</label>
          <span>{{ selectedCustomer?.givenName }}</span>

          <label class="font-bold">Email:</label>
          <span>{{ selectedCustomer?.email }}</span>

          <label class="font-bold">Tipus de document:</label>
          <span>{{ selectedCustomer?.docType.toUpperCase() }}</span>
        </div>
        <div class="flex flex-col">
          <label class="font-bold">Cognom:</label>
          <span>{{ selectedCustomer?.familyName1 }}</span>

          <label class="font-bold">Telèfon:</label>
          <span>{{ selectedCustomer?.phone }}</span>

          <label class="font-bold">Numero de document:</label>
          <span>{{ selectedCustomer?.docNum }}</span>
        </div>
      </div>
      <hr class="my-4 border-gray-300" />
      <span class="font-bold">Productes contractats</span>
      <DataTable
          :items="products"
          :columns="productColumns"
          :search-props="productSearchProps"
          search
      >
        <template v-slot:not-found>
          <p>{{ loadingCustomerProducts ? 'Carregant dades...' : 'No s\'han trobat productes' }}</p>
        </template>
      </DataTable>
    </template>
  </Modal>

  <div class="w-full min-h-screen flex flex-col items-center justify-center p-5">
    <div class="w-full max-w-4xl p-5 mx-auto bg-white md:shadow-md md:rounded-md min-h-[493px]">
      <h1 class="text-3xl font-bold mb-5">Clients</h1>
      <DataTable
          :items="customerTableData"
          :columns="customerColumns"
          :search-props="customerSearchProps"
          :action="true"
          :current-page="Number(route.query.currentPage)"
          search
          pagination
          @toggle="toggleModal"
          @update-query="updateQuery"
      >
        <template v-slot:not-found>
          <p>{{ loadingCustomerData ? 'Carregant dades...' : 'No s\'han trobat clients' }}</p>
        </template>
      </DataTable>
      <div v-if="errorAlert" class="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-md text-red-700 bg-red-100 border border-red-300 mt-5">
        <div slot="avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-octagon w-5 h-5 mx-2">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="text-xl font-normal  max-w-full flex-initial">
          Hi ha hagut un error al carregar les dades. Torna a intentar-ho.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
